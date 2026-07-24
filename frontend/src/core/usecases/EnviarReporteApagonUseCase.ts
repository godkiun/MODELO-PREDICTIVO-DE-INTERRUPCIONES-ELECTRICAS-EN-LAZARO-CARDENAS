import { IPrediccionRepository } from '../domain/repositories/IPrediccionRepository';
import { ReporteApagonPayload } from '../domain/models';

export class EnviarReporteApagonUseCase {
  constructor(private readonly repository: IPrediccionRepository) {}

  async execute(payload: ReporteApagonPayload): Promise<void> {
    return await this.repository.enviarReporteApagon(payload);
  }
}
