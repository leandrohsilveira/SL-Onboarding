import {
  Observable,
  of,
  isObservable,
  BehaviorSubject,
  combineLatest,
  MonoTypeOperatorFunction,
  Subscription,
  throwError,
  OperatorFunction,
} from 'rxjs';
import { delay, take, map, withLatestFrom, mergeMap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { PoTableColumn, PoTableColumnSortType } from '@po-ui/ng-components';

export interface Page<T> {
  items: T[];
  hasNext: boolean;
}

export class Pageable {
  constructor(public page = 1, public pageSize = 20) {}

  get offset(): number {
    return this.page * this.pageSize - this.pageSize;
  }

  get endOffset(): number {
    return this.offset + this.pageSize;
  }

  next(): Pageable {
    return new Pageable(this.page + 1, this.pageSize);
  }

  apply<T = any>(items: T[]): T[] {
    return items.slice(this.offset, this.endOffset);
  }
}

interface PoTableColumnSort {
  column: PoTableColumn;
  type: PoTableColumnSortType;
}

interface SortFieldsOverride<Fields = string> {
  [key: string]: Fields;
}

export type SortFieldsExtractor = {
  [field: string]: (item: any) => string;
};

export class Sort<Fields = string> {
  static fromOrderChange<F = string>(
    { column, type }: PoTableColumnSort,
    override: SortFieldsOverride<F> = {},
    extractors: SortFieldsExtractor = {}
  ): Sort<F> {
    const prop = column.property as any;
    return new Sort<F>(
      override[prop] ?? prop,
      type === PoTableColumnSortType.Ascending ? 'asc' : 'desc',
      extractors
    );
  }

  static fromExpression<F = string>(
    expr: string,
    extractors: SortFieldsExtractor = {}
  ): Sort<F> {
    const field = expr.replace(/^(\+|\-)/, '') as any;
    return new Sort<F>(field, expr[0] === '+' ? 'asc' : 'desc', extractors);
  }

  constructor(
    public field: Fields,
    public direction: 'asc' | 'desc',
    private extractors: SortFieldsExtractor = {}
  ) {}

  get expression(): string {
    return `${this.direction === 'asc' ? '+' : '-'}${this.field}`;
  }

  get ascending(): boolean {
    return this.direction === 'asc';
  }

  apply<T = any>(items: T[]): T[] {
    return items.sort((a, b) => {
      const f = this.field as any;
      const va = this.extractors[f] ? this.extractors[f](a) : a[f];
      const vb = this.extractors[f] ? this.extractors[f](b) : b[f];
      if (va === vb) return 0;
      else {
        if (va > vb) return this.direction === 'asc' ? 1 : -1;
        else return this.direction === 'asc' ? -1 : 1;
      }
    });
  }
}

export function searchString(value?: string, filter = ''): boolean {
  return (
    filter === '' || value?.toUpperCase().indexOf(filter.toUpperCase()) >= 0
  );
}

export function searchOneOf(filter = '', values: string[]): boolean {
  return !!values.find((value) => searchString(value, filter));
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
    private takeWhile: <R = any>() => MonoTypeOperatorFunction<R>
  ) {
    this.resultSubject.pipe(this.takeWhile()).subscribe(
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

  setSort(sort: Sort<F>): void {
    this.page = 1;
    this.sort = sort;
    this.load(true);
  }

  setFilter(filter: string): void {
    this.page = 1;
    this.filter = filter;
    this.load(true);
  }

  nextPage(): void {
    this.page++;
    this.load();
  }

  load(reset = false): void {
    this.loadingSubject.next(true);
    this.service(new Pageable(this.page, this.pageSize), this.filter, this.sort)
      .pipe(this.takeWhile(), take(1), withLatestFrom(this.resultSubject))
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
    return combineLatest([this.resultSubject, this.loadingSubject]).pipe(
      this.takeWhile(),
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
  ): Subscription {
    return this.asObservable().subscribe(next, error);
  }
}

export interface LookupErrorsMessages {
  notFound: string;
  multipleFound: (length: number) => string;
}

export function tryMapToUniqueResult<T = any>(
  errors: LookupErrorsMessages,
  predicate: (item: T) => boolean
): OperatorFunction<T[], T> {
  return mergeMap((res: T[]) => {
    if (res.length === 1) return of(res[0]);
    const prof = res.find(predicate);
    if (prof) return of(prof);
    return throwError(
      new Error(
        res.length === 0 ? errors.notFound : errors.multipleFound(res.length)
      )
    );
  });
}
