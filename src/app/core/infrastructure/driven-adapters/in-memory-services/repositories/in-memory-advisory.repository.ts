import { Injectable } from '@angular/core';
import { ConsultaTecnica } from '../../../../domain/models/consulta.model';
import { AdvisoryRepository } from '../../../../domain/repositories/advisory.repository';
import { ADVISORY_ENTITIES } from '../data/mock-data';

@Injectable()
export class InMemoryAdvisoryRepository implements AdvisoryRepository {
  private readonly queries = [...ADVISORY_ENTITIES];

  async getRecent(): Promise<ConsultaTecnica[]> {
    return this.queries.map((item) => ({ ...item }));
  }

  async sendQuestion(question: string): Promise<void> {
    if (!question.trim()) return;
    this.queries.unshift({
      pregunta: question.trim(),
      respuesta: 'Tu consulta fue recibida. Un técnico responderá próximamente.',
      tecnico: 'Equipo técnico Agrozalcoalt',
    });
  }
}
