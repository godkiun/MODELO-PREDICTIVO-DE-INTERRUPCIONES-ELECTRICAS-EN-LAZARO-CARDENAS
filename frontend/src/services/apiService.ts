import { ApagonesRepositoryImpl } from '@/infrastructure/repositories/ApagonesRepositoryImpl';
import { ObtenerPrediccionActualUseCase } from '@/core/usecases/ObtenerPrediccionActualUseCase';
import { EnviarReporteApagonUseCase } from '@/core/usecases/EnviarReporteApagonUseCase';
import { DatosAmbientales, DatosPrediccion, ReporteApagonPayload } from '@/core/domain/models';

export type { DatosAmbientales, DatosPrediccion, ReporteApagonPayload };

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
