import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics.pairwise import euclidean_distances
import joblib
import os
import time
from datetime import datetime
from settings import CLUSTER_CENTERS_FILE, CLUSTER_DATA_DIR, UMAP_MODEL_FILE, n_clusters, n_features

# 랜덤 시드 설정
np.random.seed(datetime.now().microsecond)

def load_umap_model(filename):
    return joblib.load(filename)

def load_data():
    cluster_centers = np.load(CLUSTER_CENTERS_FILE)
    umap_reducer = load_umap_model(UMAP_MODEL_FILE)
    return cluster_centers, umap_reducer

def generate_sparse_probability_vector(n_features, min_non_zero=2, max_non_zero=4):
    num_non_zero = np.random.randint(min_non_zero, max_non_zero + 1)
    non_zero_indices = np.random.choice(n_features, num_non_zero, replace=False)
    vector = np.zeros(n_features)
    vector[non_zero_indices] = np.random.rand(num_non_zero)
    return vector / vector.sum()

# 측정 시작
start_time = time.time()

# 데이터와 모델 불러오기
print('Load Data')
data_load_start_time = time.time()
cluster_centers, umap_reducer = load_data()
data_load_end_time = time.time()
print('Data Load Complete!')
print(f"Data Load Time: {data_load_end_time - data_load_start_time:.2f} seconds")

# Create a custom colormap with 30 distinct colors
cmap = plt.get_cmap('tab20', n_clusters)
colors = cmap(np.arange(n_clusters))  # Convert cmap to array of colors

# 새로운 6차원 점 생성 및 UMAP으로 축소
vector_generation_start_time = time.time()
new_point_6d = generate_sparse_probability_vector(n_features)
vector_generation_end_time = time.time()
print(f"Vector Generation Time: {vector_generation_end_time - vector_generation_start_time:.2f} seconds")

umap_transform_start_time = time.time()
new_point_3d = umap_reducer.transform([new_point_6d])[0]
umap_transform_end_time = time.time()
print(f"UMAP Transformation Time: {umap_transform_end_time - umap_transform_start_time:.2f} seconds")

# 새로운 점과 같은 클러스터의 영역 찾기
distance_to_centers_start_time = time.time()
distances_to_centers = euclidean_distances([new_point_3d], cluster_centers)[0]
closest_cluster_idx = np.argmin(distances_to_centers)
distance_to_centers_end_time = time.time()
print(f"Distance to Centers Calculation Time: {distance_to_centers_end_time - distance_to_centers_start_time:.2f} seconds")

# 클러스터의 점들을 로드
data_loading_cluster_start_time = time.time()
# same_cluster_points = np.load(os.path.join(CLUSTER_DATA_DIR, f'cluster_{closest_cluster_idx}_data.npy'))
file_path = os.path.join(CLUSTER_DATA_DIR, f'cluster_{closest_cluster_idx}_data.npy')
same_cluster_points = np.load(file_path, mmap_mode='r')  # 메모리 매핑 모드로 열기
data_loading_cluster_end_time = time.time()
print(f"Cluster Data Loading Time: {data_loading_cluster_end_time - data_loading_cluster_start_time:.2f} seconds")

# 새로운 점과 같은 클러스터의 점들 중 가까운 20개 점 선택
distance_to_points_start_time = time.time()
distances = euclidean_distances([new_point_3d], same_cluster_points)[0]
sorted_indices = np.argsort(distances)
closest_points_indices = sorted_indices[:100]
distance_to_points_end_time = time.time()
print(f"Distance to Points Calculation Time: {distance_to_points_end_time - distance_to_points_start_time:.2f} seconds")

print(f"Indices of Closest 20 Points: {closest_points_indices}")

# 측정 종료 및 실행 시간 출력
end_time = time.time()
execution_time = end_time - start_time
print(f"Total Execution Time: {execution_time:.2f} seconds")


# 처음 모든 클러스터 점을 불러오고, while을 통해 계속 대기하다가, 요청오면 Json 보내기(3초 정도) 