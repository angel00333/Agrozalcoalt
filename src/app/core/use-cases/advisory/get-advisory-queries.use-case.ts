import { Injectable } from '@angular/core';
import { AdvisoryRepository } from '../../domain/repositories/advisory.repository';

@Injectable({ providedIn: 'root' })
export class GetAdvisoryQueriesUseCase {
  constructor(private readonly repository: AdvisoryRepository) {}

  execute() {
    return this.repository.getRecent();
  }
}
