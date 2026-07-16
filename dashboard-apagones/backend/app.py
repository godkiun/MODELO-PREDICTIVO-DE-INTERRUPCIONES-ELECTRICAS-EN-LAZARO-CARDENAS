from flask import Flask, jsonify, request
from flask.cli import load_dotenv
from flask_cors import CORS
from flask_caching import Cache
import requests
import joblib
import pandas as pd
from datetime import datetime
from zoneinfo import ZoneInfo
import os
from dotenv import load_dotenv
import subprocess

load_dotenv()  # Carga las variables del archivo .env

app = Flask(__name__)
CORS(app)

# ==========================================
# 0. Configuración de Caché y Zona Horaria
# ==========================================
cache = Cache(config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 900})
cache.init_app(app)

ZONA_LOCAL = ZoneInfo("America/Mexico_City")

# ==========================================
# 1. Cargar el Modelo Predictivo Zonal
# ==========================================
DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))
RUTA_MODELO_ZONAL = os.path.join(DIRECTORIO_ACTUAL, 'modelo_apagones_zonas.pkl')

try:
    paquete_zonal = joblib.load(RUTA_MODELO_ZONAL)
    modelo_zonal = paquete_zonal['modelo']
    columnas_zonal = paquete_zonal['columnas']
    print("Modelo zonal cargado exitosamente.")
except FileNotFoundError:
    modelo_zonal = None
    columnas_zonal = None
    print(f"Advertencia: No se encontró el modelo zonal en: {RUTA_MODELO_ZONAL}")

# Coordenadas de monitoreo (Lázaro Cárdenas)
LAT = "17.9586"
LON = "-102.2035"
URL_CLIMA = f"https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto"

# ==========================================
# 2. Endpoint de Predicción en Tiempo Real
# ==========================================
@app.route('/api/prediccion_actual', methods=['GET'])
@cache.cached(timeout=900)
def obtener_prediccion_actual():
    if modelo_zonal is None or columnas_zonal is None:
        return jsonify({
            "estatus": "error",
            "mensaje": "El modelo predictivo zonal no está disponible."
        }), 500

    try:
        # A. Consultar clima
        respuesta_clima = requests.get(URL_CLIMA)
        if respuesta_clima.status_code != 200:
            raise Exception("No se pudo obtener información de la API de clima.")

        datos_actuales = respuesta_clima.json()["current"]

        # B. Variables de tiempo locales
        fecha_actual = datetime.now(ZONA_LOCAL)
        hora_del_dia = fecha_actual.hour
        dia_semana = fecha_actual.weekday() 

        # C & D. Calcular probabilidad por colonia y extraer promedio global
        riesgo_por_colonia = {}
        probabilidad_apagon = 0
        
        colonias = [
            "11 de julio", "centro", "las guacamayas", "la mira", "playa azul",
            "fideicomiso", "campamento", "pie de casa", "las truchas",
            "primer sector", "segundo sector", "tercer sector", "lotes y servicios",
            "corregidora", "la orillita", "buenos aires"
        ]

        filas_prediccion = []
        for col in colonias:
            fila = {
                'temperatura': datos_actuales["temperature_2m"],
                'sensacion_termica': datos_actuales["apparent_temperature"],
                'humedad': datos_actuales["relative_humidity_2m"],
                'velocidad_viento': datos_actuales["wind_speed_10m"],
                'codigo_clima': datos_actuales["weather_code"],
                'hora_del_dia': hora_del_dia,
                'dia_semana': dia_semana
            }

            for c_col in columnas_zonal:
                if c_col.startswith('colonia_'):
                    col_nombre = c_col.replace('colonia_', '')
                    fila[c_col] = 1 if col_nombre == col else 0

            filas_prediccion.append(fila)

        # Predicción masiva
        df_zonal = pd.DataFrame(filas_prediccion, columns=columnas_zonal)
        probabilidades_zonales = modelo_zonal.predict_proba(df_zonal)[:, 1]

        # Extraer riesgos y sumar para el promedio
        suma_riesgos = 0
        for idx, col in enumerate(colonias):
            nombre_amigable = col.title()
            if col == "fideicomiso":
                nombre_amigable = "Fideicomiso (cerca del ITLAC)"
            
            riesgo_individual = round(float(probabilidades_zonales[idx]) * 100, 2)
            riesgo_por_colonia[nombre_amigable] = riesgo_individual
            suma_riesgos += riesgo_individual

        # El nuevo Riesgo Global es el PROMEDIO EXACTO
        probabilidad_apagon = round(suma_riesgos / len(colonias), 2)

        return jsonify({
            "estatus": "exito",
            "fecha_consulta": fecha_actual.strftime("%Y-%m-%d %H:%M:%S"),
            "datos_ambientales": {
                "temperatura_celsius": datos_actuales["temperature_2m"],
                "humedad_relativa": datos_actuales["relative_humidity_2m"],
                "velocidad_viento_kmh": datos_actuales["wind_speed_10m"],
                "codigo_clima_wmo": datos_actuales["weather_code"]
            },
            "factores_tiempo": {
                "hora_militar": hora_del_dia,
                "dia_semana_index": dia_semana
            },
            "probabilidad_apagon_porcentaje": probabilidad_apagon,
            "riesgo_por_colonia": riesgo_por_colonia
        })

    except Exception as e:
        return jsonify({
            "estatus": "error",
            "mensaje": f"Falla en el procesamiento: {str(e)}"
        }), 500


# ==========================================
# 3. Endpoints Secretos para Cron Jobs
# ==========================================

# En tu ruta del cron job:
@app.route('/api/ejecutar-scraper', methods=['GET'])
def ejecutar_scraper():
    token = request.args.get('token')
    # Lee el token seguro del entorno
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')
    
    if token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403

@app.route('/api/reentrenar-ia', methods=['GET'])
def reentrenar_ia():
    token = request.args.get('token')
    # Lee el token seguro del entorno
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')

    if token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403
    try:
        comando = "python3 crear_dataset.py && python3 entrenar_modelo.py"
        subprocess.Popen(comando, shell=True)
        return jsonify({"estatus": "exito", "mensaje": "Generación de dataset y reentrenamiento iniciados."})
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)