import torch
import torch.nn as nn
import torch.optim as optim
from torchvision.models import resnet50, ResNet50_Weights
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from sklearn.metrics import confusion_matrix, classification_report, precision_recall_curve, roc_curve, auc, f1_score
from sklearn.preprocessing import label_binarize
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import copy
import os

# CUDA 사용 가능 여부 확인
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
print(device)

# 데이터셋 경로 설정 (224x224 이미지 데이터셋 폴더)
data_dir = "C:/Users/SSAFY/Desktop/yolo8/datasets_resnet"

# 데이터 전처리 (ResNet50에 맞는 Normalize 값과 Augmentation 적용)
data_transforms = {
    'train': transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
    'valid': transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
    'test': transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}

# 데이터셋 로드
image_datasets = {x: datasets.ImageFolder(os.path.join(data_dir, x), data_transforms[x]) for x in ['train', 'valid', 'test']}
dataloaders = {x: DataLoader(image_datasets[x], batch_size=16, shuffle=True, num_workers=0) for x in ['train', 'valid', 'test']}
dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'valid', 'test']}
class_names = image_datasets['train'].classes
num_classes = len(class_names)

# Pretrained ResNet50 모델 불러오기 (최신 가중치 사용)
model = resnet50(weights=ResNet50_Weights.DEFAULT)

# 마지막 레이어 수정 (전이 학습)
model.fc = nn.Linear(model.fc.in_features, num_classes)

# 모델을 GPU로 이동 (가능한 경우)
model = model.to(device)

# 손실 함수와 옵티마이저 설정 
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.fc.parameters(), lr=0.001, weight_decay=0.001)


# 조기 종료 클래스
class EarlyStopping:
    def __init__(self, patience=5, min_delta=0):
        """
        조기 종료를 위한 클래스
        Args:
        - patience (int): 성능 개선이 없는 에폭 수를 얼마나 기다릴지 설정
        - min_delta (float): 성능 개선을 고려할 최소 변화량
        """
        self.patience = patience
        self.min_delta = min_delta
        self.best_loss = None
        self.counter = 0
        self.early_stop = False

    def __call__(self, val_loss):
        # 최초에는 검증 손실을 기록
        if self.best_loss is None:
            self.best_loss = val_loss
        # 현재 손실이 이전보다 개선되었는지 확인
        elif val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.counter = 0  # 성능이 개선되었으므로 카운터 초기화
        # 성능 개선이 없을 경우
        else:
            self.counter += 1
            print(f"EarlyStopping counter: {self.counter} out of {self.patience}")
            if self.counter >= self.patience:
                self.early_stop = True

# EarlyStopping 클래스 초기화
early_stopping = EarlyStopping(patience=10, min_delta=0.0001)


# 모델 학습 및 검증 함수 정의
def train_model(model, criterion, optimizer, num_epochs=25):
    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0

    for epoch in range(num_epochs):
        print(f'Epoch {epoch+1}/{num_epochs}')
        print('-' * 10)

        # 각 에포크마다 훈련과 검증 단계 반복
        for phase in ['train', 'valid']:
            if phase == 'train':
                model.train()  # 훈련 모드
            else:
                model.eval()   # 평가 모드

            running_loss = 0.0
            running_corrects = 0

            # 데이터 반복
            for i, (inputs, labels) in enumerate(dataloaders[phase]):
                inputs = inputs.to(device)
                labels = labels.to(device)

                # 옵티마이저 초기화
                optimizer.zero_grad()

                # forward
                # 훈련 시에만 gradient 계산
                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    # backward + 최적화 훈련 단계에서만 수행
                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                # 손실과 정확도 계산
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

                # 배치마다 진행 상황을 출력
                if i % 10 == 0:  # 매 10번째 배치마다 출력
                    print(f'[{i}/{len(dataloaders[phase])}] Batch Loss: {loss.item():.4f}')

            # if phase == 'train':
            #    scheduler.step()

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

            # 검증 단계에서만 Early Stopping 모니터링
            if phase == 'valid':
                early_stopping(epoch_loss)

                # 모델의 정확도가 향상되었는지 확인
                if epoch_acc > best_acc:
                    best_acc = epoch_acc
                    best_model_wts = copy.deepcopy(model.state_dict())

                # Early stopping이 활성화되면 학습 중단
                if early_stopping.early_stop:
                    print("Early stopping")
                    model.load_state_dict(best_model_wts)
                    return model

        print()

    print(f'Best val Acc: {best_acc:.4f}')

    # 최적의 가중치를 로드
    model.load_state_dict(best_model_wts)
    return model

