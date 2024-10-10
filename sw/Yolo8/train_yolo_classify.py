from ultralytics import YOLO
import torch

def main():
    # CUDA가 사용 가능한지 확인
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")

    # 모델 불러오기
    model = YOLO('yolov8n-cls.yaml').load('yolov8n-cls.pt')  # YAML로 구축하고 가중치 전송

    # 모델 학습
    result = model.train(
        data='datasets_classify',epochs=500,
        imgsz=640,
        device=device,
        batch=16,
        patience=10
    )

if __name__ == '__main__':
    import multiprocessing
    multiprocessing.freeze_support()  # Windows에서 실행 시 필요할 수 있음
    main()
