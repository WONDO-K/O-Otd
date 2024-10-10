import os

# 라벨 파일이 저장된 디렉토리 경로
label_dir = 'datasets__/train/labels'

# 클래스 ID 매핑 (기존 ID -> 새로운 ID)
class_mapping = {
   3:6
}

def adjust_labels(label_dir, class_mapping):
    for label_file in os.listdir(label_dir):
        if label_file.endswith('.txt'):
            file_path = os.path.join(label_dir, label_file)
            print(f"처리 중: {file_path}")  # 어떤 파일을 처리 중인지 확인
            with open(file_path, 'r') as file:
                lines = file.readlines()

            # 각 라인에서 클래스 ID를 변경
            new_lines = []
            for line in lines:
                parts = line.strip().split()
                class_id = int(parts[0])
                if class_id in class_mapping:
                    print(f"변경 전 ID: {class_id}, 변경 후 ID: {class_mapping[class_id]}")  # 변경 전후 클래스 ID 출력
                    parts[0] = str(class_mapping[class_id])
                new_lines.append(' '.join(parts))

            # 수정된 내용을 다시 파일에 저장
            with open(file_path, 'w') as file:
                file.write('\n'.join(new_lines) + '\n')

# 라벨 수정 실행
adjust_labels(label_dir, class_mapping)
print("finish")
