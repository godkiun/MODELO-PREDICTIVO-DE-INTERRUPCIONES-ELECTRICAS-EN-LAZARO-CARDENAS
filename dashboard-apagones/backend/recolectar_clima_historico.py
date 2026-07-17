import sqlite3
import requests
from datetime import datetime, timedelta

# Coordenadas de Lázaro Cárdenas, Michoacán
LAT = "17.9586"  
LON = "-102.2035" 

def descargar_clima_historico():
    print("Iniciando la descarga de datos históricos de clima de Open-Meteo...")
    
    # 1. Definir rango de fechas
    # Vamos a descargar desde el 2024-01-01 hasta el día de ayer
    fecha_fin = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    fecha_inicio = "2024-01-01"
    
    print(f"Rango seleccionado: del {fecha_inicio} al {fecha_fin}")
    
    # URL de la API de archivo histórico de Open-Meteo (gratuita, sin API key)
    URL = (
        f"https://archive-api.open-meteo.com/v1/archive?"
        f"latitude={LAT}&longitude={LON}&"
        f"start_date={fecha_inicio}&end_date={fecha_fin}&"
        f"hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&"
        f"timezone=auto"
    )
    
    try:
        respuesta = requests.get(URL)
        if respuesta.status_code != 200:
            print(f"Error al consultar la API de Open-Meteo: {respuesta.status_code}")
            print(respuesta.text)
            return
        
        datos = respuesta.json()
        if "hourly" not in datos:
            print("Error: No se encontraron datos horarios en la respuesta de la API.")
            return
            
        hourly = datos["hourly"]
        tiempos = hourly["time"]
        temps = hourly["temperature_2m"]
        sensaciones = hourly["apparent_temperature"]
        humedades = hourly["relative_humidity_2m"]
        vientos = hourly["wind_speed_10m"]
        codigos = hourly["weather_code"]
        
        total_registros = len(tiempos)
        print(f"Descargados {total_registros} registros de clima históricos.")
        
        # 2. Conectar a la base de datos
        import os
        dir_actual = os.path.dirname(os.path.abspath(__file__))
        ruta_db = os.path.join(dir_actual, "apagones_lc.db")
        conexion = sqlite3.connect(ruta_db)
        cursor = conexion.cursor()
        
        # Crear la tabla de clima si no existe
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS clima (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha_hora DATETIME UNIQUE,
                temperatura REAL,
                sensacion_termica REAL,
                humedad INTEGER,
                velocidad_viento REAL,
                codigo_clima INTEGER
            )
        ''')
        conexion.commit()
        
        # Alternativamente, si la tabla ya existe pero no tiene el índice UNIQUE en fecha_hora,
        # lo manejamos programáticamente comprobando duplicados en la inserción
        
        print("Insertando registros en la base de datos...")
        nuevos_registros = 0
        duplicados = 0
        
        # Leemos todos los fecha_hora existentes para evitar duplicados rápidamente en memoria
        cursor.execute("SELECT fecha_hora FROM clima")
        fechas_existentes = set(row[0] for row in cursor.fetchall())
        
        for i in range(total_registros):
            # Convertir formato de fecha: '2024-01-01T00:00' -> '2024-01-01 00:00:00'
            tiempo_str = tiempos[i].replace("T", " ")
            if len(tiempo_str) == 16:
                tiempo_str += ":00"
                
            # Evitamos insertar duplicados
            if tiempo_str in fechas_existentes:
                duplicados += 1
                continue
                
            # Obtener datos de la posición actual
            temp = temps[i]
            sensacion = sensaciones[i]
            humedad = humedades[i]
            viento = vientos[i]
            codigo_clima = codigos[i]
            
            # En raras ocasiones Open-Meteo puede retornar None para algún valor si hay fallas en sensores
            if temp is None or humedad is None or viento is None or codigo_clima is None:
                continue
                
            cursor.execute('''
                INSERT INTO clima (fecha_hora, temperatura, sensacion_termica, humedad, velocidad_viento, codigo_clima)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (tiempo_str, temp, sensacion, humedad, viento, codigo_clima))
            nuevos_registros += 1
            
        conexion.commit()
        conexion.close()
        
        print(f"\n--- PROCESO DE CARGA COMPLETADO ---")
        print(f"Nuevos registros insertados: {nuevos_registros}")
        print(f"Registros omitidos (ya existentes): {duplicados}")
        
    except Exception as e:
        print(f"Ocurrió un error al procesar el clima histórico: {e}")

if __name__ == "__main__":
    descargar_clima_historico()
