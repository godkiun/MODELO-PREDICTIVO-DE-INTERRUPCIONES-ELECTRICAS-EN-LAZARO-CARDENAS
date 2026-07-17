import sqlite3
import pandas as pd

def generar_dataset_zonal():
    print("Conectando a la base de datos para estructurar zonas...")
    conexion = sqlite3.connect("apagones_lc.db")
    
    # Leemos la tabla de clima y la nueva tabla de reportes por zona
    df_clima = pd.read_sql_query("SELECT * FROM clima", conexion)
    df_reportes = pd.read_sql_query("SELECT * FROM reportes_por_zona", conexion)
    conexion.close()

    # Integrar reportes ciudadanos de crowdsourcing aprobados (Human-in-the-Loop)
    try:
        import os
        dir_actual = os.path.dirname(os.path.abspath(__file__))
        ruta_db_reportes = os.path.join(dir_actual, 'reportes_apagones.db')
        
        if os.path.exists(ruta_db_reportes):
            conexion_rep = sqlite3.connect(ruta_db_reportes)
            df_aprobados_raw = pd.read_sql_query("SELECT id, colonia, fecha, hora FROM reportes WHERE estado = 'aprobado'", conexion_rep)
            
            if not df_aprobados_raw.empty:
                # Transformación: Combinar fecha y hora en fecha_reporte
                df_aprobados = pd.DataFrame()
                df_aprobados['fecha_reporte'] = df_aprobados_raw['fecha'] + ' ' + df_aprobados_raw['hora']
                df_aprobados['colonia'] = df_aprobados_raw['colonia']
                
                # Fusión: Añadir los reportes aprobados al DataFrame principal de fallas
                df_reportes = pd.concat([df_reportes, df_aprobados], ignore_index=True)
                
                # Limpieza del ciclo: Cambiar estado a 'procesado'
                cursor_rep = conexion_rep.cursor()
                ids = df_aprobados_raw['id'].tolist()
                placeholders = ','.join(['?'] * len(ids))
                cursor_rep.execute(f"UPDATE reportes SET estado = 'procesado' WHERE id IN ({placeholders})", ids)
                conexion_rep.commit()
                print(f"Se integraron {len(df_aprobados_raw)} reportes ciudadanos aprobados y se marcaron como 'procesado'.")
            
            conexion_rep.close()
    except Exception as e:
        print(f"Advertencia al procesar reportes ciudadanos de crowdsourcing: {e}. Se continuará con el dataset base.")
    
    if df_clima.empty:
        print("Aún no hay datos climáticos suficientes para cruzar.")
        return

    # 1. Preparar línea de tiempo
    df_clima['fecha_hora'] = pd.to_datetime(df_clima['fecha_hora'])
    df_clima['hora_llave'] = df_clima['fecha_hora'].dt.round('h')
    
    # 2. El "ADN" Espacial: Lista de colonias (en minúsculas para empatar fácil)
    colonias = [
        "11 de julio", "centro", "las guacamayas", "la mira", "playa azul",
        "fideicomiso", "campamento", "pie de casa", "las truchas", 
        "primer sector", "segundo sector", "tercer sector", "lotes y servicios",
        "corregidora", "la orillita", "buenos aires"
    ]
    
    # 3. Multiplicar cada hora de clima por cada colonia (Cross Join)
    # Esto crea un registro individual de clima para CADA colonia en esa hora
    df_clima['temp_key'] = 1
    df_colonias = pd.DataFrame({'colonia': colonias, 'temp_key': 1})
    
    df_expandido = pd.merge(df_clima, df_colonias, on='temp_key').drop('temp_key', axis=1)
    df_expandido['hubo_apagon'] = 0
    
    # 4. Inyectar las fallas reales mediante merge (evitando loops y errores de NumPy)
    if not df_reportes.empty:
        df_reportes['fecha_reporte'] = pd.to_datetime(df_reportes['fecha_reporte'], format='mixed')
        df_reportes['hora_llave'] = df_reportes['fecha_reporte'].dt.round('h')
        df_reportes['colonia'] = df_reportes['colonia'].str.lower()
        
        # Crear un DataFrame temporal con las combinaciones únicas de apagones
        df_eventos = df_reportes[['hora_llave', 'colonia']].drop_duplicates()
        df_eventos['hubo_apagon_temp'] = 1
        
        # Cruzamos ambos dataframes para marcar con un "1" donde coincida hora y colonia
        df_expandido = pd.merge(df_expandido, df_eventos, on=['hora_llave', 'colonia'], how='left')
        
        # Rellenar los valores vacíos con 0 y convertir a tipo entero
        df_expandido['hubo_apagon'] = df_expandido['hubo_apagon_temp'].fillna(0).astype(int)
        
        # Eliminar columna temporal de cruce
        df_expandido = df_expandido.drop('hubo_apagon_temp', axis=1)

    # 5. Limpieza y exportación
    dataset_final = df_expandido[[
        'fecha_hora', 'temperatura', 'sensacion_termica', 'humedad', 
        'velocidad_viento', 'codigo_clima', 'colonia', 'hubo_apagon'
    ]]
    
    dataset_final.to_csv("dataset_apagones_zonas.csv", index=False)
    
    print("\n--- RESUMEN DEL DATASET ZONAL ---")
    print(f"Archivo guardado: 'dataset_apagones_zonas.csv'")
    print(f"Total de registros generados (Horas x Colonias): {len(dataset_final)}")
    print(f"Apagones mapeados correctamente: {dataset_final['hubo_apagon'].sum()}")

if __name__ == "__main__":
    generar_dataset_zonal()