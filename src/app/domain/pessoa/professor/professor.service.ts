import { Injectable } from '@angular/core';
import { EntidadeService } from 'app/domain/entidade.service';
import {
  Professor,
  ProfessorJson,
  ProfessorEvent,
  ProfessorSortFields,
} from './professor';
import { endpoints } from 'app/shared/endpoints';

@Injectable()
export class ProfessorService extends EntidadeService<
  Professor,
  ProfessorJson,
  ProfessorSortFields
> {
  protected endpoints = {
    core: endpoints.core.v1.professores,
    query: endpoints.query.v1.professores,
  };

  protected fromJson = Professor.fromJson;

  protected createEvent(professor, tipo): ProfessorEvent {
    return new ProfessorEvent(professor, 'client', tipo);
  }
}
