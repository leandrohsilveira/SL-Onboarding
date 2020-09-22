import { dataService, IBackendService } from 'web-backend-api';
import alunos from './aluno.mock.json';
import {
  searchString,
  Pageable,
  Sort,
  filtrar,
} from 'app/shared/util/service.util';
import { AlunoJson } from 'app/domain/pessoa/aluno/aluno';
import { endpoints } from 'app/shared/endpoints';
import { map, max, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const collectionName = 'aluno';

export function setup(data: any[] = alunos) {
  dataService(collectionName, (db: IBackendService) => {
    db.addReplaceUrl(collectionName, endpoints.core.v1.alunos.path);
    db.addReplaceUrl(collectionName, endpoints.query.v1.alunos.path);

    db.addRequestInterceptor({
      collectionName,
      path: endpoints.query.v1.alunos.path,
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
        const deserializer = (item) => item;
        return db.getAllByFilter$(collectionName).pipe(
          map((items) =>
            filtrar(
              items,
              pageable,
              sort,
              (item) =>
                searchTerm === '' ||
                searchString(item.nome, searchTerm) ||
                searchString(item.cpf, searchTerm.replace(/(\.|\-)/g, '')) ||
                searchString(item.email, searchTerm) ||
                searchString(item.formaIngresso, searchTerm) ||
                searchString(String(item.matricula), searchTerm),
              deserializer
            )
          ),
          map((result) => fn.response(url, 200, result))
        );
      },
    });

    db.addTransformPostMap(collectionName, (aluno: AlunoJson) => {
      return db.getAllByFilter$(collectionName).pipe(
        flatMap((items: any[]) => of(...items)),
        map((item: AlunoJson) => Number(item.matricula)),
        max(),
        map((matricula) => {
          aluno.matricula = Number(matricula) + 1;
          return aluno;
        })
      );
    });

    data.forEach((aluno) => {
      db.storeData(collectionName, aluno);
    });
  });
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
