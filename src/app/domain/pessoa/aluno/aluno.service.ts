import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Sort,
  Pageable,
  Page,
  simularDelay,
} from 'app/shared/util/service.util';
import { EventService } from 'app/shared/event/event.service';
import { AlunoSortFields, Aluno, AlunoEvent, AlunoJson } from './aluno';
import { tap, map, flatMap, mapTo } from 'rxjs/operators';
import { Id, EntidadeEventType } from 'app/domain/entidade';
import { HttpClient } from '@angular/common/http';
import { endpoints } from 'app/shared/endpoints';

@Injectable()
export class AlunoService {
  constructor(private http: HttpClient, private eventService: EventService) {}

  recuperarPorId(id: Id): Observable<Aluno> {
    return this.http
      .get(`${endpoints.query.v1.alunos.urlCompleta}/${id}`)
      .pipe(map(Aluno.fromJson), flatMap(simularDelay));
  }

  buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
    { page, pageSize }: Pageable,
    filtro = '',
    sort?: Sort<AlunoSortFields>
  ): Observable<Page<Aluno>> {
    return this.http
      .get(endpoints.query.v1.alunos.urlCompleta, {
        params: {
          page: String(page),
          pageSize: String(pageSize),
          ...(filtro ? { searchTerm: filtro } : {}),
          ...(sort ? { order: sort.expression } : {}),
        },
      })
      .pipe(
        map(({ items, hasNext }: Page<AlunoJson>) => ({
          items: items.map(Aluno.fromJson),
          hasNext,
        })),
        flatMap(simularDelay)
      );
  }

  salvar(aluno: Aluno): Observable<Aluno> {
    let result: Observable<Aluno>;
    let eventType: EntidadeEventType;
    if (aluno.id) {
      result = this.http
        .put<AlunoJson>(
          `${endpoints.core.v1.alunos.urlCompleta}/${aluno.id}`,
          aluno
        )
        .pipe(mapTo(aluno));
      eventType = 'atualizado';
    } else {
      result = this.http
        .post<AlunoJson>(endpoints.core.v1.alunos.urlCompleta, aluno)
        .pipe(map(Aluno.fromJson));
      eventType = 'cadastrado';
    }
    return result.pipe(
      flatMap(simularDelay),
      tap((entidade) =>
        this.eventService.publish(new AlunoEvent(entidade, 'client', eventType))
      )
    );
  }
}
