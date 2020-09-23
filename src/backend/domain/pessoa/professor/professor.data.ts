import { dataService, getBackendService } from 'web-backend-api';
import professores from './professor.mock.json';
import { endpoints } from 'app/shared/endpoints';
import { createSearchRequestInterceptor } from 'backend/interceptors';
import { searchString } from 'app/shared/util/service.util';
import { ProfessorJson } from 'app/domain/pessoa/professor/professor';
import { take } from 'rxjs/operators';

export const collectionName = 'professor';

export async function insertInitialData(
  data = professores
): Promise<ProfessorJson[]> {
  for (const item of data) {
    await getBackendService().storeData(collectionName, item);
  }
  return await getBackendService()
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
