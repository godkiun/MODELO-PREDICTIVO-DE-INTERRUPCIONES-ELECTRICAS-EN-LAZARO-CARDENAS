from typing import List
from core.domain.models.reporte import ReporteApagon
from core.domain.repositories.i_reportes_repository import IReportesRepository
from infrastructure.persistence.database import get_db_connection

class ReportesRepositoryImpl(IReportesRepository):
    def guardar_reporte(self, reporte: ReporteApagon) -> bool:
        try:
            conn = get_db_connection('reportes_apagones.db')
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO reportes (colonia, fecha, hora)
                VALUES (?, ?, ?)
            ''', (reporte.colonia, reporte.fecha, reporte.hora))
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error guardando reporte: {e}")
            return False

    def obtener_pendientes(self) -> List[ReporteApagon]:
        try:
            conn = get_db_connection('reportes_apagones.db')
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, colonia, fecha, hora, estado, fecha_creacion 
                FROM reportes 
                WHERE estado = 'pendiente'
                ORDER BY fecha_creacion DESC
            ''')
            filas = cursor.fetchall()
            conn.close()

            return [
                ReporteApagon(
                    id=f[0],
                    colonia=f[1],
                    fecha=f[2],
                    hora=f[3],
                    estado=f[4],
                    fecha_creacion=str(f[5])
                )
                for f in filas
            ]
        except Exception as e:
            print(f"Error obteniendo pendientes: {e}")
            return []

    def aprobar_reporte(self, reporte_id: int) -> bool:
        try:
            conn = get_db_connection('reportes_apagones.db')
            cursor = conn.cursor()
            cursor.execute('SELECT id FROM reportes WHERE id = ?', (reporte_id,))
            if not cursor.fetchone():
                conn.close()
                return False

            cursor.execute('''
                UPDATE reportes 
                SET estado = 'aprobado' 
                WHERE id = ?
            ''', (reporte_id,))
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error aprobando reporte: {e}")
            return False
