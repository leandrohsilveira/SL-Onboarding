import { Injectable, Inject } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import {
  Sort,
  Pageable,
  searchString,
  Page,
  simularDelay,
  filtrar,
} from 'app/shared/util/service.util';
import { AlunoSortFields, Aluno, AlunoEvent } from './aluno';
import { AlunosMock, injectionToken } from './aluno.mock';

@Injectable()
export class AlunoService {
  constructor(@Inject(injectionToken) private alunosMock: AlunosMock) {
    this.events$ = this.eventsSubject.asObservable();
  }

  private eventsSubject = new Subject<AlunoEvent>();

  events$: Observable<AlunoEvent>;

  buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
    page: Pageable,
    filtro = '',
    sort?: Sort<AlunoSortFields>
  ): Observable<Page<Aluno>> {
    return simularDelay(
      filtrar(
        this.alunosMock.values,
        page,
        sort,
        (aluno) =>
          filtro === '' ||
          searchString(aluno.nome, filtro) ||
          searchString(aluno.cpf, filtro.replace(/(\.|\-)/g, '')) ||
          searchString(aluno.email, filtro) ||
          searchString(aluno.formaIngresso, filtro) ||
          searchString(String(aluno.matricula), filtro),
        (json) => Aluno.fromJson(json)
      )
    );
  }

  salvar(aluno: Aluno): Observable<Aluno> {
    const { values } = this.alunosMock;
    if (aluno.id) {
      for (let i = 0; i < values.length; i++) {
        const { id } = values[i];
        if (id === aluno.id) {
          values[i] = JSON.parse(JSON.stringify(aluno));
          this.eventsSubject.next(new AlunoEvent(aluno, 'atualizado'));
          return simularDelay(aluno);
        }
      }
      return throwError(
        new Error(
          $localize`:Mensagem de erro que ocorre ao tentar atualizar um aluno que não está mais cadastrado:O aluno com id ${aluno.id} não foi encontrado`
        )
      );
    } else {
      const matricula = values[values.length - 1]?.matricula ?? 0;
      const id = matricula + 1;
      aluno.id = `uuid${id}`;
      aluno.matricula = id;
      values.push(JSON.parse(JSON.stringify(aluno)));
      this.eventsSubject.next(new AlunoEvent(aluno, 'cadastrado'));
      return simularDelay(aluno);
    }
  }
}
