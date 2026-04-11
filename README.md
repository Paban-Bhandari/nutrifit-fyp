# NutriFit

## Project Overview
NutriFit is an AI-powered personalized diet recommendation system that generates optimized meal plans using local Nepali cuisine. It tailors recommendations to individual health metrics, dietary preferences, lifestyle, and fitness goals to deliver practical, culturally appropriate, and nutritionally accurate daily meal guidance.

## Tech Stack
* **Frontend:** React 19, Vite, TailwindCSS v4, React Router v7, Recharts.
* **Backend:** Django, Django REST Framework.
* **Machine Learning:** Scikit-Learn (K-Means Clustering, Cosine Similarity), Pandas, NumPy.
* **Database:** SQLite (default) / PostgreSQL capable.

## Setup Instructions

### Prerequisites
* Node.js (v18+)
* Python (3.10+)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply migrations:
   ```bash
   python manage.py migrate
   ```
5. Run the development server:
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`.

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5173`. Ensure the backend server is running concurrently.

## Database Schema
The database uses a relational model with three main entities interacting to deliver the personalized experience:
* **UserProfile:** An extension of the native Django `User` model. It stores user demographics (age, gender), physical metrics (height, weight, automated BMI calculation), lifestyle inputs, dietary habits, health conditions (diabetes status), goals, daily budget, and the system-assigned `cluster_id`.
* **Food:** Stores detailed nutritional information for Nepali dishes and ingredients. This includes calories, macronutrients (proteins, carbs, fats), Glycemic Index (GI), category, meal type suitability, health tags (diabetes-friendly, vegetarian), and estimated cost.
* **MealPlan:** Represents the generated daily diet for a user. It links a `UserProfile` to multiple `Food` items categorized into Breakfast, Lunch, and Dinner routines. It also aggregates total nutritional values (calories and macros) and tracks the percentage accuracy of the recommendation against the user's required targets.

## AI Model Details
The personalized recommendation engine leverages a hybrid machine learning pipeline:

1. **User Clustering (K-Means):**
   * Uses unsupervised K-Means Clustering to group users based on key features: BMI, Activity Level, Fitness Goal, Dietary Preference, and Diabetes Status.
   * This segments the user base into distinct profiles with statistically similar nutritional requirements, acting as an essential baseline before precise food matching.

2. **Food Recommendation (Cosine Similarity):**
   * Computes the mathematical Cosine Similarity between a user's calculated macronutrient requirements (target profile) and the macronutrient distribution of available Nepali foods.
   * Evaluates and ranks foods prioritizing high cosine similarity (vector alignment in macro distribution). Combined with heuristic filtering, this ensures that the selected food combinations meet user targets with maximum possible nutritional accuracy while honoring dietary and cultural constraints.
