import { EntidadeService, Endpoints } from '../entidade.service';
import {
  Disciplina,
  DisciplinaJson,
  DisciplinaSortFields,
  DisciplinaEvent,
} from './disciplina';
import { EntidadeEventType } from '../entidade';
import { endpoints } from 'app/shared/endpoints';
import { Injectable } from '@angular/core';

@Injectable()
export class DisciplinaService extends EntidadeService<
  Disciplina,
  DisciplinaJson,
  DisciplinaSortFields
> {
  protected endpoints: Endpoints = {
    core: endpoints.core.v1.disciplinas,
    query: endpoints.query.v1.disciplinas,
  };

  protected fromJson = Disciplina.fromJson;

  protected toJson(disciplina: Disciplina): DisciplinaJson {
    return disciplina.toJson();
  }

  protected createEvent(
    disciplina: Disciplina,
    tipo: EntidadeEventType
  ): DisciplinaEvent {
    return new DisciplinaEvent(disciplina, 'client', tipo);
  }
}
