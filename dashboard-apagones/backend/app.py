from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import joblib
import pandas as pd
from datetime import datetime
import os # <-- Añadir esta librería

app = Flask(__name__)
CORS(app)

# ==========================================
# 1. Cargar los Modelos Predictivos Guardados
# ==========================================
# Obtenemos la ruta exacta de donde está guardado ESTE script (app.py)
DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))
RUTA_MODELO = os.path.join(DIRECTORIO_ACTUAL, 'modelo_apagones.pkl')
RUTA_MODELO_ZONAL = os.path.join(DIRECTORIO_ACTUAL, 'modelo_apagones_zonas.pkl')

try:
    modelo = joblib.load(RUTA_MODELO)
    print("Modelo global cargado exitosamente.")
except FileNotFoundError:
    modelo = None
    print(f"Advertencia: No se encontró el modelo global en: {RUTA_MODELO}")

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
def obtener_prediccion_actual():
    if modelo is None:
        return jsonify({
            "estatus": "error",
            "mensaje": "El modelo predictivo no está disponible en el servidor."
        }), 500

    try:
        # A. Consultar las condiciones ambientales actuales (Hardware Virtual)
        respuesta_clima = requests.get(URL_CLIMA)
        if respuesta_clima.status_code != 200:
            raise Exception("No se pudo obtener información de la API de clima.")
            
        datos_actuales = respuesta_clima.json()["current"]

        # B. Extraer las variables de tiempo actuales
        fecha_actual = datetime.now()
        hora_del_dia = fecha_actual.hour
        dia_semana = fecha_actual.weekday() # 0 = Lunes, 6 = Domingo

        # C. Estructurar los datos exactamente como los espera el modelo global
        caracteristicas = pd.DataFrame([{
            'temperatura': datos_actuales["temperature_2m"],
            'sensacion_termica': datos_actuales["apparent_temperature"],
            'humedad': datos_actuales["relative_humidity_2m"],
            'velocidad_viento': datos_actuales["wind_speed_10m"],
            'codigo_clima': datos_actuales["weather_code"],
            'hora_del_dia': hora_del_dia,
            'dia_semana': dia_semana
        }])

        # D. Calcular la probabilidad del apagón global
        probabilidades = modelo.predict_proba(caracteristicas)[0]
        probabilidad_apagon = probabilidades[1]

        # E. Calcular la probabilidad de apagón por colonia
        riesgo_por_colonia = {}
        if modelo_zonal is not None and columnas_zonal is not None:
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
                
                # Inicializamos todas las variables dummy de colonia en 0, y en 1 si coincide
                for c_col in columnas_zonal:
                    if c_col.startswith('colonia_'):
                        col_nombre = c_col.replace('colonia_', '')
                        fila[c_col] = 1 if col_nombre == col else 0
                
                filas_prediccion.append(fila)
            
            # Crear DataFrame ordenado igual que columnas_zonal
            df_zonal = pd.DataFrame(filas_prediccion, columns=columnas_zonal)
            probabilidades_zonales = modelo_zonal.predict_proba(df_zonal)[:, 1]
            
            for idx, col in enumerate(colonias):
                nombre_amigable = col.title()
                if col == "fideicomiso":
                    nombre_amigable = "Fideicomiso (cerca del ITLAC)"
                riesgo_por_colonia[nombre_amigable] = round(float(probabilidades_zonales[idx]) * 100, 2)

        # F. Enviar respuesta JSON estructurada al Frontend
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
            "probabilidad_apagon_porcentaje": round(float(probabilidad_apagon) * 100, 2),
            "riesgo_por_colonia": riesgo_por_colonia
        })

    except Exception as e:
        return jsonify({
            "estatus": "error",
            "mensaje": f"Falla en el procesamiento: {str(e)}"
        }), 500

# ==========================================
# 3. Inicialización del Servidor
# ==========================================
if __name__ == '__main__':
    # Ejecuta el servidor local en el puerto 5000 con recarga automática para desarrollo
    app.run(debug=True, port=5000)