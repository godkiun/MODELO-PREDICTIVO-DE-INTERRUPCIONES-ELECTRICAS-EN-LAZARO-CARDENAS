from flask import Flask, jsonify, request, render_template_string
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
import sqlite3

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

def init_db():
    ruta_db = os.path.join(DIRECTORIO_ACTUAL, 'reportes_apagones.db')
    conn = sqlite3.connect(ruta_db)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reportes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            colonia TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            estado TEXT DEFAULT 'pendiente',
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Inicializar base de datos
init_db()

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
@app.route('/api/ejecutar-scraper', methods=['GET'])
def ejecutar_scraper():
    token = request.args.get('token')
    # Lee el token seguro del entorno
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')
    
    if token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403
    
    try:
        # 1. Crear ruta absoluta al archivo
        ruta_scraper = os.path.join(DIRECTORIO_ACTUAL, 'scraper_colonias.py')

        # 2. Ejecutar con la ruta completa
        subprocess.Popen(["python3", ruta_scraper])
        return jsonify({"estatus": "exito", "mensaje": "Barrido de noticias iniciado correctamente."})
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": str(e)}), 500

@app.route('/api/reentrenar-ia', methods=['GET'])
def reentrenar_ia():
    token = request.args.get('token')
    # Lee el token seguro del entorno
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')

    if token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403
    try:
        # 1. Crear rutas absolutas a ambos archivos
        ruta_dataset = os.path.join(DIRECTORIO_ACTUAL, 'crear_dataset.py')
        ruta_modelo = os.path.join(DIRECTORIO_ACTUAL, 'entrenar_modelo_zonal.py')

        # 2. Construir el comando usando las variables
        comando = f"python3 {ruta_dataset} && python3 {ruta_modelo}"

        subprocess.Popen(comando, shell=True)
        return jsonify({"estatus": "exito", "mensaje": "Generación de dataset y reentrenamiento iniciados."})
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": str(e)}), 500


