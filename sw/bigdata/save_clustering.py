import numpy as np
import joblib
import pandas as pd
import os
import time
import re
from pyspark.sql import SparkSession
from pyspark.ml.clustering import KMeans as SparkKMeans
from pyspark.ml.linalg import Vectors
from sklearn.cluster import SpectralClustering
from sklearn.metrics import silhouette_score
from settings import DATA_FILE, CLUSTER_CENTERS_FILE, CLUSTER_DATA_DIR, n_clusters

# Saving all data in the cluster_data directory, including original data vectors
data_file_path = os.path.join(CLUSTER_DATA_DIR, DATA_FILE)
cluster_centers_file_path = os.path.join(CLUSTER_DATA_DIR, CLUSTER_CENTERS_FILE)

# Initialize Spark session
spark = SparkSession.builder.appName("ClusteringApp").getOrCreate()

def compute_cluster_centers(embeddings, labels, n_clusters):
    """
    Compute the cluster centers based on the embeddings and cluster labels.
    """
    cluster_centers = np.zeros((n_clusters, embeddings.shape[1]))
    for i in range(n_clusters):
        cluster_data = embeddings[np.array(labels) == i]
        if len(cluster_data) > 0:
            cluster_centers[i] = cluster_data.mean(axis=0)
    return cluster_centers

def save_cluster_data_with_indices(labels, data_vectors, image_filenames, n_clusters, directory):
    """
    Save the cluster data along with their indices and image filenames in separate files for each cluster.
    """
    if not os.path.exists(directory):
        os.makedirs(directory)
    labels = np.array(labels)  # Ensure labels is a NumPy array
    for i in range(n_clusters):
        cluster_indices = np.where(labels == i)[0]  # Indices of data points in cluster i
        cluster_points = data_vectors[cluster_indices]  # Data points in cluster i
        cluster_image_indices = [int(re.search(r'\d+', image_filenames[idx]).group()) for idx in cluster_indices]

        # 데이터 저장
        np.savez(os.path.join(directory, f'cluster_{i}_data_with_points.npz'),
                 cluster_indices=cluster_indices, original_data=cluster_points, image_indices=cluster_image_indices)

def format_time(seconds):
    """
    Convert time in seconds to hours, minutes, and seconds.
    """
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return int(hours), int(minutes), int(seconds)

def calculate_sample_size(population_size, confidence_level=0.95, margin_of_error=0.05):
    """
    Calculate the sample size based on confidence level and margin of error.
    """
    z_value = norm.ppf((1 + confidence_level) / 2)
    numerator = (z_value ** 2) * 0.5 * 0.5
    denominator = (margin_of_error ** 2)
    sample_size = numerator / denominator
    finite_population_correction = sample_size / (1 + (sample_size - 1) / population_size)
    return ceil(finite_population_correction)

def run_kmeans(features, n_clusters, spark):
    """
    Run KMeans clustering and return silhouette score.
    """
    # Ensure features are in the correct format
    features_df = spark.createDataFrame([(Vectors.dense(features[i]),) for i in range(len(features))], ["features"])
    kmeans = SparkKMeans(k=n_clusters, seed=42)
    kmeans_model = kmeans.fit(features_df)
    kmeans_labels = kmeans_model.transform(features_df).select("prediction").rdd.flatMap(lambda x: x).collect()
    
    # Calculate silhouette score for KMeans
    silhouette_avg = silhouette_score(features, kmeans_labels)
    return kmeans_model, kmeans_labels, silhouette_avg

def run_spectral_clustering(features, n_clusters):
    """
    Run Spectral Clustering and return silhouette score.
    """
    spectral = SpectralClustering(n_clusters=n_clusters, random_state=42, affinity='nearest_neighbors')
    spectral_labels = spectral.fit_predict(features)
    silhouette_avg = silhouette_score(features, spectral_labels)
    return spectral_labels, silhouette_avg

