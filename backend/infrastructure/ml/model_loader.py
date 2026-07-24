import os
import joblib

DIRECTORIO_BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class ModelLoader:
    _modelo_zonal = None
    _columnas_zonal = None

    @classmethod
    def obtener_modelo_zonal(cls):
        if cls._modelo_zonal is None:
            ruta_modelo = os.path.join(DIRECTORIO_BASE, 'modelo_apagones_zonas.pkl')
            try:
                paquete = joblib.load(ruta_modelo)
                cls._modelo_zonal = paquete['modelo']
                cls._columnas_zonal = paquete['columnas']
                print("Modelo zonal cargado exitosamente mediante ModelLoader.")
            except FileNotFoundError:
                print(f"Advertencia: No se encontró el modelo zonal en: {ruta_modelo}")
                cls._modelo_zonal = None
                cls._columnas_zonal = None

        return cls._modelo_zonal, cls._columnas_zonal
