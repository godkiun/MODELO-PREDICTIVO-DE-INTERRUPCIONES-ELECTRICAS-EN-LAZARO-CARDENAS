import { IPrediccionRepository, ResultadoPrediccion } from '../domain/repositories/IPrediccionRepository';

export class ObtenerPrediccionActualUseCase {
  constructor(private readonly repository: IPrediccionRepository) {}

  async execute(): Promise<ResultadoPrediccion> {
    return await this.repository.obtenerPrediccionActual();
  }
}
