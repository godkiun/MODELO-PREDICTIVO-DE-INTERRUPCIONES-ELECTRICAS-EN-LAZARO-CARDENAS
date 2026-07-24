from core.domain.models.reporte import ReporteApagon
from core.domain.repositories.i_reportes_repository import IReportesRepository

class ReportarApagonUseCase:
    def __init__(self, repository: IReportesRepository):
        self.repository = repository

    def execute(self, colonia: str, fecha: str, hora: str) -> bool:
        if not colonia or not fecha or not hora:
            raise ValueError("Faltan datos obligatorios (colonia, fecha, hora).")
        
        reporte = ReporteApagon(colonia=colonia, fecha=fecha, hora=hora)
        return self.repository.guardar_reporte(reporte)
