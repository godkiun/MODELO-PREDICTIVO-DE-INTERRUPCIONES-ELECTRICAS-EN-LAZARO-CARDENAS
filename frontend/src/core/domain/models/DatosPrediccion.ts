import { DatosAmbientales } from './DatosAmbientales';

export interface DatosPrediccion {
  estatus: string;
  fecha_consulta: string;
  datos_ambientales: DatosAmbientales;
  probabilidad_apagon_porcentaje: number;
  riesgo_por_colonia: Record<string, number>;
}
