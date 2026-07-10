import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import sys

# Asegurar codificación UTF-8 en la consola
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def entrenar_modelo_zonal():
    print("Cargando dataset zonal de apagones...")
    
    # 1. Cargar los datos
    try:
        df = pd.read_csv("dataset_apagones_zonas.csv")
    except FileNotFoundError:
        print("Error: No se encontró 'dataset_apagones_zonas.csv'. Corre 'crear_dataset.py' primero.")
        return

    print(f"Total de registros cargados: {len(df)}")

    # 2. Ingeniería de Características (Feature Engineering)
    df['fecha_hora'] = pd.to_datetime(df['fecha_hora'])
    df['hora_del_dia'] = df['fecha_hora'].dt.hour
    df['dia_semana'] = df['fecha_hora'].dt.dayofweek

    # Convertimos la columna 'colonia' a variables dummy (One-Hot Encoding)
    # Estandarizamos el texto a minúsculas antes de hacer get_dummies
    df['colonia'] = df['colonia'].str.lower()
    df_encoded = pd.get_dummies(df, columns=['colonia'], prefix='colonia')

    # Columnas que usaremos para entrenar (excluimos fecha_hora y la variable objetivo)
    columnas_excluir = ['fecha_hora', 'hubo_apagon']
    columnas_features = [col for col in df_encoded.columns if col not in columnas_excluir]
    
    X = df_encoded[columnas_features]
    y = df_encoded['hubo_apagon']

    print(f"Número de características de entrenamiento: {len(columnas_features)}")
    
    # 3. Dividir datos en Entrenamiento y Prueba
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Entrenando modelo con {len(X_train)} registros...")

    # 4. Configurar y Entrenar el Modelo
    # Aumentamos ligeramente la profundidad ya que el número de características aumentó por las zonas
    modelo = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, class_weight='balanced')
    modelo.fit(X_train, y_train)

    # 5. Evaluar el Modelo
    predicciones = modelo.predict(X_test)
    precision = accuracy_score(y_test, predicciones)
    
    print("\n--- RESULTADOS DE LA EVALUACIÓN ---")
    print(f"Precisión General: {precision * 100:.2f}%")
    print("\nReporte Detallado:")
    print(classification_report(y_test, predicciones, zero_division=0))

    # 6. Guardar el Modelo Entrenado y la lista de columnas estructuradas
    # Guardamos ambos en un diccionario para cargarlos juntos en el backend
    paquete_modelo = {
        'modelo': modelo,
        'columnas': columnas_features
    }
    
    joblib.dump(paquete_modelo, 'modelo_apagones_zonas.pkl')
    print("\nModelo zonal guardado exitosamente como 'modelo_apagones_zonas.pkl'. ¡Listo para producción!")

if __name__ == "__main__":
    entrenar_modelo_zonal()
