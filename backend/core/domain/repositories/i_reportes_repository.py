from abc import ABC, abstractmethod
from typing import List
from core.domain.models.reporte import ReporteApagon

class IReportesRepository(ABC):
    @abstractmethod
    def guardar_reporte(self, reporte: ReporteApagon) -> bool:
        pass

    @abstractmethod
    def obtener_pendientes(self) -> List[ReporteApagon]:
        pass

    @abstractmethod
    def aprobar_reporte(self, reporte_id: int) -> bool:
        pass
