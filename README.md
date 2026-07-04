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
* **Database:** PostgreSQL
* **Machine Learning:** Scikit-Learn (K-Means, Cosine Similarity)
* **Data Processing:** Pandas, NumPy

---

## Tested With

- Python 3.12
- Node.js 22
- PostgreSQL 16
- Google Chrome

---

## 🚀 Setup Instructions

### Prerequisites
Make sure you have the following installed to run this project seamlessly:
- **Node.js** (v18.0 or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL 14+** (or compatible)

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
python -m pip install -r requirements.txt
```

> Important: this project uses PostgreSQL by default. If PostgreSQL is not installed or running, Django will fail during migrations with a connection error.

#### PostgreSQL Setup (Windows)

1. Download PostgreSQL from:
   https://www.postgresql.org/download/windows/

2. Install PostgreSQL using the default installation settings.

3. During installation:
   - Keep the default port: 5432
   - Remember the password you assign to the "postgres" user.

4. Open SQL Shell (psql) or pgAdmin and execute:

```sql
CREATE USER nutrifit_user WITH PASSWORD 'nutrifit123';
CREATE DATABASE nutrifit_db OWNER nutrifit_user;
GRANT ALL PRIVILEGES ON DATABASE nutrifit_db TO nutrifit_user;
```

#### PostgreSQL setup (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Create the database and user used by the project:
```bash
sudo -u postgres psql
```

Inside the PostgreSQL shell, run:
```sql
CREATE USER nutrifit_user WITH PASSWORD 'nutrifit123';
CREATE DATABASE nutrifit_db OWNER nutrifit_user;
GRANT ALL PRIVILEGES ON DATABASE nutrifit_db TO nutrifit_user;
\q
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

### Import the Food Dataset

The dataset file (Nepali_Food_Data.csv.csv) is already included in the backend folder. Import it once after running the migrations.

After starting the backend for the first time, import the Nepali food dataset.

Open the Django shell:
```bash
python manage.py shell
```

Run:
```python
from foods.import_foods import import_foods

import_foods(
    "Nepali_Food_Data.csv.csv",
    replace_existing=True
)
```

Expected output:
```text
Successfully imported: 194
Errors: 0
Total in database: 194
```

> **Note:** Without importing the dataset, the Food page and recommendation system will not work because the database will be empty.

If you use different PostgreSQL credentials, update the database settings in [backend/nutrifit_backend/settings.py](backend/nutrifit_backend/settings.py).

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

## Project Structure

```text
nutrifit-fyp/
├── backend/
│   ├── accounts/
│   ├── foods/
│   ├── recommendations/
│   ├── nutrifit_backend/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🗄️ Database Schema

The core structure relies on a relational model interconnecting three primary entities:

1. **UserProfile:** Extends the native Django `User` model. It houses user demographics, physiological metrics (height, weight, dynamically calculated BMI), daily budgets, lifestyle choices, and the assigned `cluster_id`.
2. **Food:** The cornerstone of the localization effort. Stores precise nutritional data (Macros, Calories, GI), health tags (diabetes-friendly, vegetarian), meal type suitability, and economic cost estimations for Nepali cuisine.
3. **MealPlan:** A relational mapping linking a `UserProfile` to various `Food` items divided into specific times of the day (Breakfast, Lunch, Dinner). It continuously updates to calculate aggregate nutritional fulfillment percentages, allowing the system to verify the accuracy of the generated recommendation against user goals.

---

## 🧪 Running the Project

1. Start the Django backend server.
2. Start the React frontend server.
3. Open http://localhost:5173 in your web browser.
4. Register a new account.
5. Log in.
6. Complete your profile.
7. Browse the Food Database.
8. Generate your personalized meal recommendations.

---

## Default Development Ports

| Service | Port |
| ------- | ---- |
| Django Backend | 8000 |
| React Frontend | 5173 |
| PostgreSQL | 5432 |

---

## ⚠️ Troubleshooting

### Database connection error
Ensure PostgreSQL is installed and running before executing migrations.

### No foods displayed
Import the Nepali food dataset using:
```bash
python manage.py shell
```

```python
from foods.import_foods import import_foods

import_foods(
    "Nepali_Food_Data.csv.csv",
    replace_existing=True
)
```

### Frontend cannot connect to backend
Make sure:
- Django is running on port 8000.
- React is running on port 5173.
- Both servers are running simultaneously.

---

## Author

Paban Bhandari

Bachelor of Information Technology (BIT)

Final Year Project

---

## 📄 License

This project was developed solely for academic purposes as a Final Year Project.

---
<div align="center">
  <p>Developed as a Final Year Project</p>
  <p>Bachelor of Information Technology (BIT)</p>
  <p>2026</p>
</div>
