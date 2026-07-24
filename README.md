# ⚡ Modelo Predictivo de Interrupciones Eléctricas en Lázaro Cárdenas, Michoacán

[![Language: Spanish](https://img.shields.io/badge/Language-Spanish-blue.svg)](#) [![Read in English](https://img.shields.io/badge/Read_in-English-red.svg)](./README_EN.md)

Sistema integral de ciencia de datos, Inteligencia Artificial y desarrollo web para estimar y monitorear en tiempo real la probabilidad de apagones e interrupciones en la red de distribución eléctrica del municipio de **Lázaro Cárdenas, Michoacán**, correlacionando factores climáticos actuales e históricos con reportes de fallas comunitarias e históricas.

---

## 🌐 Idiomas / Languages
* 🇲🇽 [Español (Español)](./README.md)
* 🇺🇸 [English (Inglés)](./README_EN.md)

---

## 🏗️ Organización del Proyecto

El repositorio está organizado en dos módulos independientes y desacoplados:

```text
MODELO PREDICTIVO DE INTERRUPCIONES ELECTRICAS EN LAZARO CARDENAS/
│
├── frontend/     # Panel Web Interactivo (Next.js 16 + React 19 + Clean Architecture)
├── backend/      # API REST + Pipeline de Machine Learning (Python + Flask + Random Forest)
├── README.md     # Documentación General en Español
├── README_EN.md  # Documentación General en Inglés
└── .gitignore    # Exclusiones de Git para credenciales, bases de datos y binarios
```

### ¿Cómo influyen estas carpetas en el sistema?

1. **`backend/` (Motor de Inteligencia Artificial y API REST)**:
   * **Función**: Consulta el clima en tiempo real de Open-Meteo, realiza web scraping de noticias sobre fallas eléctricas en las 16 colonias principales del municipio, entrena los modelos de **Bosques Aleatorios (Random Forest)** y expone la API REST mediante Flask.
   * **Impacto**: Proporciona los cálculos predictivos en tiempo real y gestiona la persistencia de datos relacionales en SQLite.

2. **`frontend/` (Panel de Control e Interfaz de Usuario)**:
   * **Función**: Aplicación web desarrollada bajo **Clean Architecture** que consume la API del backend para mostrar indicadores de riesgo hiperlocal por colonia, métricas climáticas, tabla comparativa de sectores y formulario de participación ciudadana (*Human-in-the-loop*). Incluye sistema de soporte offline con respaldo en `localStorage`.
   * **Impacto**: Presenta visualmente los resultados al usuario final con una experiencia fluida y reactiva.

---

## 🛠️ Tecnologías, Lenguajes, Frameworks y Librerías

### 1. Lenguajes de Programación
* **Python (v3.10+)**: Desarrollo del backend, scraping, datos y pipeline de Machine Learning.
* **TypeScript (v5.x)**: Desarrollo del frontend con tipado estático estricto.
* **SQL (SQLite3)**: Consultas relacionales y gestión de almacenamiento local.
* **HTML5 / CSS3**: Estructuración semántica y estilos visuales.

### 2. Frameworks
* **Next.js (v16.2.10)**: Framework principal para React (App Router, Turbopack).
* **React (v19.2.4)**: Librería base para la interfaz de usuario.
* **Flask**: Microframework web para el servidor API REST.
* **Tailwind CSS (v4)**: Framework CSS utility-first para diseño responsivo.

### 3. Librerías Específicas

#### 🐍 Backend (Python):
* **`scikit-learn`**: Algoritmo `RandomForestClassifier` y métricas de evaluación de IA.
* **`pandas`**: Manipulación y estructuración de datos tabulares (CSV/DataFrames).
* **`numpy`**: Operaciones matemáticas y numéricas.
* **`joblib`**: Persistence y serialización de modelos entrenados (`.pkl`).
* **`requests`**: Cliente HTTP para consumir la API de clima de Open-Meteo.
* **`beautifulsoup4` (`bs4`)**: Web scraping y limpieza sintáctica de HTML.
* **`feedparser`**: Parseo de fuentes RSS de noticias (Google News RSS).
* **`flask-cors`**: Configuración de políticas CORS para consumo frontend.
* **`flask-caching`**: Almacenamiento en caché de respuestas API para reducir consumo de servidor.
* **`python-dotenv`**: Carga segura de variables de entorno desde `.env`.
* **`matplotlib`**: Generación de gráficos y visualización de árboles de decisión.
* **`sqlite3`**: Motor de base de datos relacional ligero.

#### 🎨 Frontend (TypeScript / React):
* **`lucide-react`**: Colección de iconos vectoriales interactivos.
* **`react-dom`**: Renderizado de componentes en el navegador.
* **`@tailwindcss/postcss` & `postcss`**: Procesadores de estilos CSS.
* **`eslint` & `eslint-config-next`**: Análisis estático y control de calidad.
* **`typescript`**: Compilación y tipado estático.

---

## 🚀 Guía de Instalación y Ejecución

### 1. Servidor Backend (Python)
```bash
cd backend
python -m venv venv

# Activar entorno virtual (PowerShell):
.\venv\Scripts\Activate.ps1
# En Linux/macOS:
source venv/bin/activate

# Instalar librerías:
pip install pandas scikit-learn joblib flask flask-cors requests feedparser beautifulsoup4 matplotlib numpy python-dotenv flask-caching

# Iniciar servidor API:
python app.py
```
*API activa en `http://127.0.0.1:5000`.*

### 2. Aplicación Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Panel web activo en `http://localhost:3000`.*

---

## 📄 Licencia
Proyecto de código abierto desarrollado para fines educativos y portafolios profesionales.
