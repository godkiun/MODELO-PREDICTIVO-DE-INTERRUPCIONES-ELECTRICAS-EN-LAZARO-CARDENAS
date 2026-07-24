# ⚙️ Backend - Servidor API & Pipeline de Machine Learning (Clean Architecture)

Servidor backend, recolectores de datos, pipeline de Machine Learning e integración de base de datos SQLite para el **Modelo Predictivo de Apagones en Lázaro Cárdenas, Michoacán**, estructurado bajo **Clean Architecture**.

---

## 🏛️ Estructura de Arquitectura Limpia (`backend/`)

El backend fue organizado en capas desacopladas de acuerdo con la Clean Architecture:

```text
backend/
├── app.py                            # Punto de entrada principal de la API Flask (python app.py)
├── README.md                         # Documentación técnica del módulo backend
├── .gitignore                        # Reglas de exclusión de Git para credenciales y binarios
│
├── core/                             # 🟢 CAPA DE DOMINIO Y CASOS DE USO
│   ├── domain/                       # Modelos e Interfaces abstractas puras
│   │   ├── models/                   # Dataclasses (DatosAmbientales, ReporteApagon, ResultadoPrediccion)
│   │   └── repositories/             # Interfaz de persistencia (IReportesRepository)
│   └── usecases/                     # Casos de uso (ObtenerPrediccionActualUseCase, ReportarApagonUseCase)
│
├── infrastructure/                   # 🔵 CAPA DE INFRAESTRUCTURA Y DATOS
│   ├── external/                     # Cliente de API externa (OpenMeteoClient)
│   ├── persistence/                  # Base de datos SQLite (database.py) y ReportesRepositoryImpl
│   └── ml/                           # Cargador de modelos de IA de Random Forest (ModelLoader)
│
├── presentation/                     # 🟡 CAPA DE PRESENTACIÓN / CONTROLADORES API
│   └── controllers/                  # Blueprints Flask (prediccion_controller, reportes_controller, cron_controller)
│
├── scripts/                          # 🛠️ PIPELINES DE ENTRENAMIENTO Y DATA SCRAPING
│   ├── crear_dataset.py
│   ├── entrenar_modelo.py
│   ├── entrenar_modelo_zonal.py
│   ├── recolectar_clima_historico.py
│   ├── recolector_apagones.py
│   ├── recolector_clima.py
│   ├── scraper_colonias.py
│   ├── ver_modelo.py
│   └── visualizar_arbol.py
│
├── modelo_apagones_zonas.pkl        # Binario del modelo Random Forest Zonal
├── modelo_apagones.pkl              # Binario del modelo Random Forest Municipal
├── dataset_apagones_zonas.csv       # Dataset maestro para entrenamiento
├── reportes_apagones.db             # Base de datos SQLite de reportes de usuarios
└── apagones_lc.db                   # Base de datos SQLite histórica de clima
```

---

## 🛠️ Tecnologías, Lenguajes, Frameworks y Librerías

### 1. Lenguajes
* **Python (v3.10+)**: Lenguaje exclusivo de backend, scraping, datos e Inteligencia Artificial.
* **SQL (SQLite3)**: Motor de base de datos relacional ligero.

### 2. Frameworks
* **Flask**: Microframework web de Python para exponer la API REST desacoplada.

### 3. Librerías Específicas
* **`scikit-learn` (`sklearn`)**: Modelo predictivo `RandomForestClassifier` y métricas de evaluación.
* **`pandas`**: Manipulación de DataFrames y procesamiento de datos tabulares CSV.
* **`numpy`**: Operaciones vectoriales y matriciales.
* **`joblib`**: Carga y serialización de modelos entrenados (`.pkl`).
* **`requests`**: Cliente HTTP para consultas a Open-Meteo API.
* **`beautifulsoup4` (`bs4`)**: Parseo y limpieza HTML de noticias escrapeadas.
* **`feedparser`**: Parseo de fuentes RSS de noticias (Google News RSS).
* **`flask-cors`**: Habilitación de políticas CORS para consumo desde el frontend.
* **`flask-caching`**: Almacenamiento en caché de respuestas API.
* **`python-dotenv`**: Carga segura de variables de entorno desde `.env`.
* **`matplotlib`**: Generación de gráficos de árboles de decisión.
* **`sqlite3`**: Motor de base de datos embebido.

---

## 🚀 Guía de Ejecución

1. Crear y activar entorno virtual:
   ```bash
   python -m venv venv
   # En Windows:
   .\venv\Scripts\Activate.ps1
   # En Linux/macOS:
   source venv/bin/activate
   ```

2. Instalar librerías:
   ```bash
   pip install pandas scikit-learn joblib flask flask-cors requests feedparser beautifulsoup4 matplotlib numpy python-dotenv flask-caching
   ```

3. Ejecutar la API REST (Clean Architecture):
   ```bash
   python app.py
   ```
