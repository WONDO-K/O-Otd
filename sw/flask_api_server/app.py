from flask import Flask, request, jsonify
import numpy as np
import joblib
import os
from settings import CLUSTER_CENTERS_FILE, CLUSTER_DATA_DIR

app = Flask(__name__)

CLUSTER_CENTERS_FILE = os.path.join(CLUSTER_DATA_DIR, CLUSTER_CENTERS_FILE)

def load_umap_model(filename):
    return joblib.load(filename)

def load_data():
    cluster_centers = np.load(CLUSTER_CENTERS_FILE)
    return cluster_centers

def calculate_distance(point1, point2):
    return np.sqrt(np.sum((point1 - point2) ** 2))

# Load cluster centers
cluster_centers = load_data()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data or 'point' not in data:
        return jsonify({'error': 'No input data provided'}), 400

    image_point = np.array(data['point'])
    if image_point.shape != (6,):
        return jsonify({'error': 'Input point must be a 6D vector'}), 400

    # Calculate distances from the new point to each cluster center
    distances_to_centers = [calculate_distance(image_point, center) for center in cluster_centers]
    closest_cluster_idx = np.argmin(distances_to_centers)

    # Load the data and indices of points in the closest cluster
    file_path = os.path.join(CLUSTER_DATA_DIR, f'cluster_{closest_cluster_idx}_data_with_points.npz')
    cluster_data = np.load(file_path)
    same_cluster_points = cluster_data['original_data']
    original_indices = cluster_data['cluster_indices']

    # Calculate distances from the new point to each point in the same cluster and sort them
    distances = np.array([calculate_distance(image_point, point) for point in same_cluster_points])
    sorted_indices = np.argsort(distances)
    closest_points_indices = sorted_indices[:20]

    # Get the original indices of the closest 20 points
    closest_original_indices = original_indices[closest_points_indices]

    # Return the closest original indices as a JSON response
    response_json = closest_original_indices.tolist()

    return jsonify(response_json)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
