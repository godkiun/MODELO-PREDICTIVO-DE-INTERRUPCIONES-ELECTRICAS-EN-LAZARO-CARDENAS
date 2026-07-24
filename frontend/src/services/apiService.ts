import { ApagonesRepositoryImpl } from '@/infrastructure/repositories/ApagonesRepositoryImpl';
import { ObtenerPrediccionActualUseCase } from '@/core/usecases/ObtenerPrediccionActualUseCase';
import { EnviarReporteApagonUseCase } from '@/core/usecases/EnviarReporteApagonUseCase';
import { DatosAmbientales, DatosPrediccion, ReporteApagonPayload } from '@/core/domain/models';
import { API_ROUTES } from '@/routes/apiRoutes';

export type { DatosAmbientales, DatosPrediccion, ReporteApagonPayload };

export interface ReportePendienteAdmin {
  id: number;
  colonia: string;
  fecha: string;
  hora: string;
  estado: string;
  fecha_creacion: string;
}

const repository = new ApagonesRepositoryImpl();
const obtenerPrediccionActualUseCase = new ObtenerPrediccionActualUseCase(repository);
const enviarReporteApagonUseCase = new EnviarReporteApagonUseCase(repository);

export async function obtenerPrediccionActual(): Promise<{
  datos: DatosPrediccion;
  usandoRespaldo: boolean;
}> {
  return await obtenerPrediccionActualUseCase.execute();
}

export async function enviarReporteApagon(payload: ReporteApagonPayload): Promise<void> {
  return await enviarReporteApagonUseCase.execute(payload);
}

export async function verificarAdminToken(token: string): Promise<boolean> {
  const res = await fetch(API_ROUTES.ADMIN_VERIFICAR_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!res.ok) return false;
  const json = await res.json();
  return json.valido === true;
}

export async function obtenerReportesPendientesAdmin(token: string): Promise<ReportePendienteAdmin[]> {
  const res = await fetch(API_ROUTES.ADMIN_PENDIENTES, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!res.ok) throw new Error('Error al obtener reportes pendientes o acceso denegado.');
  const json = await res.json();
  return json.reportes || [];
}

export async function aprobarReporteAdmin(id: number, token: string): Promise<void> {
  const res = await fetch(API_ROUTES.ADMIN_APROBAR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, token })
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.mensaje || 'Error al aprobar el reporte.');
  }
}
