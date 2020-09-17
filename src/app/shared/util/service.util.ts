import {
  Observable,
  of,
  isObservable,
  BehaviorSubject,
  combineLatest,
  MonoTypeOperatorFunction,
  Subject,
} from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  tap,
  debounceTime,
  switchMap,
  take,
  map,
  withLatestFrom,
  catchError,
  takeWhile,
  publish,
  reduce,
} from 'rxjs/operators';
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

export interface PageState<T, F = string> {
  items: T[];
  hasNext: boolean;
  loading: boolean;
  sort?: Sort<F>;
}

export class PageStateSubject<T, F = string> {
  constructor(
    private service: (
      pageable: Pageable,
      filter: string,
      sort: Sort<F>
    ) => Observable<Page<T>>,
    private _takeWhile: <R = any>() => MonoTypeOperatorFunction<R>
  ) {
    this.resultSubject.pipe(this._takeWhile()).subscribe(
      () => this.loadingSubject.next(false),
      () => this.loadingSubject.next(false)
    );
  }

  private resultSubject = new BehaviorSubject<Page<T>>({
    items: [],
    hasNext: false,
  });

  private loadingSubject = new BehaviorSubject<boolean>(false);

  private page = 1;
  private pageSize = 20;
  private filter = '';
  private sort: Sort<F>;

  setSort(sort: Sort<F>) {
    this.page = 1;
    this.sort = sort;
    this.load(true);
  }

  setFilter(filter: string) {
    this.page = 1;
    this.filter = filter;
    this.load(true);
  }

  nextPage() {
    this.page++;
    this.load();
  }

  load(reset = false) {
    this.loadingSubject.next(true);
    this.service(new Pageable(this.page, this.pageSize), this.filter, this.sort)
      .pipe(this._takeWhile(), take(1), withLatestFrom(this.resultSubject))
      .subscribe(
        ([result, current]) => {
          this.resultSubject.next({
            hasNext: result.hasNext,
            items: reset ? result.items : [...current.items, ...result.items],
          });
        },
        (error) => this.resultSubject.error(error)
      );
  }

  asObservable(): Observable<PageState<T, F>> {
    return combineLatest(this.resultSubject, this.loadingSubject).pipe(
      this._takeWhile(),
      map(([result, loading]) => ({
        ...result,
        sort: this.sort,
        loading,
      }))
    );
  }

  subscribe(
    next: (state: PageState<T, F>) => void,
    error?: (err: any) => void
  ) {
    return this.asObservable().subscribe(next, error);
  }
}
