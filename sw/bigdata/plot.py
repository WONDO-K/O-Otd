import numpy as np
import os
import json
import joblib
import umap
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from settings import CLUSTER_CENTERS_FILE, CLUSTER_DATA_DIR, UMAP_MODEL_FILE, IMAGE_RESULT_FILE, DATA_FILE

def load_umap_model(filename):
    return joblib.load(filename)

def load_data():
    cluster_centers = np.load(CLUSTER_CENTERS_FILE)
    umap_reducer = load_umap_model(UMAP_MODEL_FILE)
    return cluster_centers, umap_reducer

# Load cluster centers and UMAP model
print('Loading cluster centers and UMAP model...')
cluster_centers, umap_reducer = load_data()
print('Data Load Complete!')

# Predefined 6D points and their corresponding look labels
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

# Colors for each look
look_colors = {
    "casual_look": 'red',
    "classic_look": 'blue',
    "minimal_look": 'green',
    "chic_look": 'purple',
    "sporty_look": 'orange',
    "street_look": 'brown'
}

# Load UMAP reduced points
umap_data = np.load(DATA_FILE)
umap_embeddings = umap_data['umap_embeddings']
kmeans_labels = umap_data['kmeans_labels']

# Reduce the cluster centers to 2D
cluster_centers_2d = umap_reducer.transform(cluster_centers)

# Plotting the points and cluster centers
plt.figure(figsize=(10, 8))

# Plot each point with its corresponding look color
for idx, (point_2d, look_label) in enumerate(zip(umap_embeddings, look_labels)):
    plt.scatter(point_2d[0], point_2d[1], color=look_colors[look_label], label=look_label, s=0.1)
    plt.text(point_2d[0] + 0.01, point_2d[1], look_label, fontsize=9)

# Plot cluster centers with 'X'
for idx, center in enumerate(cluster_centers_2d):
    plt.scatter(center[0], center[1], color='black', marker='x', s=20, label=f'Cluster {idx}')

# Create custom legend for looks
legend_elements = [Line2D([0], [0], marker='o', color='w', label=look, markerfacecolor=color, markersize=10)
                   for look, color in look_colors.items()]

# Add cluster center to the legend
legend_elements.append(Line2D([0], [0], marker='x', color='w', label='Cluster Centers', markerfacecolor='black', markersize=10))

# Add the legend to the plot
plt.legend(handles=legend_elements, loc='best')

plt.title("2D Visualization of Looks with Cluster Centers")
plt.xlabel("UMAP Dimension 1")
plt.ylabel("UMAP Dimension 2")
plt.grid(True)

# Save the plot as a PNG file
plt.savefig(IMAGE_RESULT_FILE, format='png', dpi=300)

print(f"Plot saved as '{IMAGE_RESULT_FILE}'")
