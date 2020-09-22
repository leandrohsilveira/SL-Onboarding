import { IRequestInterceptor, getBackendService } from 'web-backend-api';
import { Pageable, Sort, filtrar } from 'app/shared/util/service.util';
import { map } from 'rxjs/operators';

export interface FilterPredicate {
  (filter: string): (item: any) => boolean;
}

export function createSearchRequestInterceptor(
  collectionName: string,
  path: string,
  filterPredicate: FilterPredicate
): IRequestInterceptor {
  return {
    collectionName,
    path: path,
    method: 'GET',
    applyToPath: 'complete',
    response: ({ fn, url }) => {
      const query = parseQueryString(url);
      const page = (query.get('page') ?? [])[0];
      const pageSize = (query.get('pageSize') ?? [])[0];
      const searchTerm = (query.get('searchTerm') ?? [])[0];
      const sortExpr = (query.get('order') ?? [])[0];
      const pageable = new Pageable(Number(page), Number(pageSize));
      const sort = sortExpr ? Sort.fromExpression(sortExpr) : undefined;
      return getBackendService()
        .getAllByFilter$(collectionName)
        .pipe(
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

function parseQueryString(url: string): Map<string, string[]> {
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
