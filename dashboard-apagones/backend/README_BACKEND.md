# Guía de Scripts del Backend 💻
## Proyecto: Predicción de Apagones en Lázaro Cárdenas, Michoacán

¡Hola! Esta guía está diseñada para ayudarte a comprender cómo funciona cada uno de los archivos de código (scripts) de Python ubicados en esta carpeta `backend`. Si eres nuevo en programación, bases de datos o Inteligencia Artificial, aquí encontrarás una explicación sencilla paso a paso de cada script, las bibliotecas que usa y cómo ejecutarlo.

---

## Índice de Scripts
1. **`recolector_clima.py`** - Recolector del clima actual.
2. **`recolectar_clima_historico.py`** - Descargador de clima histórico.
3. **`recolector_apagones.py`** - Buscador de noticias sobre apagones generales.
4. **`scraper_colonias.py`** - Buscador hiperlocal de apagones por colonia.
5. **`crear_dataset.py`** - Unión y preparación de datos para la IA.
6. **`entrenar_modelo.py`** - Entrenador del modelo global de IA.
7. **`entrenar_modelo_zonal.py`** - Entrenador del modelo de IA por zonas/colonias.
8. **`ver_modelo.py`** - Consola interactiva para simular riesgos e importar factores.
9. **`visualizar_arbol.py`** - Graficador de las decisiones del árbol de la IA.
10. **`app.py`** - El servidor que conecta el backend con la página web.

---

## 1. `recolector_clima.py` (Colector de Clima Actual)
### ¿Qué hace?
Este script se conecta a internet para revisar el clima actual de Lázaro Cárdenas (temperatura, humedad, viento y condiciones) y lo guarda en la base de datos para que la aplicación tenga siempre el clima en tiempo real.
### Librerías de Python usadas:
* `sqlite3`: Abre y escribe datos en tu base de datos local `apagones_lc.db`.
* `requests`: Se comunica con la API externa del clima (Open-Meteo) para traer los datos en tiempo real.
* `datetime`: Sirve para capturar el segundo exacto en el que ocurrió la lectura climática.
### ¿Cómo ejecutarlo?
```bash
python recolector_clima.py
```

---

## 2. `recolectar_clima_historico.py` (Descargador de Datos del Pasado)
### ¿Qué hace?
Para entrenar una Inteligencia Artificial, se necesitan miles de datos históricos. En lugar de esperar 2 años a que `recolector_clima.py` junte datos día a día, este script se conecta a un archivo histórico de Open-Meteo y descarga el clima de los últimos 2 años en un solo paso.
### Librerías de Python usadas:
* `sqlite3`, `requests`, `datetime`.
* `timedelta` (de `datetime`): Sirve para calcular de forma sencilla restas de fechas (ej. hoy menos un día).
### ¿Cómo ejecutarlo?
```bash
python recolectar_clima_historico.py
```

---

## 3. `recolector_apagones.py` (Buscador de Apagones Generales)
### ¿Qué hace?
Utiliza la búsqueda de Google News (RSS) para encontrar noticias recientes en periódicos digitales sobre cortes de luz y fallas de CFE en Lázaro Cárdenas. Si encuentra una noticia nueva, guarda la fecha, el título y el link del periódico.
### Librerías de Python usadas:
* `feedparser`: Convierte el boletín de noticias de Google News (RSS) en listas legibles para Python.
* `urllib.parse`: Convierte tu búsqueda de texto a un formato que entienda Google (ej: convierte acentos y espacios en códigos web).
### ¿Cómo ejecutarlo?
```bash
python recolector_apagones.py
```

---

## 4. `scraper_colonias.py` (Buscador Hiperlocal por Colonia)
### ¿Qué hace?
Es más inteligente que el script anterior. Lee las noticias encontradas y busca patrones de texto para saber **en qué colonia exacta** ocurrió la falla (como Centro, Las Guacamayas, Fideicomiso, Playa Azul). Si detecta la colonia, la guarda en la tabla `reportes_por_zona`.
### Librerías de Python usadas:
* `re` (Expresiones Regulares): Busca palabras exactas evitando confusiones (como identificar "Mira" como colonia y no como el verbo "mirar").
* `BeautifulSoup` (de `bs4`): Limpia código HTML basura que a veces se cuela en las noticias de Google.
### ¿Cómo ejecutarlo?
```bash
python scraper_colonias.py
```

---

