import os
import sys
import joblib
import matplotlib.pyplot as plt
from sklearn.tree import plot_tree, export_text

# Asegurar codificación UTF-8 en la consola
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def visualizar_arbol_decision():
    print("==================================================")
    print("   VISUALIZADOR DE ÁRBOL DE DECISIÓN DEL MODELO   ")
    print("==================================================\n")
    
    # 1. Cargar el modelo
    archivo_modelo = 'modelo_apagones.pkl'
    if not os.path.exists(archivo_modelo):
        print(f"Error: No se encontró '{archivo_modelo}'. Primero debes entrenar el modelo.")
        return
        
    print(f"Cargando modelo '{archivo_modelo}'...")
    modelo = joblib.load(archivo_modelo)
    
    # Un Random Forest es un conjunto de árboles. Tomamos el primero para visualizar.
    # Todos los árboles del bosque siguen la misma lógica pero se entrenan con subconjuntos aleatorios.
    primer_arbol = modelo.estimators_[0]
    
    # Nombres de las características
    columnas_features = [
        'temperatura', 
        'sensacion_termica', 
        'humedad', 
        'velocidad_viento', 
        'codigo_clima', 
        'hora_del_dia', 
        'dia_semana'
    ]
    
    # 2. Exportar en modo Texto (Legible en consola, limitado a profundidad 3 para no saturar)
    print("\n--- REPRESENTACIÓN DEL ÁRBOL EN TEXTO (Profundidad Máx: 3) ---")
    print("Muestra las reglas lógicas que sigue el árbol para tomar decisiones:\n")
    
    arbol_texto = export_text(
        primer_arbol, 
        feature_names=columnas_features, 
        max_depth=3
    )
    print(arbol_texto)
    
    # 3. Dibujar y guardar el gráfico con Matplotlib
    print("--- GENERANDO DIAGRAMA GRÁFICO ---")
    print("Generando imagen del árbol (profundidad máxima mostrada: 3 para legibilidad)...")
    
    try:
        # Creamos una figura grande para que las fuentes sean legibles
        fig, ax = plt.subplots(figsize=(20, 10), dpi=300)
        
        plot_tree(
            primer_arbol,
            max_depth=3, # Limitamos a 3 en el gráfico para que los textos quepan bien en las cajas
            feature_names=columnas_features,
            class_names=['Operación Normal', 'Apagón'],
            filled=True, # Colorea las cajas según la clase mayoritaria y su pureza (Gini)
            rounded=True,
            fontsize=8,
            ax=ax
        )
        
        plt.title("Árbol de Decisión Individual (Estimador 0 de 100)\nModelo Predictivo de Apagones - Lázaro Cárdenas", fontsize=16, pad=20)
        
        imagen_salida = 'arbol_decision.png'
        plt.savefig(imagen_salida, bbox_inches='tight')
        plt.close()
        
        print(f"\n[ÉXITO] Diagrama del árbol guardado como '{imagen_salida}'")
        print("Puedes abrir esa imagen para ver los nodos de decisión (criterios de división), impureza de Gini y muestras por clase.")
        
    except Exception as e:
        print(f"\nError al generar el diagrama gráfico del árbol: {e}")

if __name__ == "__main__":
    visualizar_arbol_decision()
