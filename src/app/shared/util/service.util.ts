import {
  Observable,
  of,
  isObservable,
  Subscribable,
  Unsubscribable,
} from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { PoTableColumn, PoTableColumnSortType } from '@po-ui/ng-components';

export interface Page<T> {
  items: T[];
  hasNext: boolean;
}

export class Pageable {
  constructor(public page = 1, public pageSize = 20) {}

  get offset() {
    return this.page * this.pageSize - this.pageSize;
  }

  get endOffset() {
    return this.offset + this.pageSize;
  }

  next(): Pageable {
    return new Pageable(this.page + 1, this.pageSize);
  }

  apply<T = any>(items: T[]): T[] {
    return items.slice(this.offset, this.endOffset);
  }
}

export class Sort<Fields = string> {
  constructor(public field: Fields, public direction: 'asc' | 'desc') {}

  get expression() {
    return `${this.direction === 'asc' ? '+' : '-'}${this.field}`;
  }

  get ascending() {
    return this.direction === 'asc';
  }

  apply<T = any>(items: T[]): T[] {
    return items.sort((a, b) => {
      const f = this.field as any;
      if (a[f] === b[f]) return 0;
      else {
        if (a[f] > b[f]) return this.direction === 'asc' ? 1 : -1;
        else return this.direction === 'asc' ? -1 : 1;
      }
    });
  }

  static fromOrderChange<Fields = string>({
    column,
    type,
  }: {
    column: PoTableColumn;
    type: PoTableColumnSortType;
  }): Sort<Fields> {
    return new Sort<Fields>(
      column.property as any,
      type === PoTableColumnSortType.Ascending ? 'asc' : 'desc'
    );
  }
}

export function searchString(value?: string, filter = '') {
  return (
    filter === '' || value?.toUpperCase().indexOf(filter.toUpperCase()) >= 0
  );
}

export function simularDelay<T>(result: T | Observable<T>): Observable<T> {
  const observable = isObservable(result) ? result : of(result);
  if (environment.delaySimulado?.length === 2) {
    const [min, max] = environment.delaySimulado;
    return observable.pipe(
      delay(Math.round(Math.random() * (max - min) + min))
    );
  }
  return observable;
}

export function filtrar<R = any, SortFields = any>(
  values: any[],
  page: Pageable,
  sort: Sort<SortFields> | undefined,
  predicate: (val: any) => boolean,
  deserializer: (val: any) => R
): Page<R> {
  let filtrado = values.filter(predicate);
  if (sort) filtrado = sort.apply(filtrado);
  const items = page.apply(filtrado).map(deserializer);
  return {
    items,
    hasNext: filtrado.length > page.offset + items.length,
  };
}
