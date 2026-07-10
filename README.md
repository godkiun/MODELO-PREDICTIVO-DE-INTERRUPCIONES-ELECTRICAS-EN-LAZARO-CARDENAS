# Modelo Predictivo de Apagones - Lázaro Cárdenas ⚡

Este es un proyecto completo de ciencia de datos y desarrollo web para registrar, analizar y estimar la probabilidad de interrupciones en la red de energía eléctrica en el municipio de **Lázaro Cárdenas, Michoacán**, correlacionando factores climáticos actuales e históricos con reportes de fallas.

El proyecto cuenta con un pipeline de Machine Learning (Python), un servidor API (Flask) y un panel interactivo moderno (Next.js + Tailwind CSS).

---

## 📂 Estructura del Proyecto

* **`dashboard-apagones/`**: Aplicación web del frontend en Next.js.
* **`dashboard-apagones/backend/`**: Servidores, scraper, base de datos SQLite y pipeline de Machine Learning (Python).
* **`documentacion_proyecto_apagones.md`**: Requisitos de producto y especificaciones de diseño originales.

---

## 🛠️ Requisitos e Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/modelo-predictivo-apagones.git
cd modelo-predictivo-apagones
```

### 2. Configurar el Backend (Python)
Entra a la carpeta de backend, crea un entorno virtual e instala las dependencias:
```bash
cd dashboard-apagones/backend
python -m venv venv
# Activar entorno virtual:
# En Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# En macOS/Linux:
source venv/bin/activate

# Instalar librerías
pip install pandas scikit-learn joblib flask flask-cors requests feedparser beautifulsoup4 matplotlib numpy
```

### 3. Inicializar Datos y Entrenar el Modelo
Para que la aplicación funcione, debes descargar el historial de clima y entrenar a la Inteligencia Artificial:

```bash
# A. Descargar el historial del clima de los últimos 2 años (Open-Meteo Archive)
python recolectar_clima_historico.py

# B. Buscar reportes históricos de fallas en noticias y mapearlos a colonias
python scraper_colonias.py

# C. Cruzar y unificar los datos en la tabla de entrenamiento
python crear_dataset.py

# D. Entrenar el modelo de Machine Learning de zonas
python entrenar_modelo_zonal.py

# E. (Opcional) Entrenar el modelo global municipal
python entrenar_modelo.py
```
*Esto generará la base de datos `apagones_lc.db` y los modelos entrenados `modelo_apagones_zonas.pkl` y `modelo_apagones.pkl`.*

### 4. Ejecutar el Servidor API (Flask)
Inicia la API que se comunicará con tu frontend:
```bash
python app.py
```
*La API correrá en `http://127.0.0.1:5000`.*

### 5. Configurar el Frontend (Next.js)
Abre otra terminal y navega a la carpeta principal de la app web:
```bash
cd dashboard-apagones
npm install
npm run dev
```
*El panel de control interactivo estará disponible en **`http://localhost:3000`**.*

---

## 🧠 ¿Cómo funciona la Inteligencia Artificial?

El sistema entrena un algoritmo de **Bosques Aleatorios (Random Forest)** en base a:
* **Condiciones Climáticas:** Temperatura, sensación térmica, humedad, velocidad del viento y códigos de clima (despejado, lluvia, tormenta).
* **Factores Temporales:** Hora del día (estrés de consumo residencial) y día de la semana.
* **Componente Espacial:** Nombre de la colonia (16 colonias disponibles, incluyendo **Fideicomiso** cerca del **ITLAC**).

El backend calcula el porcentaje de probabilidad en tiempo real descargando el clima actual de la zona.

---

## 📄 Licencia
Este proyecto es libre para uso educativo y portafolios personales.
