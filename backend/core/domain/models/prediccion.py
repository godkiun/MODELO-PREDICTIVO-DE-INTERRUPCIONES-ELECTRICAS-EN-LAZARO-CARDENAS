from dataclasses import dataclass
from typing import Dict
from .clima import DatosAmbientales

@dataclass
class ResultadoPrediccion:
    estatus: str
    fecha_consulta: str
    datos_ambientales: DatosAmbientales
    probabilidad_apagon_porcentaje: float
    riesgo_por_colonia: Dict[str, float]
    factores_tiempo: Dict[str, int]
