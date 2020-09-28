import { Injectable } from '@angular/core';
import { AlunoSortFields, Aluno, AlunoEvent, AlunoJson } from './aluno';
import { endpoints } from 'app/shared/endpoints';
import { PessoaService } from '../pessoa.service';
import { LookupErrorsMessages } from 'app/shared/util/service.util';

@Injectable()
export class AlunoService extends PessoaService<
  Aluno,
  AlunoJson,
  AlunoSortFields
> {
  protected endpoints = {
    core: endpoints.core.v1.alunos,
    query: endpoints.query.v1.alunos,
  };

  protected get lookupErrors(): LookupErrorsMessages {
    return {
      notFound: $localize`Nenhum aluno encontrado`,
      multipleFound: (length) =>
        $localize`${length} alunos parecidos encontrados, tente informar o CPF completo ou utilize a busca manual`,
    };
  }

  protected fromJson = Aluno.fromJson;

  protected createEvent(aluno, tipo): AlunoEvent {
    return new AlunoEvent(aluno, 'client', tipo);
  }
}
