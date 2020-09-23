import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Entidade,
  EntidadeJson,
  Id,
  EntidadeEventType,
  EntidadeEvent,
} from './entidade';
import { Observable } from 'rxjs';
import { Endpoint } from 'app/shared/endpoints';
import { EventService } from 'app/shared/event/event.service';
import { map, mapTo, tap, mergeMap } from 'rxjs/operators';
import {
  simularDelay,
  Pageable,
  Sort,
  Page,
} from 'app/shared/util/service.util';

export interface Endpoints {
  core: Endpoint;
  query: Endpoint;
}

@Injectable()
export abstract class EntidadeService<
  E extends Entidade,
  J extends EntidadeJson,
  SF = string
> {
  constructor(
    protected http: HttpClient,
    protected eventService: EventService
  ) {}

  protected abstract endpoints: Endpoints;

  protected abstract fromJson(json: J): E;

  protected abstract createEvent(
    entidade: E,
    eventType: EntidadeEventType
  ): EntidadeEvent<E>;

  protected toJson(entidade: E): J {
    return JSON.parse(JSON.stringify(entidade));
  }

  recuperarPorId(id: Id): Observable<E> {
    return this.http
      .get(`${this.endpoints.query.urlCompleta}/${id}`)
      .pipe(map(this.fromJson), mergeMap(simularDelay));
  }

  filtrar(
    { page, pageSize }: Pageable,
    filtro = '',
    sort?: Sort<SF>
  ): Observable<Page<E>> {
    return this.http
      .get(this.endpoints.query.urlCompleta, {
        params: {
          page: String(page),
          pageSize: String(pageSize),
          ...(filtro ? { searchTerm: filtro } : {}),
          ...(sort ? { order: sort.expression } : {}),
        },
      })
      .pipe(
        map(({ items, hasNext }: Page<J>) => ({
          items: items.map(this.fromJson),
          hasNext,
        })),
        mergeMap(simularDelay)
      );
  }

  salvar(entidade: E): Observable<E> {
    let result: Observable<E>;
    let eventType: EntidadeEventType;
    if (entidade.id) {
      result = this.http
        .put<J>(
          `${this.endpoints.core.urlCompleta}/${entidade.id}`,
          this.toJson(entidade)
        )
        .pipe(mapTo(entidade));
      eventType = 'atualizado';
    } else {
      result = this.http
        .post<J>(this.endpoints.core.urlCompleta, this.toJson(entidade))
        .pipe(map(this.fromJson));
      eventType = 'cadastrado';
    }
    return result.pipe(
      mergeMap(simularDelay),
      tap((ent) => this.eventService.publish(this.createEvent(ent, eventType)))
    );
  }
}
