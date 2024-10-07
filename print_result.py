import os
import json
import numpy as np
from settings import CLUSTER_DATA_DIR, CLUSTER_CENTERS_FILE

# 파일 경로 설정
CLUSTER_CENTERS_FILE = os.path.join(CLUSTER_DATA_DIR, CLUSTER_CENTERS_FILE)

def load_data():
    # 클러스터 센터 파일 로드
    cluster_centers = np.load(CLUSTER_CENTERS_FILE)
    return cluster_centers

def calculate_distance(point1, point2):
    return np.sqrt(np.sum((point1 - point2) ** 2))

# 데이터 로드
print('Load Data')
cluster_centers = load_data()
print('Data Load Complete!')

# 6D 포인트 및 해당 룩 레이블 정의
points_6d = np.array([
    [1, 0, 0, 0, 0, 0],  # casual_look
    [0, 1, 0, 0, 0, 0],  # classic_look
    [0, 0, 1, 0, 0, 0],  # minimal_look
    [0, 0, 0, 1, 0, 0],  # chic_look
    [0, 0, 0, 0, 1, 0],  # sporty_look
    [0, 0, 0, 0, 0, 1]   # street_look
])

look_labels = [
    "casual_look",
    "classic_look",
    "minimal_look",
    "chic_look",
    "sporty_look",
    "street_look"
]

# 각 6D 포인트와 그에 해당하는 룩을 매핑
for idx, (point_6d, look_label) in enumerate(zip(points_6d, look_labels)):
    print(f"\nProcessing {look_label}: {point_6d}")
    
    # 클러스터 중심과의 거리 계산
    distances_to_centers = [calculate_distance(point_6d, center) for center in cluster_centers]
    closest_cluster_idx = np.argmin(distances_to_centers)
    
    print(f"{look_label} is closest to cluster {closest_cluster_idx}")

    # 해당 클러스터 데이터 로드
    file_path = os.path.join(CLUSTER_DATA_DIR, f'cluster_{closest_cluster_idx}_data_with_indices.npz')
    if os.path.exists(file_path):
        cluster_data = np.load(file_path)
        print(file_path)
        same_cluster_points = cluster_data['original_data']
        original_indices = cluster_data['cluster_indices']  # 원본 인덱스 (이미지 라벨)

        # 클러스터 정보 출력
        print(f"Cluster {closest_cluster_idx} Data Shape: {same_cluster_points.shape}")
        print(f"Sample Points from Cluster {closest_cluster_idx}:\n", same_cluster_points[:5])
        print(f"Sample Points number (first 5):\n", original_indices[:5])

        # 같은 클러스터에서 가장 가까운 20개 포인트 찾기
        distances = np.array([calculate_distance(point_6d, point) for point in same_cluster_points])
        sorted_indices = np.argsort(distances)
        closest_points_indices = sorted_indices[:20]  # 상위 20개 가까운 포인트 선택

        # 가장 가까운 포인트의 원본 인덱스 추출
        closest_original_indices = original_indices[closest_points_indices]
        closest_points = same_cluster_points[closest_points_indices]  # 가까운 포인트의 좌표 추출

        # JSON 응답 준비
        response_json = json.dumps(closest_original_indices.tolist())

        # JSON 응답과 가까운 포인트의 좌표 출력
        print(f"Closest points number: {response_json}")
        print(f'Closest Points from Cluster:\n{closest_points}')

    else:
        print(f"Data for cluster {closest_cluster_idx} does not exist.")