# ==========================================
# 4. Registrar Reporte de Apagón
# ==========================================
@app.route('/api/reportar_apagon', methods=['POST'])
def reportar_apagon():
    try:
        datos_reporte = request.json
        if not datos_reporte:
            return jsonify({
                "estatus": "error",
                "mensaje": "Datos no proporcionados."
            }), 400

        colonia = datos_reporte.get('colonia')
        fecha = datos_reporte.get('fecha')
        hora = datos_reporte.get('hora')

        if not colonia or not fecha or not hora:
            return jsonify({
                "estatus": "error",
                "mensaje": "Faltan datos obligatorios (colonia, fecha, hora)."
            }), 400

        ruta_db = os.path.join(DIRECTORIO_ACTUAL, 'reportes_apagones.db')
        conn = sqlite3.connect(ruta_db)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO reportes (colonia, fecha, hora)
            VALUES (?, ?, ?)
        ''', (colonia, fecha, hora))
        conn.commit()
        conn.close()

        return jsonify({
            "estatus": "exito",
            "mensaje": "Reporte enviado para validación. ¡Gracias por tu aporte!"
        }), 201
    except Exception as e:
        return jsonify({
            "estatus": "error",
            "mensaje": f"Error interno del servidor: {str(e)}"
        }), 500


# ==========================================
# 5. Panel de Administración de Reportes
# ==========================================
@app.route('/api/admin-reportes', methods=['GET'])
def admin_reportes():
    token = request.args.get('token')
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')
    
    if not token or token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403

    try:
        ruta_db = os.path.join(DIRECTORIO_ACTUAL, 'reportes_apagones.db')
        conn = sqlite3.connect(ruta_db)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, colonia, fecha, hora, fecha_creacion 
            FROM reportes 
            WHERE estado = 'pendiente'
            ORDER BY fecha_creacion DESC
        ''')
        reportes = cursor.fetchall()
        conn.close()

        html_template = '''
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dashboard de Administración - Reportes</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-900 text-gray-100 min-h-screen p-6 md:p-10">
            <div class="max-w-6xl mx-auto space-y-8">
                
                <!-- Header -->
                <header class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-800 pb-6 gap-4">
                    <div>
                        <h1 class="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-350 to-emerald-400">
                            Dashboard de Administración - Reportes
                        </h1>
                        <p class="text-gray-400 mt-1 text-sm font-medium">
                            Validación y moderación de reportes de apagones (Human-in-the-Loop)
                        </p>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-400">
                        <span class="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                        <span>Token Activo</span>
                    </div>
                </header>

                <!-- Main Grid -->
                <div>
                    <h2 class="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                        ⚡ Reportes Pendientes de Validación
                    </h2>

                    {% if reportes %}
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {% for rep in reportes %}
                        <div class="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex flex-col justify-between space-y-4">
                            <div class="space-y-3">
                                <div class="flex justify-between items-start border-b border-gray-700 pb-2">
                                    <span class="text-teal-400 text-xs font-bold uppercase">
                                        ID: #{{ rep[0] }}
                                    </span>
                                    <span class="text-[10px] text-gray-400 font-mono">
                                        {{ rep[4] }}
                                    </span>
                                </div>
                                
                                <div>
                                    <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Colonia</label>
                                    <p class="text-lg font-bold text-gray-100 uppercase tracking-tight">{{ rep[1] }}</p>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Fecha</label>
                                        <p class="text-sm font-semibold text-gray-300">{{ rep[2] }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Hora</label>
                                        <p class="text-sm font-semibold text-gray-300">{{ rep[3] }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-3 border-t border-gray-700">
                                <a href="/api/aprobar-reporte?id={{ rep[0] }}&token={{ token }}" class="w-full inline-flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors text-sm text-center">
                                    Aprobar
                                </a>
                            </div>
                        </div>
                        {% endfor %}
                    </div>
                    {% else %}
                    <div class="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center max-w-lg mx-auto shadow-md">
                        <span class="text-4xl">🎉</span>
                        <h3 class="text-lg font-bold text-gray-200 mt-4">Todo al día</h3>
                        <p class="text-gray-400 text-sm mt-1">No hay reportes de usuarios pendientes de validar.</p>
                    </div>
                    {% endif %}
                </div>
            </div>
        </body>
        </html>
        '''
        return render_template_string(html_template, reportes=reportes, token=token)
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": str(e)}), 500


@app.route('/api/aprobar-reporte', methods=['GET'])
def aprobar_reporte():
    token = request.args.get('token')
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')
    
    if not token or token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403

    reporte_id = request.args.get('id')
    if not reporte_id:
        return jsonify({"estatus": "error", "mensaje": "Falta el ID del reporte."}), 400

    try:
        ruta_db = os.path.join(DIRECTORIO_ACTUAL, 'reportes_apagones.db')
        conn = sqlite3.connect(ruta_db)
        cursor = conn.cursor()
        
        # Verificar si el reporte existe
        cursor.execute('SELECT id FROM reportes WHERE id = ?', (reporte_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({"estatus": "error", "mensaje": "Reporte no encontrado."}), 404
            
        cursor.execute('''
            UPDATE reportes 
            SET estado = 'aprobado' 
            WHERE id = ?
        ''', (reporte_id,))
        conn.commit()
        conn.close()

        html_template = '''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reporte Aprobado</title>
            <style>
                body { font-family: sans-serif; background: #0f172a; color: #f1f5f9; padding: 2rem; text-align: center; }
                h1 { color: #10b981; }
                p { color: #94a3b8; font-size: 1.1rem; }
                a { color: #2dd4bf; text-decoration: none; font-weight: bold; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>¡Reporte aprobado con éxito!</h1>
            <p>El reporte con ID {{ reporte_id }} ha sido aprobado correctamente.</p>
            <p><a href="/api/admin-reportes?token={{ token }}">Volver a la lista de pendientes</a></p>
        </body>
        </html>
        '''
        return render_template_string(html_template, reporte_id=reporte_id, token=token)
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)