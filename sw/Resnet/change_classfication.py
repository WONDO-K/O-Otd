import os
from PIL import Image

# YOLO 형식의 바운딩 박스 좌표를 이미지 좌표로 변환
def yolo_to_image_coords(img_width, img_height, x_center, y_center, box_width, box_height):
    xmin = int((x_center - box_width / 2) * img_width)
    xmax = int((x_center + box_width / 2) * img_width)
    ymin = int((y_center - box_height / 2) * img_height)
    ymax = int((y_center + box_height / 2) * img_height)
    return xmin, ymin, xmax, ymax

# 경로 설정
base_dir = "C:/Users/SSAFY/Desktop/yolo8/datasets"  # 기본 데이터셋 폴더
output_base_dir = "C:/Users/SSAFY/Desktop/yolo8/classification_datasets"

# train, valid, test 폴더별로 처리
for split in ['train', 'valid', 'test']:
    image_folder = os.path.join(base_dir, split, 'images')
    label_folder = os.path.join(base_dir, split, 'labels')
    output_folder = os.path.join(output_base_dir, split)

    # 이미지 및 라벨 파일 처리
    for label_file in os.listdir(label_folder):
        # 각 라벨 파일에 대응하는 이미지 파일 찾기
        image_file = os.path.join(image_folder, label_file.replace(".txt", ".jpg"))
        
        if not os.path.exists(image_file):
            print(f"Image file {image_file} not found. Skipping.")
            continue

        image = Image.open(image_file)
        img_width, img_height = image.size

        # 라벨 파일 열기
        with open(os.path.join(label_folder, label_file), 'r') as file:
            lines = file.readlines()

        for line in lines:
            # YOLO 형식 데이터 파싱: class_id, x_center, y_center, width, height
            class_id, x_center, y_center, box_width, box_height = map(float, line.split())

            # 6번 클래스를 제외하고 처리
            if int(class_id) == 6:
                continue

            # 바운딩 박스 좌표 계산 (이미지가 640x640 고정이라 가정)
            xmin, ymin, xmax, ymax = yolo_to_image_coords(img_width, img_height, x_center, y_center, box_width, box_height)

            # 바운딩 박스 영역 자르기
            cropped_image = image.crop((xmin, ymin, xmax, ymax))

            # 224x224로 리사이즈
            resized_image = cropped_image.resize((640,640))

            # 클래스별 출력 폴더 만들기
            class_folder = os.path.join(output_folder, f'class_{int(class_id)}')
            os.makedirs(class_folder, exist_ok=True)

            # 잘라낸 이미지 저장
            output_image_path = os.path.join(class_folder, f'{label_file.replace(".txt", "")}_cropped_{int(class_id)}.jpg')
            resized_image.save(output_image_path)

            print(f'Saved {output_image_path}')
