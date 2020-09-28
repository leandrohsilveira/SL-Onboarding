import { Injectable } from '@angular/core';
import {
  Professor,
  ProfessorJson,
  ProfessorEvent,
  ProfessorSortFields,
} from './professor';
import { endpoints } from 'app/shared/endpoints';
import { LookupErrorsMessages } from 'app/shared/util/service.util';
import { PessoaService } from '../pessoa.service';

@Injectable()
export class ProfessorService extends PessoaService<
  Professor,
  ProfessorJson,
  ProfessorSortFields
> {
  protected endpoints = {
    core: endpoints.core.v1.professores,
    query: endpoints.query.v1.professores,
  };

  protected get lookupErrors(): LookupErrorsMessages {
    return {
      notFound: $localize`Nenhum professor encontrado`,
      multipleFound: (length) =>
        $localize`${length} professores parecidos encontrados, tente informar o CPF completo ou utilize a busca manual`,
    };
  }

  protected fromJson = Professor.fromJson;

  protected createEvent(professor, tipo): ProfessorEvent {
    return new ProfessorEvent(professor, 'client', tipo);
  }
}
