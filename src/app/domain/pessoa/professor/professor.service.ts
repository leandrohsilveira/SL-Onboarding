import { Injectable } from '@angular/core';
import { EntidadeService } from 'app/domain/entidade.service';
import {
  Professor,
  ProfessorJson,
  ProfessorEvent,
  ProfessorSortFields,
} from './professor';
import { endpoints } from 'app/shared/endpoints';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import {
  LookupErrorsMessages,
  tryMapToUniqueResult,
} from 'app/shared/util/service.util';

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

  private get lookupErrors(): LookupErrorsMessages {
    return {
      notFound: $localize`Nenhum professor encontrado`,
      multipleFound: (length) =>
        $localize`${length} registros parecidos encontrados, tente informar o CPF completo ou utilize a busca manual`,
    };
  }

  protected fromJson = Professor.fromJson;

  protected createEvent(professor, tipo): ProfessorEvent {
    return new ProfessorEvent(professor, 'client', tipo);
  }

  lookup(query: string): Observable<Professor> {
    return this.http
      .get<ProfessorJson[] | string>(
        `${this.endpoints.query.urlCompleta}/lookup`,
        {
          params: {
            query,
          },
        }
      )
      .pipe(
        mergeMap((res) => (Array.isArray(res) ? of(res) : throwError(res))),
        map((res) => res.map((json) => this.fromJson(json))),
        catchError((error) => {
          console.error(error);
          return throwError(error);
        }),
        tryMapToUniqueResult(
          this.lookupErrors,
          Professor.nomeOuCpfPredicate(query)
        )
      );
  }
}
