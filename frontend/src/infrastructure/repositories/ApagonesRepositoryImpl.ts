import {
  IPrediccionRepository,
  ResultadoPrediccion,
} from '@/core/domain/repositories/IPrediccionRepository';
import { DatosPrediccion, ReporteApagonPayload } from '@/core/domain/models';
import { API_ROUTES } from '@/routes/apiRoutes';
import { fetchWithRetry } from '../api/fetchClient';
import { guardarEnCache, obtenerDeCache } from '../storage/cacheStorage';

export class ApagonesRepositoryImpl implements IPrediccionRepository {
  async obtenerPrediccionActual(): Promise<ResultadoPrediccion> {
    try {
      const data = await fetchWithRetry<DatosPrediccion>(API_ROUTES.PREDICCION_ACTUAL);
      guardarEnCache(data);
      return { datos: data, usandoRespaldo: false };
    } catch {
      // Fallback a caché local
      const dataCache = obtenerDeCache<DatosPrediccion>();
      if (dataCache) {
        return { datos: dataCache, usandoRespaldo: true };
      }
      throw new Error('Error al conectar con el servidor y no hay datos en caché');
    }
  }

  async enviarReporteApagon(payload: ReporteApagonPayload): Promise<void> {
    const respuesta = await fetch(API_ROUTES.REPORTAR_APAGON, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!respuesta.ok) {
      throw new Error('No se pudo enviar el reporte. Servidor no disponible.');
    }
  }
}
