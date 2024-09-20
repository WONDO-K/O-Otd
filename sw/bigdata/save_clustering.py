import numpy as np
import umap
import joblib
import os
from sklearn.cluster import SpectralClustering
from settings import DATA_FILE, CLUSTER_CENTERS_FILE, CLUSTER_DATA_DIR, UMAP_MODEL_FILE, n_samples, n_features, n_clusters

# Fixed random seed
np.random.seed(42)

# Initialize UMAP reducer
umap_reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, n_components=3, random_state=42)

def generate_sparse_probability_vector(n_features, min_non_zero=1, max_non_zero=3):
    num_non_zero = np.random.randint(min_non_zero, max_non_zero + 1)
    non_zero_indices = np.random.choice(n_features, num_non_zero, replace=False)
    vector = np.zeros(n_features)
    vector[non_zero_indices] = np.random.rand(num_non_zero)
    return vector / vector.sum()

def compute_cluster_centers(embeddings, labels, n_clusters):
    cluster_centers = np.zeros((n_clusters, embeddings.shape[1]))
    for i in range(n_clusters):
        cluster_data = embeddings[labels == i]
        if len(cluster_data) > 0:
            cluster_centers[i] = cluster_data.mean(axis=0)
    return cluster_centers

def save_cluster_data(embeddings, labels, n_clusters, directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
    for i in range(n_clusters):
        cluster_data = embeddings[labels == i]
        np.save(os.path.join(directory, f'cluster_{i}_data.npy'), cluster_data)

def save_umap_model(umap_model, filename):
    joblib.dump(umap_model, filename, compress=3)

print('Create Data')

# Generate probability vectors
probability_vectors = np.array([generate_sparse_probability_vector(n_features) for _ in range(n_samples)])

# UMAP dimensionality reduction
umap_embeddings = umap_reducer.fit_transform(probability_vectors)

# Spectral Clustering
spectral_clustering = SpectralClustering(n_clusters=n_clusters, affinity='nearest_neighbors')
spectral_labels = spectral_clustering.fit_predict(umap_embeddings)

# Compute cluster centers
cluster_centers = compute_cluster_centers(umap_embeddings, spectral_labels, n_clusters)

# Save cluster data
np.savez(DATA_FILE, umap_embeddings=umap_embeddings, spectral_labels=spectral_labels)
np.save(CLUSTER_CENTERS_FILE, cluster_centers)

# Save data for each cluster
save_cluster_data(umap_embeddings, spectral_labels, n_clusters, CLUSTER_DATA_DIR)

# Save UMAP model
save_umap_model(umap_reducer, UMAP_MODEL_FILE)