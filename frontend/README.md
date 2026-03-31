# NutriFit Frontend

**AI-Powered Personalized Nepali Diet Recommendation System**

A production-ready React frontend for NutriFit, integrating with a Django REST API backend for session-based authentication, personalized meal recommendations (K-Means + Cosine Similarity), and a Nepali food database browser.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| TailwindCSS v4 | Styling |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Recharts | Data visualization charts |
| Lucide React | Icon library |

---

## Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance (withCredentials for session auth)
├── context/
│   └── AuthContext.jsx       # Auth state: login, logout, session restore
├── components/
│   ├── Navbar.jsx            # Auth-aware navbar with user dropdown
│   ├── common/
│   │   ├── Button.jsx        # Primary/secondary/outline/ghost variants
│   │   ├── Input.jsx         # Labeled input with icon + error state
│   │   ├── Card.jsx          # Card with hover + gradient variants
│   │   ├── Loading.jsx       # Page/section/inline spinners
│   │   └── AlertMessage.jsx  # Error/success/info/warning banners
│   ├── layout/
│   │   ├── Footer.jsx        # Footer with links, tech stack, branding
│   │   └── Layout.jsx        # Navbar + Footer wrapper
│   └── dashboard/
│       ├── StatsCard.jsx     # BMI, Calories, Cluster stat cards
│       ├── MealPlanCard.jsx  # Breakfast/lunch/dinner food cards with GI badges
│       └── NutritionChart.jsx# Recharts macro pie chart + calorie progress bar
├── pages/
│   ├── Home.jsx              # Landing page: hero, features, how-it-works, CTA
│   ├── About.jsx             # Project overview, AI system, tech stack, developer
│   ├── Login.jsx             # Login form with session auth
│   ├── Register.jsx          # 5-step multi-step registration form
│   ├── Dashboard.jsx         # Protected: meal plan, charts, profile summary
│   └── Foods.jsx             # Food browser with search + filters
├── utils/
│   └── helpers.js            # BMI colors, GI labels, activity labels, formatters
├── App.jsx                   # Routes + ProtectedRoute + AuthProvider
├── main.jsx                  # App entry
└── index.css                 # Global styles, animations, gradients
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:8000`

### Install & Run

```bash
# From the frontend/ directory
npm install
npm run dev
```

App will be at **http://localhost:5173**

### Environment
No `.env` needed — the backend URL (`http://localhost:8000`) is set in `src/api/axios.js`.  
To change it, edit the `baseURL`:

```js
// src/api/axios.js
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,  // REQUIRED for Django session auth
});
```

---

## Authentication

This app uses **Django session-based authentication** (not JWT).

- `withCredentials: true` is set on every Axios request so cookies are sent
- On app mount, `GET /api/accounts/me/` is called to restore any existing session
- Login sets a session cookie; Logout calls `POST /api/accounts/logout/`
- No tokens stored in localStorage — the browser cookie handles it

---

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Landing page with hero, features, CTA |
| `/about` | Public | Project info, tech stack, developer |
| `/foods` | Public | Browse 250+ Nepali foods with filters |
| `/login` | Redirects if logged in | Login form |
| `/register` | Redirects if logged in | 5-step registration form |
| `/dashboard` | **Protected** | Meal plan, charts, stats |

---

## API Integration

| Endpoint | Used In |
|----------|---------|
| `POST /api/accounts/register/` | Register page |
| `POST /api/accounts/login/` | Login page |
| `POST /api/accounts/logout/` | Navbar logout |
| `GET /api/accounts/me/` | AuthContext session restore |
| `GET /api/foods/` | Foods page (with query params) |
| `GET /api/foods/stats/` | Foods page header stats |
| `GET /api/recommendations/daily-plan/` | Dashboard meal plan |

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/` — serve with any static file server.

---

## Developer

**Paban Bhandari** — BIT Final Year Project  
Django · React · Machine Learning · PostgreSQL
