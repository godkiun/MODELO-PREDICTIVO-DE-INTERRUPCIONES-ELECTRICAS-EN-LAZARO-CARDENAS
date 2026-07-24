import sqlite3
import requests
from datetime import datetime

# ==========================================
# 1. Configuración de Open-Meteo (¡Sin API Key!)
# ==========================================
LAT = "17.9586"  
LON = "-102.2035" 
# Pedimos temperatura, humedad, sensación térmica, viento y código del clima actual
URL = f"https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto"

# ==========================================
# 2. Inicialización de Base de Datos SQLite
# ==========================================
def inicializar_db():
    import os
    dir_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_db = os.path.join(dir_actual, "apagones_lc.db")
    conexion = sqlite3.connect(ruta_db)
    cursor = conexion.cursor()
    
    # Cambiamos "descripcion" por "codigo_clima" para facilitar el modelo predictivo
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clima (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha_hora DATETIME,
            temperatura REAL,
            sensacion_termica REAL,
            humedad INTEGER,
            velocidad_viento REAL,
            codigo_clima INTEGER
        )
    ''')
    conexion.commit()
    return conexion

# ==========================================
# 3. Extracción y Carga de Datos
# ==========================================
def recolectar_datos_clima(conexion):
    try:
        respuesta = requests.get(URL)
        datos = respuesta.json()
        
        # Extraemos las variables del diccionario 'current' de Open-Meteo
        actual = datos["current"]
        temp = actual["temperature_2m"]
        sensacion = actual["apparent_temperature"]
        humedad = actual["relative_humidity_2m"]
        viento = actual["wind_speed_10m"]
        codigo_clima = actual["weather_code"]
        fecha_hora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Insertamos en SQLite
        cursor = conexion.cursor()
        cursor.execute('''
            INSERT INTO clima (fecha_hora, temperatura, sensacion_termica, humedad, velocidad_viento, codigo_clima)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (fecha_hora, temp, sensacion, humedad, viento, codigo_clima))
        
        conexion.commit()
        print(f"[{fecha_hora}] Éxito: {temp}°C, {humedad}% de humedad, Código de clima: {codigo_clima}")
        
    except Exception as e:
        print(f"Error recolectando datos: {e}")

# ==========================================
# Ejecución Principal
# ==========================================
if __name__ == "__main__":
    conexion_db = inicializar_db()
    recolectar_datos_clima(conexion_db)
    conexion_db.close()