## 5. `crear_dataset.py` (Unión de Datos para la IA)
### ¿Qué hace?
Para que el modelo de IA aprenda, necesita ver datos limpios. Este script toma las 22,000 horas de clima guardadas, las multiplica por las 16 colonias posibles y revisa si en esa hora exacta y colonia hubo un reporte de apagón. Si lo hubo, le pone un **`1`** (apagón) y si no, le pone un **`0`** (operación normal). Guarda este resultado en `dataset_apagones_zonas.csv`.
### Librerías de Python usadas:
* `pandas`: Es la librería principal de Python para analizar y estructurar tablas de datos de forma ultra rápida.
### ¿Cómo ejecutarlo?
```bash
python crear_dataset.py
```

---

## 6. `entrenar_modelo.py` (Entrenador del Modelo General)
### ¿Qué hace?
Toma los datos históricos acumulados a nivel municipal y entrena un modelo predictivo global de bosque aleatorio (*Random Forest*) para determinar el riesgo de apagón general sin dividir por zonas.
### Librerías de Python usadas:
* `sklearn` (Scikit-Learn): La librería número uno de Machine Learning en Python. Proporciona el algoritmo de clasificación y funciones de evaluación.
* `joblib`: Guarda el "cerebro" de la IA ya entrenada en un archivo físico `.pkl` para que no se pierda al apagar la computadora.
### ¿Cómo ejecutarlo?
```bash
python entrenar_modelo.py
```

---

## 7. `entrenar_modelo_zonal.py` (Entrenador del Modelo por Colonias)
### ¿Qué hace?
Entrena el modelo que calcula la probabilidad hiperlocal para cada colonia. Como la IA no entiende nombres de texto como "Playa Azul", este script convierte las colonias en columnas de unos y ceros (técnica llamada *One-Hot Encoding*) para poder entrenar el algoritmo y guardar el modelo como `modelo_apagones_zonas.pkl`.
### Librerías de Python usadas:
* `pandas`, `sklearn`, `joblib`.
### ¿Cómo ejecutarlo?
```bash
python entrenar_modelo_zonal.py
```

---

## 8. `ver_modelo.py` (Inspector y Simulador de Riesgo)
### ¿Qué hace?
Es una consola interactiva. Primero te muestra un gráfico hecho con texto (`#`) que te dice cuáles factores (temperatura, humedad, hora, etc.) influyen más en el riesgo de apagones. Luego te pide ingresar datos hipotéticos del clima para calcular el riesgo en ese instante.
### Librerías de Python usadas:
* `matplotlib.pyplot`: Genera una imagen con un diseño moderno de barras (`importancia_caracteristicas.png`) para tu reporte.
* `numpy`: Realiza cálculos matemáticos rápidos para ordenar las importancias de mayor a menor.
### ¿Cómo ejecutarlo?
```bash
python ver_modelo.py
```

---

## 9. `visualizar_arbol.py` (Graficador del Árbol de la IA)
### ¿Qué hace?
Tu modelo RandomForest es un bosque formado por 100 árboles de decisión. Este script extrae el primer árbol, escribe sus reglas lógicas en la terminal (ej: *"si la temperatura es mayor a 32, ve a la derecha..."*) y guarda un diagrama detallado de cajas y ramas en el archivo `arbol_decision.png`.
### Librerías de Python usadas:
* `sklearn.tree` (específicamente `plot_tree` y `export_text`): Herramientas dedicadas a desglosar y dibujar la estructura lógica de los árboles de decisión.
### ¿Cómo ejecutarlo?
```bash
python visualizar_arbol.py
```

---

## 10. `app.py` (Servidor API de la Aplicación)
### ¿Qué hace?
Es el archivo que debe estar corriendo siempre en segundo plano. Cuando tu página web (Next.js) le pregunta al backend *"¿cuál es el riesgo ahora mismo?"*, `app.py` se conecta en milisegundos a internet para jalar el clima actual, introduce esos datos a la IA, calcula la probabilidad de apagón para cada colonia (incluyendo **Fideicomiso / ITLAC**) y le responde a la web en formato JSON para que se dibuje en pantalla.
### Librerías de Python usadas:
* `flask`: Te permite convertir un script de Python en un servidor web que responde a peticiones en puertos de red (usa el puerto 5000).
* `flask_cors` (CORS): Permite que tu frontend de Next.js (puerto 3000) pueda pedirle datos a Flask (puerto 5000) sin problemas de seguridad en el navegador.
### ¿Cómo ejecutarlo?
```bash
python app.py
```
*(Dejará tu terminal bloqueada y activa en el puerto `5000` respondiendo llamadas en vivo).*
