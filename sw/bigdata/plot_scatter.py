import numpy as np
import os
import joblib
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from settings import CLUSTER_DATA_DIR, IMAGE_RESULT_FILE, CLUSTER_CENTERS_FILE, UMAP_MODEL_FILE, DATA_FILE

# 파일 경로 설정
CLUSTER_CENTERS_FILE = os.path.join(CLUSTER_DATA_DIR, CLUSTER_CENTERS_FILE)
UMAP_MODEL_FILE = os.path.join(CLUSTER_DATA_DIR, UMAP_MODEL_FILE)
DATA_FILE = os.path.join(CLUSTER_DATA_DIR, DATA_FILE)

# 클러스터 센터와 UMAP 모델 로드
print('Loading cluster centers and UMAP model...')
cluster_centers = np.load(CLUSTER_CENTERS_FILE)
umap_reducer = joblib.load(UMAP_MODEL_FILE)
print('Data Load Complete!')

# 룩 레이블과 색상 정의
look_labels = [
    "casual_look",
    "classic_look",
    "minimal_look",
    "chic_look",
    "sporty_look",
    "street_look"
]

look_colors = {
    "casual_look": 'red',
    "classic_look": 'blue',
    "minimal_look": 'green',
    "chic_look": 'purple',
    "sporty_look": 'orange',
    "street_look": 'brown'
}

# UMAP 임베딩과 KMeans 레이블 로드
umap_data = np.load(DATA_FILE)
umap_embeddings = umap_data['umap_embeddings']  # 이제 3D 임베딩이라고 가정
kmeans_labels = umap_data['kmeans_labels']

# 클러스터 센터를 3D로 변환
cluster_centers_3d = umap_reducer.transform(cluster_centers)

# 그래프 설정
fig = plt.figure(figsize=(12, 10))
ax = fig.add_subplot(111, projection='3d')

# 각 룩별로 데이터 포인트 그룹화하여 플롯
for i, look_label in enumerate(look_labels):
    indices = np.where(kmeans_labels == i)
    ax.scatter(umap_embeddings[indices, 0], umap_embeddings[indices, 1], umap_embeddings[indices, 2],
               color=look_colors[look_label], s=0.1, label=look_label, alpha=0.1)

# 클러스터 센터를 각 클러스터의 색으로 플롯
for i, center in enumerate(cluster_centers_3d):
    look_label = look_labels[i]
    color = look_colors[look_label]
    ax.scatter(center[0], center[1], center[2], color=color, s=100, marker='X', edgecolors='k', linewidths=1.5)

# 범례 설정 (점 크기 키우기 위해 markersize 설정)
legend_elements = [Line2D([0], [0], marker='o', color='w', label=look, markerfacecolor=color, markersize=10)
                   for look, color in look_colors.items()]

ax.legend(handles=legend_elements, loc='best')

ax.set_title("3D Visualization of Looks with Cluster Centers")
ax.set_xlabel("UMAP Dimension 1")
ax.set_ylabel("UMAP Dimension 2")
ax.set_zlabel("UMAP Dimension 3")
ax.grid(True)

# 그래프 여백 줄이기
plt.tight_layout()

# 그래프 저장
image_file_path = os.path.join(CLUSTER_DATA_DIR, IMAGE_RESULT_FILE)
plt.savefig(image_file_path, format='png', dpi=300)

print(f"Plot saved as '{image_file_path}'")
plt.show()