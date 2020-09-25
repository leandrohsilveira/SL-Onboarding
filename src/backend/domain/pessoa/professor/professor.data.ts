import { dataService, getBackendService } from 'web-backend-api';
import professores from './professor.mock.json';
import { endpoints } from 'app/shared/endpoints';
import {
  createSearchRequestInterceptor,
  parseQueryString,
} from 'backend/interceptors';
import { searchString, searchOneOf } from 'app/shared/util/service.util';
import { ProfessorJson } from 'app/domain/pessoa/professor/professor';
import { take, map } from 'rxjs/operators';

export const collectionName = 'professor';

export async function insertInitialData(
  data = professores
): Promise<ProfessorJson[]> {
  await Promise.all(
    data.map((item) => getBackendService().storeData(collectionName, item))
  );
  return getBackendService()
    .getAllByFilter$(collectionName)
    .pipe(take(1))
    .toPromise();
}

export async function clearData(): Promise<void> {
  await getBackendService().clearData(collectionName);
}

export function setup(data = professores): void {
  dataService(collectionName, (db) => {
    db.addReplaceUrl(collectionName, endpoints.core.v1.professores.path);
    db.addReplaceUrl(collectionName, endpoints.query.v1.professores.path);

    db.addRequestInterceptor({
      collectionName,
      method: 'GET',
      path: `${endpoints.query.v1.professores.path}/lookup`,
      applyToPath: 'complete',
      response: ({ url, fn: { response } }) => {
        const query = parseQueryString(url);
        const q = (query.get('query') ?? [])[0];
        return db.getAllByFilter$(collectionName).pipe(
          map((items: any[]) =>
            items.filter(
              ({ id, cpf, nome }) =>
                id === q ||
                searchString(nome, q) ||
                searchString(cpf, q.replace(/(\.|\-)/g, ''))
            )
          ),
          map((result) => response(url, 200, result))
        );
      },
    });

    db.addRequestInterceptor(
      createSearchRequestInterceptor(
        collectionName,
        endpoints.query.v1.professores.path,
        (searchTerm) => (item) =>
          searchTerm === '' ||
          searchString(item.nome, searchTerm) ||
          searchString(item.cpf, searchTerm.replace(/(\.|\-)/g, '')) ||
          searchString(item.email, searchTerm) ||
          searchString(item.titulacao, searchTerm)
      )
    );

    insertInitialData(data);
  });
}