def find_best_clustering(features, n_clusters, spark, f):
    """
    Perform clustering with KMeans and Spectral clustering methods and return the best labels.
    """
    # Run KMeans clustering
    f.write('Running KMeans clustering...\n')
    print('Running KMeans clustering...')
    kmeans_model, kmeans_labels, kmeans_silhouette = run_kmeans(features, n_clusters, spark)

    # Log and print KMeans silhouette score
    f.write(f'KMeans Silhouette Score: {kmeans_silhouette}\n')
    print(f'KMeans Silhouette Score: {kmeans_silhouette}')

    # Run SpectralClustering
    f.write('Running SpectralClustering...\n')
    print('Running SpectralClustering...')
    spectral_labels, spectral_silhouette = run_spectral_clustering(features, n_clusters)

    # Log and print SpectralClustering silhouette score
    f.write(f'SpectralClustering Silhouette Score: {spectral_silhouette}\n')
    print(f'SpectralClustering Silhouette Score: {spectral_silhouette}')

    # Compare silhouette scores
    silhouette_scores = {
        "KMeans": kmeans_silhouette,
        "SpectralClustering": spectral_silhouette
    }

    best_method = max(silhouette_scores, key=silhouette_scores.get)
    f.write(f"Silhouette Scores: {silhouette_scores}\n")
    print(f"Silhouette Scores: {silhouette_scores}")
    
    return best_method

# 'cluster_data' 디렉토리가 존재하는지 확인
if not os.path.exists(CLUSTER_DATA_DIR):
    os.makedirs(CLUSTER_DATA_DIR)

# Main execution
if __name__ == "__main__":
    # Start overall time measurement
    overall_start_time = time.time()

    # Ensure the 'logs' directory exists
    if not os.path.exists('logs'):
        os.makedirs('logs')

    # Logging the start of the clustering process
    with open('logs/clustering_process.txt', 'w') as f:
        f.write('Starting the clustering process\n')
        print('Starting the clustering process')

        # Step 1: Load the data from 'output_filter.csv'
        f.write('Loading data from output_filter.csv...\n')
        print('Loading data from output_filter.csv...')
        output_filter_df = pd.read_csv('output_filter.csv')
        image_filenames = output_filter_df.iloc[:, 0].values  # 첫 번째 열 (이미지 파일명)
        features = output_filter_df.drop(columns=['image']).values
        f.write('Data loading completed.\n')
        print('Data loading completed.')

        # Step 2: Run sample clustering to determine the best method
        sample_size = min(1000, len(features))  # Adjust this sample size as needed
        sample_indices = np.random.choice(len(features), sample_size, replace=False)
        sample_features = features[sample_indices]

        f.write('Finding best clustering method on sample data...\n')
        print('Finding best clustering method on sample data...')
        best_method = find_best_clustering(sample_features, n_clusters, spark, f)
        f.write(f"Best clustering method: {best_method}\n")
        print(f"Best clustering method: {best_method}")

        # Step 3: Apply the best clustering method on the full dataset
        f.write('Applying best clustering method on the full dataset...\n')
        print('Applying best clustering method on the full dataset...')
        if best_method == "KMeans":
            kmeans_model, kmeans_labels, _ = run_kmeans(features, n_clusters, spark)
            labels = kmeans_labels
        else:
            spectral_labels, _ = run_spectral_clustering(features, n_clusters)
            labels = spectral_labels
        
        # Step 4: Compute cluster centers
        f.write('Computing cluster centers...\n')
        print('Computing cluster centers...')
        cluster_centers = compute_cluster_centers(features, labels, n_clusters)

        # Step 5: Save the cluster data and centers
        f.write('Saving cluster data and centers...\n')
        print('Saving cluster data and centers...')

        np.savez(data_file_path, cluster_labels=labels, original_data=features)
        np.save(cluster_centers_file_path, cluster_centers)
        save_cluster_data_with_indices(labels, features, image_filenames, n_clusters, CLUSTER_DATA_DIR)

        f.write('Data saved.\n')
        print('Data saved.')

    # Measure total time
    overall_end_time = time.time()
    overall_time = overall_end_time - overall_start_time
    hours, minutes, seconds = format_time(overall_time)
    with open('logs/clustering_process.txt', 'a') as f:
        f.write(f"Overall elapsed time: {hours} hours {minutes} minutes {seconds} seconds\n")
    print(f"Overall elapsed time: {hours} hours {minutes} minutes {seconds} seconds")
