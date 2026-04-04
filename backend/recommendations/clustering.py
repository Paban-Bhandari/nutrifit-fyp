"""
K-Means Clustering for User Segmentation
Groups users based on: age, BMI, activity level, budget, diabetes status
"""

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pickle
import os
from accounts.models import UserProfile

class UserClustering:
    """Handle user segmentation using K-Means clustering"""
    
    def __init__(self, n_clusters=4):
        self.n_clusters = n_clusters
        self.model = None
        self.scaler = StandardScaler()
        self.cluster_labels = {
            0: "Active Young Adults",
            1: "Sedentary Middle-Aged",
            2: "Budget-Conscious Users",
            3: "Diabetic Management",
        }
    
    def prepare_user_data(self):
        """
        Extract and prepare user data for clustering
        Returns: DataFrame with user features
        """
        users = UserProfile.objects.all()
        
        if users.count() < 4:
            return None  # Need minimum 4 users for 4 clusters
        
        data = []
        for user in users:
            # Activity level to numeric
            activity_map = {
                'SEDENTARY': 1,
                'LIGHTLY_ACTIVE': 2,
                'MODERATELY_ACTIVE': 3,
                'VERY_ACTIVE': 4,
                'EXTREMELY_ACTIVE': 5,
            }
            
            # Diabetes status to numeric
            diabetes_map = {
                'NONE': 0,
                'PRE_DIABETIC': 1,
                'TYPE_1': 2,
                'TYPE_2': 2,
            }
            
            data.append({
                'user_id': user.id,
                'age': user.age,
                'bmi': float(user.bmi),
                'activity_level': activity_map.get(user.activity_level, 1),
                'daily_budget': float(user.daily_budget) if user.daily_budget else 300,
                'diabetes_status': diabetes_map.get(user.diabetes_status, 0),
                'daily_calories': user.daily_calories,
            })
        
        return pd.DataFrame(data)
    
    def train_model(self):
        """
        Train K-Means model on user data
        """
        df = self.prepare_user_data()
        
        if df is None:
            print("Not enough users to train clustering model")
            return None
        
        # Select features for clustering
        features = ['age', 'bmi', 'activity_level', 'daily_budget', 'diabetes_status']
        X = df[features].values
        
        # Standardize features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train K-Means
        self.model = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        clusters = self.model.fit_predict(X_scaled)
        
        # Add cluster labels to dataframe
        df['cluster'] = clusters
        df['cluster_name'] = df['cluster'].map(self.cluster_labels)
        
        print(f"✓ Trained K-Means with {self.n_clusters} clusters")
        print("\nCluster Distribution:")
        print(df['cluster_name'].value_counts())
        
        # Save model
        self.save_model()
        
        # Update database for all users with their new cluster assignments
        print("Updating user profiles in database...")
        for _, row in df.iterrows():
            UserProfile.objects.filter(id=row['user_id']).update(
                cluster_id=int(row['cluster']),
                cluster_name=row['cluster_name']
            )
        print(f"✓ Updated {len(df)} user profiles")
        
        return df
    
    def predict_cluster(self, user_profile):
        """
        Predict cluster for a single user
        Args:
            user_profile: UserProfile object
        Returns:
            cluster_id, cluster_name
        """
        if self.model is None:
            self.load_model()
        
        if self.model is None:
            # Default cluster if model not trained
            return 0, "General Users"
        
        # Activity level to numeric
        activity_map = {
            'SEDENTARY': 1,
            'LIGHTLY_ACTIVE': 2,
            'MODERATELY_ACTIVE': 3,
            'VERY_ACTIVE': 4,
            'EXTREMELY_ACTIVE': 5,
        }
        
        # Diabetes status to numeric
        diabetes_map = {
            'NONE': 0,
            'PRE_DIABETIC': 1,
            'TYPE_1': 2,
            'TYPE_2': 2,
        }
        
        # Prepare user features
        features = np.array([[
            user_profile.age,
            float(user_profile.bmi),
            activity_map.get(user_profile.activity_level, 1),
            float(user_profile.daily_budget) if user_profile.daily_budget else 300,
            diabetes_map.get(user_profile.diabetes_status, 0),
        ]])
        
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        # Predict cluster
        cluster_id = self.model.predict(features_scaled)[0]
        cluster_name = self.cluster_labels.get(cluster_id, "General Users")
        
        return cluster_id, cluster_name
    
    def save_model(self):
        """Save trained model and scaler to file"""
        model_dir = 'recommendations/ml_models'
        os.makedirs(model_dir, exist_ok=True)
        
        model_path = os.path.join(model_dir, 'kmeans_model.pkl')
        scaler_path = os.path.join(model_dir, 'scaler.pkl')
        
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)
        
        with open(scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
        
        print(f"✓ Model saved to {model_path}")
    
    def load_model(self):
        """Load trained model and scaler from file"""
        model_path = 'recommendations/ml_models/kmeans_model.pkl'
        scaler_path = 'recommendations/ml_models/scaler.pkl'
        
        try:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            with open(scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
            
            print("✓ Model loaded successfully")
            return True
        except FileNotFoundError:
            print("⚠ Model file not found. Train the model first.")
            return False
    
    def get_cluster_characteristics(self):
        """Get characteristics of each cluster"""
        df = self.prepare_user_data()
        
        if df is None:
            return None
        
        features = ['age', 'bmi', 'activity_level', 'daily_budget', 'diabetes_status']
        X = df[features].values
        X_scaled = self.scaler.transform(X)
        
        clusters = self.model.predict(X_scaled)
        df['cluster'] = clusters
        
        # Calculate cluster characteristics
        characteristics = {}
        for cluster_id in range(self.n_clusters):
            cluster_data = df[df['cluster'] == cluster_id]
            
            characteristics[cluster_id] = {
                'name': self.cluster_labels[cluster_id],
                'size': len(cluster_data),
                'avg_age': cluster_data['age'].mean(),
                'avg_bmi': cluster_data['bmi'].mean(),
                'avg_activity': cluster_data['activity_level'].mean(),
                'avg_budget': cluster_data['daily_budget'].mean(),
                'diabetes_count': cluster_data[cluster_data['diabetes_status'] > 0].shape[0],
            }
        
        return characteristics