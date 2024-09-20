from ultralytics import YOLO
import torch


if __name__ == '__main__':
    # CUDA가 사용 가능한지 확인
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")

    # YOLOv8 모델 로드
    model = YOLO('yolov8n.yaml')

    # 모델을 GPU로 이동 (필요시)
    model.to(device)

    # 모델 학습 (GPU 사용)
    results = model.train(
        data='C:/Users/SSAFY/Desktop/yolo8/datasets/data.yaml',
        epochs=500,
        imgsz=640,
        device=device,
        batch=16,
        patience=10
    )