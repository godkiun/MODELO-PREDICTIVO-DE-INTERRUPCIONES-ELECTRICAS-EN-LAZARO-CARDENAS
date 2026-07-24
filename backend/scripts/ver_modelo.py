import sys
import os
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Asegurar codificación UTF-8 en la consola
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def visualizar_modelo():
    print("==================================================")
    print("   VISUALIZADOR DEL MODELO PREDICTIVO DE APAGONES  ")
    print("==================================================\n")
    
    # 1. Cargar el modelo
    archivo_modelo = 'modelo_apagones.pkl'
    if not os.path.exists(archivo_modelo):
        print(f"Error: No se encontró '{archivo_modelo}'. Primero debes entrenar el modelo.")
        return
        
    print(f"Cargando modelo desde '{archivo_modelo}'...")
    modelo = joblib.load(archivo_modelo)
    
    # 2. Información General
    print("\n--- INFORMACIÓN GENERAL DEL MODELO ---")
    print(f"Tipo de Algoritmo: {type(modelo).__name__}")
    print(f"Número de Árboles (n_estimators): {modelo.n_estimators}")
    print(f"Profundidad Máxima (max_depth): {modelo.max_depth}")
    print(f"Pesos de Clase (class_weight): {modelo.class_weight}")
    
    # Columnas esperadas por el modelo
    columnas_features = [
        'temperatura', 
        'sensacion_termica', 
        'humedad', 
        'velocidad_viento', 
        'codigo_clima', 
        'hora_del_dia', 
        'dia_semana'
    ]
    
    # 3. Importancia de las Características (Feature Importance)
    if hasattr(modelo, 'feature_importances_'):
        importancias = modelo.feature_importances_
        indices = np.argsort(importancias)[::-1]
        
        print("\n--- IMPORTANCIA DE LAS CARACTERÍSTICAS ---")
        print("¿Qué variables influyen más en la predicción de un apagón?")
        print("-" * 65)
        print(f"{'Característica':<25} | {'Importancia':<12} | {'Porcentaje':<10}")
        print("-" * 65)
        
        for i in range(len(columnas_features)):
            idx = indices[i]
            nombre = columnas_features[idx]
            valor = importancias[idx]
            porcentaje = valor * 100
            barra = '#' * int(porcentaje / 2)
            print(f"{nombre:<25} | {valor:.4f}       | {porcentaje:6.2f}%    {barra}")
            
        print("-" * 65)
        
        # Generar y guardar un gráfico con Matplotlib
        try:
            plt.figure(figsize=(10, 6))
            features_ordenadas = [columnas_features[idx] for idx in indices]
            importancias_ordenadas = importancias[indices]
            
            # Colores bonitos y modernos
            colores = plt.cm.viridis(np.linspace(0.8, 0.3, len(columnas_features)))
            
            bars = plt.barh(features_ordenadas[::-1], importancias_ordenadas[::-1], color=colores)
            plt.title('Importancia de Características en la Predicción de Apagones\n(Lázaro Cárdenas)', fontsize=14, pad=15)
            plt.xlabel('Importancia Relativa', fontsize=12)
            plt.grid(axis='x', linestyle='--', alpha=0.7)
            
            # Añadir etiquetas de porcentaje a las barras
            for bar in bars:
                width = bar.get_width()
                plt.text(width + 0.01, bar.get_y() + bar.get_height()/2, f'{width*100:.1f}%', 
                         va='center', ha='left', fontsize=10, fontweight='bold')
            
            plt.tight_layout()
            grafico_salida = 'importancia_caracteristicas.png'
            plt.savefig(grafico_salida, dpi=300)
            plt.close()
            print(f"\n[ÉXITO] Gráfico guardado como '{grafico_salida}'")
        except Exception as e:
            print(f"\nNo se pudo generar el gráfico de Matplotlib: {e}")

    # 4. Modo Interactivo de Predicción (Simulación)
    print("\n==================================================")
    print("        PROBAR EL MODELO (SIMULADOR DE RIESGO)     ")
    print("==================================================")
    print("Introduce los valores climáticos para calcular la probabilidad de apagón:")
    
    try:
        temp = float(input("1. Temperatura en °C (ej. 32.5): ") or 30.0)
        sensacion = float(input(f"2. Sensación Térmica en °C [Default {temp}]: ") or temp)
        humedad = float(input("3. Humedad % (ej. 85): ") or 80.0)
        viento = float(input("4. Velocidad del viento en km/h (ej. 15): ") or 10.0)
        print("\nCódigos de clima comunes: \n  0 = Despejado, 1-3 = Nublado, 45-48 = Niebla\n  51-67 = Llovizna/Lluvia, 71-86 = Nieve, 95-99 = Tormenta Eléctrica")
        codigo = int(input("5. Código de Clima (ej. 0 o 95): ") or 0)
        hora = int(input("6. Hora del día (0-23, ej. 15): ") or 14)
        dia = int(input("7. Día de la semana (0=Lunes, 6=Domingo, ej. 4): ") or 4)
        
        # Crear DataFrame para el modelo con las columnas en el orden exacto
        datos_entrada = pd.DataFrame([{
            'temperatura': temp,
            'sensacion_termica': sensacion,
            'humedad': humedad,
            'velocidad_viento': viento,
            'codigo_clima': codigo,
            'hora_del_dia': hora,
            'dia_semana': dia
        }], columns=columnas_features)
        
        # Realizar predicción de probabilidad
        # predict_proba retorna [[prob_clase_0, prob_clase_1]]
        probabilidad_apagon = modelo.predict_proba(datos_entrada)[0][1]
        riesgo_pct = probabilidad_apagon * 100
        
        # Determinar nivel de riesgo tipo semáforo
        if riesgo_pct < 30:
            semaforo = "🟢 BAJO"
            consejo = "La red eléctrica opera bajo condiciones normales estables."
        elif riesgo_pct < 70:
            semaforo = "🟡 MEDIO"
            consejo = "Hay cierta probabilidad de fallas debido al clima o consumo. Toma precauciones."
        else:
            semaforo = "🔴 ALTO"
            consejo = "¡ALERTA! Las condiciones climáticas y la hora indican un alto riesgo de apagón."
            
        print("\n" + "="*45)
        print(f" RESULTADO DEL CÁLCULO DE RIESGO:")
        print(f" Probabilidad de apagón: {riesgo_pct:.2f}%")
        print(f" Semáforo de Riesgo: {semaforo}")
        print(f" Nota: {consejo}")
        print("="*45 + "\n")
        
    except ValueError:
        print("\n[ERROR] Entrada inválida. Asegúrate de introducir números válidos.")
    except Exception as e:
        print(f"\nOcurrió un error al realizar la predicción: {e}")

if __name__ == "__main__":
    visualizar_modelo()
