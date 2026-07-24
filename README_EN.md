# ⚡ Predictive Model of Power Outages in Lázaro Cárdenas, Michoacán

[![Language: English](https://img.shields.io/badge/Language-English-red.svg)](#) [![Leer en Español](https://img.shields.io/badge/Leer_en-Español-blue.svg)](./README.md)

Comprehensive Data Science, Artificial Intelligence, and Web Development system designed to estimate and monitor real-time power outage risks in the electrical distribution network of **Lázaro Cárdenas, Michoacán**, correlating current and historical weather metrics with news reports and citizen feedback.

---

## 🌐 Languages
* 🇲🇽 [Spanish (Español)](./README.md)
* 🇺🇸 [English (Inglés)](./README_EN.md)

---

## 🏗️ Project Architecture & Layout

The repository is structured into two independent, decoupled main directories:

```text
MODELO PREDICTIVO DE INTERRUPCIONES ELECTRICAS EN LAZARO CARDENAS/
│
├── frontend/     # Interactive Web Dashboard (Next.js 16 + React 19 + Clean Architecture)
├── backend/      # REST API + Machine Learning Pipeline (Python + Flask + Random Forest)
├── README.md     # General Documentation in Spanish
├── README_EN.md  # General Documentation in English
└── .gitignore    # Git rules to exclude credentials, databases, and binary artifacts
```

### How do these directories influence the system?

1. **`backend/` (Machine Learning Engine & REST API)**:
   * **Role**: Fetches live weather data from Open-Meteo API, performs web scraping for power failure news across 16 main neighborhoods in Lázaro Cárdenas, trains **Random Forest** predictive models, and serves data via a **Flask REST API**.
   * **Impact**: Delivers real-time predictive risk calculations and manages relational persistence in SQLite.

2. **`frontend/` (Control Dashboard & User Interface)**:
   * **Role**: Modern web application built with **Clean Architecture** consuming the Flask API to display hyper-local neighborhood risk indicators, weather metrics, comparison tables, and a citizen reporting channel (*Human-in-the-loop*). Includes offline fallback using `localStorage`.
   * **Impact**: Provides a fast, responsive user interface for citizens and administrators.

---

## 🛠️ Technologies, Languages, Frameworks, and Libraries

### 1. Programming Languages
* **Python (v3.10+)**: Backend logic, web scraping, data processing, and Machine Learning pipeline.
* **TypeScript (v5.x)**: Frontend application with strict static type safety.
* **SQL (SQLite3)**: Relational queries and embedded database management.
* **HTML5 / CSS3**: Semantic page layout and styling.

### 2. Frameworks
* **Next.js (v16.2.10)**: Core React framework (App Router, Turbopack).
* **React (v19.2.4)**: UI library for reactive component rendering.
* **Flask**: Lightweight Python web microframework for REST API endpoints.
* **Tailwind CSS (v4)**: Utility-first CSS framework for responsive design.

### 3. Libraries

#### 🐍 Backend (Python):
* **`scikit-learn`**: `RandomForestClassifier` algorithm, dataset splitting, and model evaluation metrics.
* **`pandas`**: Data manipulation, cleaning, and CSV DataFrame operations.
* **`numpy`**: Mathematical operations and matrix manipulation.
* **`joblib`**: Persistence and serialization of trained ML models (`.pkl`).
* **`requests`**: HTTP client for Open-Meteo live weather API.
* **`beautifulsoup4` (`bs4`)**: Web scraping and HTML parsing.
* **`feedparser`**: Google News RSS feed parsing.
* **`flask-cors`**: Cross-Origin Resource Sharing policy management.
* **`flask-caching`**: In-memory server caching for fast API responses.
* **`python-dotenv`**: Environment variable loading from `.env`.
* **`matplotlib`**: Decision tree plotting and evaluation charts.
* **`sqlite3`**: Embedded relational database engine.

#### 🎨 Frontend (TypeScript / React):
* **`lucide-react`**: Vector icon set.
* **`react-dom`**: Browser DOM rendering.
* **`@tailwindcss/postcss` & `postcss`**: CSS post-processors.
* **`eslint` & `eslint-config-next`**: Static code quality analysis.
* **`typescript`**: Type checking and compilation.

---

## 🚀 Quick Start & Installation

### 1. Start Backend (Python)
```bash
cd backend
python -m venv venv

# Activate virtual environment (PowerShell):
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install requirements:
pip install pandas scikit-learn joblib flask flask-cors requests feedparser beautifulsoup4 matplotlib numpy python-dotenv flask-caching

# Launch API server:
python app.py
```
*API running at `http://127.0.0.1:5000`.*

### 2. Start Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Web Dashboard running at `http://localhost:3000`.*

---

## 📄 License
Open-source project created for educational, research, and portfolio purposes.
