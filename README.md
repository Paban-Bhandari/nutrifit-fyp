<div align="center">
  <h1>NutriFit</h1>
  <p><strong>AI-powered personalized diet recommendation system tailored for Nepali cuisine</strong></p>

  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
  ![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Scikit-Learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
</div>

<hr/>

## 📖 Project Overview

**NutriFit** is a smart, localized diet recommendation engine designed specifically for the culinary landscape of Nepal. By incorporating individual health metrics, dietary preferences, fitness goals, and lifestyle adjustments, NutriFit generates practical and nutritionally balanced meal plans.

The system addresses the gap in global fitness apps which often lack culturally relevant food databases, ensuring that users can achieve their health goals using accessible, everyday Nepali meals.

---

## ✨ Key Features

- **Personalized Recommendations:** Get tailored daily meal plans (Breakfast, Lunch, Dinner) based on physiological metrics, Basal Metabolic Rate (BMR), and Total Daily Energy Expenditure (TDEE).
- **Localized Food Database:** A curated dataset of Nepali foods with accurate macronutrient tracking (Calories, Proteins, Carbs, Fats) and Glycemic Index (GI).
- **Health Condition Aware:** Specialized catering for health conditions, specifically dynamically structured diabetes-friendly recommendations.
- **Machine Learning Integration:** Employs K-Means Clustering to group similar user profiles and Cosine Similarity to find the most mathematically optimal food combinations to hit target macronutrients.
- **Interactive Dashboard:** Beautiful, responsive UI built with React and TailwindCSS featuring dynamic data visualizations using Recharts.

---

## 🛠️ Technology Stack

### Frontend Architecture
* **Framework:** React 19, Vite
* **Styling:** TailwindCSS v4
* **Routing:** React Router v7
* **Data Visualization:** Recharts

### Backend & AI Architecture
* **Framework:** Django (Python), Django REST Framework
* **Database:** PostgreSQL (Production) / SQLite (Development)
* **Machine Learning:** Scikit-Learn (K-Means, Cosine Similarity)
* **Data Processing:** Pandas, NumPy

---

## 🚀 Setup Instructions

### Prerequisites
Make sure you have the following installed to run this project seamlessly:
- **Node.js** (v18.0 or higher)
- **Python** (v3.10 or higher)

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

Create and activate a Python virtual environment:
```bash
# MacOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

Run database migrations to initialize the schema:
```bash
python manage.py migrate
```

Start the Django development server:
```bash
python manage.py runserver
```
*The backend API will now be running at `http://localhost:8000`*

### 2. Frontend Setup

Open a **new** terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install Node.js dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The React application will be running at `http://localhost:5173`. (Ensure the Django backend is still running concurrently in the other terminal object).*

---

## 🧠 AI Model Architecture

NutriFit's backend features a robust recommendation engine utilizing a hybrid Machine Learning pipeline:

### 1. User Profiling & Clustering (K-Means)
- The system processes user features including **BMI**, **Activity Level**, **Fitness Goal**, **Dietary Preference**, and **Diabetes Status**.
- An unsupervised **K-Means Clustering** algorithm segments the user base into distinct profiles. This segmentation provides a statistical baseline for expected nutritional requirements before identifying specific foods.

### 2. Precise Nutritional Matching (Cosine Similarity)
- Based on the user's specific TDEE and required macronutrient distribution to reach their goal (e.g., higher protein for fat loss or muscle gain), the system calculates a target mathematical vector.
- **Cosine Similarity** is then computed between the target nutrient distribution and the available Nepali foods. 
- Combining these similarity scores with culturally hardcoded heuristic rules (e.g., pairing rice with specific legume/vegetable subsets) ensures generated meal plans are both incredibly accurate mathematically and practical culturally.

---

## 🗄️ Database Schema

The core structure relies on a relational model interconnecting three primary entities:

1. **UserProfile:** Extends the native Django `User` model. It houses user demographics, physiological metrics (height, weight, dynamically calculated BMI), daily budgets, lifestyle choices, and the assigned `cluster_id`.
2. **Food:** The cornerstone of the localization effort. Stores precise nutritional data (Macros, Calories, GI), health tags (diabetes-friendly, vegetarian), meal type suitability, and economic cost estimations for Nepali cuisine.
3. **MealPlan:** A relational mapping linking a `UserProfile` to various `Food` items divided into specific times of the day (Breakfast, Lunch, Dinner). It continuously updates to calculate aggregate nutritional fulfillment percentages, allowing the system to verify the accuracy of the generated recommendation against user goals.

---
<div align="center">
  <p>Built for the Final Year Project</p>
</div>
