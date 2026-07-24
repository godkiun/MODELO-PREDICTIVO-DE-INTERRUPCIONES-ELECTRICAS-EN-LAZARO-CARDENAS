from dataclasses import dataclass
from typing import Optional

@dataclass
class ReporteApagon:
    colonia: str
    fecha: str
    hora: str
    id: Optional[int] = None
    estado: str = "pendiente"
    fecha_creacion: Optional[str] = None
