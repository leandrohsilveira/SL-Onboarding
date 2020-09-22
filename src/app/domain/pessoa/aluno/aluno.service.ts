import { Injectable } from '@angular/core';
import { AlunoSortFields, Aluno, AlunoEvent, AlunoJson } from './aluno';
import { endpoints } from 'app/shared/endpoints';
import { EntidadeService } from 'app/domain/entidade.service';

@Injectable()
export class AlunoService extends EntidadeService<
  Aluno,
  AlunoJson,
  AlunoSortFields
> {
  protected endpoints = {
    core: endpoints.core.v1.alunos,
    query: endpoints.query.v1.alunos,
  };

  protected fromJson = Aluno.fromJson;

  protected createEvent(aluno, tipo) {
    return new AlunoEvent(aluno, 'client', tipo);
  }
}
