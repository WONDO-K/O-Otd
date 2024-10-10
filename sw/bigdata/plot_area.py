import numpy as np
import os
import joblib
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from scipy.stats import gaussian_kde
from skimage import measure  # Library for extracting isocontours
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from settings import CLUSTER_DATA_DIR, IMAGE_RESULT_FILE, CLUSTER_CENTERS_FILE, UMAP_MODEL_FILE, DATA_FILE

# File path setup
CLUSTER_CENTERS_FILE = os.path.join(CLUSTER_DATA_DIR, CLUSTER_CENTERS_FILE)
UMAP_MODEL_FILE = os.path.join(CLUSTER_DATA_DIR, UMAP_MODEL_FILE)
DATA_FILE = os.path.join(CLUSTER_DATA_DIR, DATA_FILE)

# Loading cluster centers and UMAP model
print('Loading cluster centers and UMAP model...')
cluster_centers = np.load(CLUSTER_CENTERS_FILE)
umap_reducer = joblib.load(UMAP_MODEL_FILE)
print('Data load complete!')

# Defining look labels and colors
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

# Loading UMAP embeddings and KMeans labels
umap_data = np.load(DATA_FILE)
umap_embeddings = umap_data['umap_embeddings']  # Assuming this is 3D embeddings
kmeans_labels = umap_data['kmeans_labels']

# Setting up the graph
fig = plt.figure(figsize=(12, 10))
ax = fig.add_subplot(111, projection='3d')

# For each cluster, compute KDE and plot isodensity surfaces
for i, look_label in enumerate(look_labels):
    indices = np.where(kmeans_labels == i)
    points = umap_embeddings[indices]

    # KDE calculation
    # Generate a 3D grid
    xmin, ymin, zmin = points.min(axis=0)
    xmax, ymax, zmax = points.max(axis=0)
    xi, yi, zi = np.mgrid[xmin:xmax:30j, ymin:ymax:30j, zmin:zmax:30j]
    coords = np.vstack([xi.ravel(), yi.ravel(), zi.ravel()])

    # Create a KDE model
    kde = gaussian_kde(points.T)
    density = kde(coords)
    density = density.reshape(xi.shape)

    # Plot isodensity surface (isocontour)
    # Define levels (a few levels of density)
    levels = np.linspace(density.min(), density.max(), 5)

    # Plot isocontours for each level
    for level in levels[1:-1]:  # Exclude the first and last levels
        # Extract isocontours
        verts, faces, _, _ = measure.marching_cubes(density, level=level)
        # Convert grid coordinates to actual coordinates
        verts = verts * [(xmax - xmin) / (density.shape[0] - 1),
                         (ymax - ymin) / (density.shape[1] - 1),
                         (zmax - zmin) / (density.shape[2] - 1)] + [xmin, ymin, zmin]
        # Plot the 3D surface
        mesh = Poly3DCollection(verts[faces], alpha=0.1, facecolor=look_colors[look_label])
        ax.add_collection3d(mesh)

    # Optionally, plot cluster data points
    # ax.scatter(points[:, 0], points[:, 1], points[:, 2], color=look_colors[look_label], s=0.01, alpha=0.2)

# Plot cluster centers in the color of each cluster
cluster_centers_3d = umap_reducer.transform(cluster_centers)
for i, center in enumerate(cluster_centers_3d):
    look_label = look_labels[i]
    color = look_colors[look_label]
    ax.scatter(center[0], center[1], center[2], color=color, s=100, marker='X', edgecolors='k', linewidths=1.5)

# Setting up the legend
legend_elements = [Line2D([0], [0], marker='o', color='w', label=look, markerfacecolor=color, markersize=10)
                   for look, color in look_colors.items()]
ax.legend(handles=legend_elements, loc='best')

ax.set_title("3D Visualization of Looks with Cluster Centers Using KDE")
ax.set_xlabel("UMAP Dimension 1")
ax.set_ylabel("UMAP Dimension 2")
ax.set_zlabel("UMAP Dimension 3")
ax.grid(True)

# Reduce graph margins
plt.tight_layout()

image_file_path = os.path.join(CLUSTER_DATA_DIR, IMAGE_RESULT_FILE)
plt.savefig(image_file_path, format='png', dpi=300)
print(f"Plot saved as '{image_file_path}'")

# Display the graph
plt.show()
