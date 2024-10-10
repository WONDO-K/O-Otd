import torch
import os
import pandas as pd
from tqdm import tqdm
from ultralytics import YOLO
from PIL import Image
from torchvision import transforms
import torch.nn as nn
from torchvision import models

# ============================== 설정 부분 ==============================

# 장치 설정 (GPU 사용 가능 시 GPU 사용)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"사용 중인 장치: {device}")

# 커스텀 YOLOv8 모델 경로 설정
yolo_model_path = 'runs/detect/train6/weights/best.pt'  # 실제 커스텀 YOLOv8 모델 파일 경로로 변경

# 커스텀 ResNet 모델 경로 설정
resnet_model_path = 'answers/model_008_16/resnet50_finetuned.pth'  # 실제 커스텀 ResNet 모델 파일 경로로 변경

# 이미지가 있는 디렉토리 및 출력 CSV 파일 설정
image_dir = 'minimal'       # 이미지들이 있는 폴더로 변경
output_csv = 'output_resnet.csv'

# 클래스 이름 (ResNet 모델이 분류할 클래스 목록으로 변경)
class_names = ['casual_look', 'classic_look', 'minimal_look', 'chic_look', 'sporty_look', 'street_look']
num_classes = len(class_names)

# ============================== YOLOv8 모델 로드 ==============================

# 커스텀 YOLOv8 모델 로드
yolo_model = YOLO(yolo_model_path)
print("YOLOv8 모델이 성공적으로 로드되었습니다.")

# ============================== ResNet 모델 로드 ==============================

def load_custom_resnet(model_path, num_classes):
    """
    커스텀 ResNet 모델을 로드하는 함수
    """
    # 사전 학습된 ResNet50 모델 불러오기 (pretrained=False로 설정하여 기본 가중치 사용 안 함)
    model = models.resnet50(pretrained=False)
    
    # 마지막 Fully Connected 레이어 수정
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, num_classes)
    
    # 모델 가중치 로드
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model

# ResNet 모델 로드
resnet_model = load_custom_resnet(resnet_model_path, num_classes)
print("ResNet 모델이 성공적으로 로드되었습니다.")

# ============================== 이미지 전처리 정의 ==============================

# ResNet 모델에 맞게 이미지 전처리 정의
preprocess = transforms.Compose([
    transforms.Resize(256),                      # 이미지 크기 조정
    transforms.CenterCrop(224),                  # 중앙을 기준으로 자르기
    transforms.ToTensor(),                       # 텐서로 변환
    transforms.Normalize(mean=[0.485, 0.456, 0.406],  # ResNet 사전 학습 시 사용된 평균
                         std=[0.229, 0.224, 0.225])   # ResNet 사전 학습 시 사용된 표준편차
])

# ============================== 결과 저장을 위한 리스트 ==============================

# 결과 저장을 위한 리스트 초기화
results = []

# ============================== 이미지 분류 및 결과 처리 ==============================

# 이미지 디렉토리 내의 모든 이미지 파일을 순회
for image_file in tqdm(os.listdir(image_dir), desc="이미지 분류 중"):
    image_path = os.path.join(image_dir, image_file)
    
    try:
        # 이미지 열기
        image = Image.open(image_path).convert('RGB')
        
        # YOLO 모델로 예측 (person 클래스만 감지)
        # classes 파라미터는 감지할 클래스의 인덱스를 리스트로 전달. 여기서는 'person' 클래스만 감지하기 위해 인덱스 6으로 설정
        # 만약 커스텀 모델에서 'person' 클래스의 인덱스가 다르다면 해당 인덱스로 변경 필요
        yolo_results = yolo_model.predict(source=image_path, classes=[6], device=device)
        
        # 감지된 person이 없는 경우 모든 클래스 확률을 -1로 설정하여 결과에 추가
        if len(yolo_results) == 0 or len(yolo_results[0].boxes) == 0:
            # 모든 클래스 확률을 -1로 설정
            class_probs = {class_name: -1 for class_name in class_names}
            
            # 결과 저장
            result_entry = {
                'image': image_file
            }
            result_entry.update(class_probs)
            results.append(result_entry)
            continue  # 다음 이미지로 이동
        
        # 각 감지된 person에 대해 처리
        for box in yolo_results[0].boxes:
            # 바운딩 박스 좌표 추출 (YOLOv8은 x1, y1, x2, y2 형식)
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
            
            # 바운딩 박스를 기준으로 이미지 잘라내기
            cropped_image = image.crop((x1, y1, x2, y2))
            
            # 전처리 적용
            input_tensor = preprocess(cropped_image)
            input_batch = input_tensor.unsqueeze(0).to(device)  # 배치 차원 추가 및 장치로 이동
            
            # 예측 수행
            with torch.no_grad():
                outputs = resnet_model(input_batch)
                # softmax 적용하여 확률 계산
                probabilities = torch.softmax(outputs, dim=1).cpu().numpy()[0]
            
            # 각 클래스에 대한 확률 기록
            class_probs = {class_name: 0 for class_name in class_names}
            for idx, class_name in enumerate(class_names):
                class_probs[class_name] = float(probabilities[idx])
            
            # 결과 저장 (이미지 이름, 클래스 확률)
            result_entry = {
                'image': image_file
            }
            result_entry.update(class_probs)
            
            results.append(result_entry)
    
    except Exception as e:
        print(f"이미지 처리 중 오류 발생: {image_file}, 오류: {e}")

# ============================== CSV 파일로 저장 ==============================

# 결과 리스트를 pandas DataFrame으로 변환
df = pd.DataFrame(results)

# DataFrame을 CSV 파일로 저장
df.to_csv(output_csv, index=False)

print(f"결과가 {output_csv}에 저장되었습니다.")
