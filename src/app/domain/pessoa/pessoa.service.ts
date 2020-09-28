import { EntidadeService } from '../entidade.service';
import {
  Pessoa,
  PessoaJson,
  CpfNotTakenJson,
  EmailNotTakenJson,
} from './pessoa';
import { Observable, throwError, of } from 'rxjs';
import { mergeMap, map, catchError, mapTo } from 'rxjs/operators';
import {
  tryMapToUniqueResult,
  LookupErrorsMessages,
  simularDelay,
} from 'app/shared/util/service.util';

export abstract class PessoaService<
  T extends Pessoa,
  J extends PessoaJson,
  F = string
> extends EntidadeService<T, J, F> {
  protected abstract lookupErrors: LookupErrorsMessages;

  cpfNotTaken(data: CpfNotTakenJson): Observable<boolean> {
    return this.http
      .post(`${this.endpoints.query.urlCompleta}/cpfNotTaken`, data, {
        observe: 'response',
      })
      .pipe(
        mergeMap((res) => {
          if (res.status < 400) return of(true);
          else if (res.status === 400) return of(false);
          else throwError(res);
        }),
        mergeMap(simularDelay)
      );
  }

  emailNotTaken(data: EmailNotTakenJson): Observable<boolean> {
    return this.http
      .post(`${this.endpoints.query.urlCompleta}/emailNotTaken`, data, {
        observe: 'response',
      })
      .pipe(
        mergeMap((res) => {
          if (res.status < 400) return of(true);
          else if (res.status === 400) return of(false);
          else throwError(res);
        }),
        mergeMap(simularDelay)
      );
  }

  lookup(query: string): Observable<T> {
    return this.http
      .get<J[] | string>(`${this.endpoints.query.urlCompleta}/lookup`, {
        params: {
          query,
        },
      })
      .pipe(
        mergeMap((res) => (Array.isArray(res) ? of(res) : throwError(res))),
        map((res) => res.map((json) => this.fromJson(json))),
        catchError((error) => {
          console.error(error);
          return throwError(error);
        }),
        tryMapToUniqueResult(
          this.lookupErrors,
          Pessoa.nomeOuCpfPredicate<T>(query)
        ),
        mergeMap(simularDelay)
      );
  }
}
