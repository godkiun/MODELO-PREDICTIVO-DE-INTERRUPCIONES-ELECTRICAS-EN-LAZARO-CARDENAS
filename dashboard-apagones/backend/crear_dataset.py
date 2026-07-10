import sqlite3
import pandas as pd

def generar_dataset_zonal():
    print("Conectando a la base de datos para estructurar zonas...")
    conexion = sqlite3.connect("apagones_lc.db")
    
    # Leemos la tabla de clima y la nueva tabla de reportes por zona
    df_clima = pd.read_sql_query("SELECT * FROM clima", conexion)
    df_reportes = pd.read_sql_query("SELECT * FROM reportes_por_zona", conexion)
    conexion.close()
    
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
    
    # 4. Inyectar las fallas reales
    if not df_reportes.empty:
        df_reportes['fecha_reporte'] = pd.to_datetime(df_reportes['fecha_reporte'])
        df_reportes['hora_llave'] = df_reportes['fecha_reporte'].dt.round('h')
        df_reportes['colonia'] = df_reportes['colonia'].str.lower()
        
        # Cruzamos ambos dataframes para marcar con un "1" donde coincida hora y colonia
        for _, reporte in df_reportes.iterrows():
            mascara = (df_expandido['hora_llave'] == reporte['hora_llave']) & \
                      (df_expandido['colonia'] == reporte['colonia'])
            df_expandido.loc[mascara, 'hubo_apagon'] = 1

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