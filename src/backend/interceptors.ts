import { IRequestInterceptor, getBackendService } from 'web-backend-api';
import {
  Pageable,
  Sort,
  filtrar,
  SortFieldsExtractor,
} from 'app/shared/util/service.util';
import { map, switchMap, toArray, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export type FilterPredicate = (filter: string) => (item: any) => boolean;

export type FilterTransformer<T = any> = (items: T[]) => Observable<T[]>;

export function joinToOne<T = any>(
  collectionName: string,
  joinField: keyof T,
  joinTarget: keyof T
): FilterTransformer<T> {
  return (items: T[]): Observable<T[]> =>
    of(...items).pipe(
      mergeMap((item: T) =>
        getBackendService()
          .getInstance$(collectionName, item[joinField])
          .pipe(
            map((join) => ({
              ...item,
              [joinTarget]: join,
            }))
          )
      ),
      toArray()
    );
}

export function createSearchRequestInterceptor(
  collectionName: string,
  path: string,
  filterPredicate: FilterPredicate,
  transformer: FilterTransformer = (items) => of(items),
  extractors: SortFieldsExtractor = {}
): IRequestInterceptor {
  return {
    collectionName,
    path,
    method: 'GET',
    applyToPath: 'complete',

    response: ({ fn, url }) => {
      const query = parseQueryString(url);
      const page = (query.get('page') ?? [])[0];
      const pageSize = (query.get('pageSize') ?? [])[0];
      const searchTerm = (query.get('searchTerm') ?? [])[0];
      const sortExpr = (query.get('order') ?? [])[0];
      const pageable = new Pageable(Number(page), Number(pageSize));
      const sort = sortExpr
        ? Sort.fromExpression(sortExpr, extractors)
        : undefined;
      return getBackendService()
        .getAllByFilter$(collectionName)
        .pipe(
          switchMap((items) => transformer(items)),
          map((items) =>
            filtrar(
              items,
              pageable,
              sort,
              filterPredicate(searchTerm),
              (item) => item
            )
          ),
          map((result) => fn.response(url, 200, result))
        );
    },
  };
}

export function parseQueryString(url: string): Map<string, string[]> {
  const params = new Map<string, string[]>();
  const [, queryString] = url.split('?');
  if (queryString) {
    const segments = queryString.split('&');
    segments.forEach((segment) => {
      const [name, value] = segment
        .split('=')
        .map((i) => decodeURIComponent(i));
      if (value) {
        params.set(
          name,
          params.has(name) ? [...params.get(name), value] : [value]
        );
      }
    });
  }
  return params;
}
