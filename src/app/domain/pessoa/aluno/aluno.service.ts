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
import { EventService } from 'app/shared/event/event.service';
import { AlunoSortFields, Aluno, AlunoEvent } from './aluno';
import { AlunosMock, injectionToken } from './aluno.mock';
import { tap } from 'rxjs/operators';
import { Id } from 'app/domain/entidade';

@Injectable()
export class AlunoService {
  constructor(
    @Inject(injectionToken) private alunosMock: AlunosMock,
    private eventService: EventService
  ) {}

  recuperarPorId(id: Id): Observable<Aluno> {
    const aluno = this.alunosMock.values.find((json) => json.id === id);
    if (aluno) return simularDelay(Aluno.fromJson(aluno));
    else
      return throwError(
        new Error(
          $localize`:Mensagem de erro que ocorre ao tentar buscar um aluno que não está cadastrado:O aluno com id ${aluno.id} não foi encontrado`
        )
      );
  }

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
          return simularDelay(aluno).pipe(
            tap((a) =>
              this.eventService.publish(
                new AlunoEvent(a, 'client', 'atualizado')
              )
            )
          );
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
      return simularDelay(aluno).pipe(
        tap((a) =>
          this.eventService.publish(new AlunoEvent(a, 'client', 'cadastrado'))
        )
      );
    }
  }
}
