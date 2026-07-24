import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

def entrenar_modelo_predictivo():
    print("Cargando dataset de apagones...")
    
    # 1. Cargar los datos
    try:
        df = pd.read_csv("dataset_apagones.csv")
    except FileNotFoundError:
        print("Error: No se encontró 'dataset_apagones.csv'. Corre el script anterior primero.")
        return

    # 2. Ingeniería de Características (Feature Engineering)
    # Validamos que el dataset no esté vacío y tenga suficientes muestras
    if df.empty or len(df) < 10:
        print(f"\n[ERROR] El dataset tiene muy pocos registros ({len(df)}).")
        print("Para entrenar el modelo de Machine Learning, necesitas más datos históricos de clima.")
        print("Puedes correr 'recolectar_clima_historico.py' para descargar clima del último año en segundos,")
        print("o dejar corriendo 'recolector_clima.py' periódicamente para acumular datos reales.")
        return

    # Validamos que tengamos ambas clases en 'hubo_apagon' (0 y 1)
    clases = df['hubo_apagon'].unique()
    if len(clases) < 2:
        print(f"\n[ERROR] El dataset solo contiene una clase: {clases}.")
        print("Para entrenar el modelo, necesitas tener registros tanto de horas normales (0) como de apagones (1).")
        print("Esto se soluciona descargando datos históricos de clima con 'recolectar_clima_historico.py'.")
        return

    # Convertimos la fecha a formato datetime para extraer información valiosa
    df['fecha_hora'] = pd.to_datetime(df['fecha_hora'])
    
    # Extraemos la hora y el día de la semana. 
    # Esto es vital porque el consumo eléctrico varía según la hora pico y si es fin de semana.
    df['hora_del_dia'] = df['fecha_hora'].dt.hour
    df['dia_semana'] = df['fecha_hora'].dt.dayofweek

    # 3. Separar las variables (X) y el objetivo (y)
    # Seleccionamos solo las columnas numéricas que el modelo usará para predecir
    columnas_features = [
        'temperatura', 
        'sensacion_termica', 
        'humedad', 
        'velocidad_viento', 
        'codigo_clima', 
        'hora_del_dia', 
        'dia_semana'
    ]
    
    X = df[columnas_features]
    y = df['hubo_apagon']

    # 4. Dividir datos en Entrenamiento y Prueba
    # Usamos el 80% de los datos para enseñar al modelo y el 20% para examinarlo
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Entrenando modelo con {len(X_train)} registros...")

    # 5. Configurar y Entrenar el Modelo
    # Usamos Random Forest con parámetros balanceados
    modelo = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, class_weight='balanced')
    modelo.fit(X_train, y_train)

    # 6. Evaluar el Modelo
    predicciones = modelo.predict(X_test)
    precision = accuracy_score(y_test, predicciones)
    
    print("\n--- RESULTADOS DE LA EVALUACIÓN ---")
    print(f"Precisión General: {precision * 100:.2f}%")
    print("\nReporte Detallado:")
    print(classification_report(y_test, predicciones, zero_division=0))

    # 7. Guardar el Modelo Entrenado
    # Joblib guarda el "cerebro" de la IA en un archivo para no tener que re-entrenarlo cada vez
    joblib.dump(modelo, 'modelo_apagones.pkl')
    print("\nModelo guardado exitosamente como 'modelo_apagones.pkl'. ¡Listo para producción!")

if __name__ == "__main__":
    entrenar_modelo_predictivo()