# Fine-tuning 단계에서 전체 네트워크 학습
def fine_tune_model():
    # 모든 레이어를 학습 가능 상태로 변경
    for param in model.parameters():
        param.requires_grad = True

    # 옵티마이저와 학습률 업데이트
    optimizer = optim.Adam(model.fc.parameters(), lr=0.0002, weight_decay=0.001)
    return optimizer


# 모델 학습 및 평가, 저장 후 시각화
if __name__ == '__main__':
   # Step 1: 마지막 레이어만 학습
    model = train_model(model, criterion, optimizer, num_epochs=50)

    # Step 2: 전체 네트워크 fine-tuning
    # optimizer = fine_tune_model()  # fine-tune 학습을 위한 호출
    # model = train_model(model, criterion, optimizer, num_epochs=50)

    # 모델 저장
    torch.save(model.state_dict(), 'resnet50_finetuned.pth')

    # Test 데이터로 모델 평가 및 시각화
    print("\nEvaluating on Test Set...")

    # 테스트 데이터셋 로드
    test_dataset = datasets.ImageFolder(os.path.join(data_dir, 'test'), data_transforms['test'])
    test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False, num_workers=0)

    # 테스트 데이터 예측
    y_true = []
    y_pred = []
    y_scores = []

    model.eval()  # 모델 평가 모드로 전환
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)

            y_true.extend(labels.cpu().numpy())
            y_pred.extend(preds.cpu().numpy())
            y_scores.extend(torch.softmax(outputs, dim=1).cpu().numpy())  # 확률값 변환

    # 레이블을 이진화
    y_true_bin = label_binarize(y_true, classes=range(num_classes))

    # 저장할 디렉터리 설정
    output_dir = "C:/Users/SSAFY/Desktop/yolo8/answers"
    os.makedirs(output_dir, exist_ok=True)

    ### 1. 혼동 행렬 (Confusion Matrix) ###
    conf_matrix = confusion_matrix(y_true, y_pred)

    # 혼동 행렬 시각화 및 저장
    plt.figure(figsize=(10, 7))
    sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.title('Confusion Matrix')
    plt.savefig(os.path.join(output_dir, 'confusion_matrix.png'))
    plt.close()

    ### 2. 정밀도-재현율 곡선 (Precision-Recall Curve) ###
    plt.figure()
    for i in range(num_classes):
        precision, recall, _ = precision_recall_curve(y_true_bin[:, i], np.array(y_scores)[:, i])
        plt.plot(recall, precision, lw=2, label=f'Class {class_names[i]}')

    plt.xlabel('Recall')
    plt.ylabel('Precision')
    plt.title('Precision-Recall Curve')
    plt.legend(loc='best')
    plt.savefig(os.path.join(output_dir, 'precision_recall_curve.png'))
    plt.close()

    ### 3. ROC 곡선 및 AUC (ROC Curve & AUC) ###
    plt.figure()
    for i in range(num_classes):
        fpr, tpr, _ = roc_curve(y_true_bin[:, i], np.array(y_scores)[:, i])
        roc_auc = auc(fpr, tpr)
        plt.plot(fpr, tpr, lw=2, label=f'Class {class_names[i]} (AUC = {roc_auc:.2f})')

    plt.plot([0, 1], [0, 1], 'k--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve')
    plt.legend(loc='best')
    plt.savefig(os.path.join(output_dir, 'roc_curve.png'))
    plt.close()

    ### 4. F1 Score 및 Classification Report 출력 및 저장 ###
    report = classification_report(y_true, y_pred, target_names=class_names)
    f1 = f1_score(y_true, y_pred, average='weighted')

    # Classification Report와 F1 Score를 텍스트 파일로 저장
    with open(os.path.join(output_dir, 'classification_report.txt'), 'w') as f:
        f.write("Classification Report:\n")
        f.write(report)
        f.write(f"\nF1 Score (Weighted): {f1:.4f}")

    print("모든 시각화와 리포트가 'answers' 폴더에 저장되었습니다.")
