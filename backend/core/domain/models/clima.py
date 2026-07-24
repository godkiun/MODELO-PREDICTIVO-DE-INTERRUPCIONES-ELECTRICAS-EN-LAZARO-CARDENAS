from dataclasses import dataclass

@dataclass
class DatosAmbientales:
    temperatura_celsius: float
    humedad_relativa: float
    velocidad_viento_kmh: float
    codigo_clima_wmo: int
