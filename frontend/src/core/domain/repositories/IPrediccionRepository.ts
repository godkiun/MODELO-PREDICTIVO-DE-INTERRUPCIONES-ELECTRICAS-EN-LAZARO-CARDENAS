import { DatosPrediccion, ReporteApagonPayload } from '../models';

export interface ResultadoPrediccion {
  datos: DatosPrediccion;
  usandoRespaldo: boolean;
}

export interface IPrediccionRepository {
  obtenerPrediccionActual(): Promise<ResultadoPrediccion>;
  enviarReporteApagon(payload: ReporteApagonPayload): Promise<void>;
}
