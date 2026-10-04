import { ConsultaTecnica } from '../models/consulta.model';

export abstract class AdvisoryRepository {
  abstract getRecent(): Promise<ConsultaTecnica[]>;
  abstract sendQuestion(question: string): Promise<void>;
}
