import { Injectable } from '@angular/core';
import { AdvisoryRepository } from '../../domain/repositories/advisory.repository';

@Injectable({ providedIn: 'root' })
export class SendAdvisoryQueryUseCase {
  constructor(private readonly repository: AdvisoryRepository) {}

  execute(question: string) {
    return this.repository.sendQuestion(question);
  }
}
