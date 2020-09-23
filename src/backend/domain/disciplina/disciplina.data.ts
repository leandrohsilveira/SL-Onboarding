import { dataService, getBackendService } from 'web-backend-api';

import { endpoints } from 'app/shared/endpoints';
import { createSearchRequestInterceptor } from 'backend/interceptors';
import { searchOneOf } from 'app/shared/util/service.util';

import json from './disciplina.mock.json';
import { collectionName as professorCollectionName } from 'backend/domain/pessoa/professor/professor.data';
import { DisciplinaJson } from 'app/domain/disciplina/disciplina';
import { take } from 'rxjs/operators';

const disciplina = [...json];

export const collectionName = 'disciplina';

export async function getAll(): Promise<DisciplinaJson[]> {
  return await getBackendService()
    .getAllByFilter$(collectionName)
    .pipe(take(1))
    .toPromise();
}

export async function insertInitialData(
  data = disciplina
): Promise<DisciplinaJson[]> {
  for (const item of data) {
    await getBackendService().storeData(collectionName, item);
  }
  return await getAll();
}

export async function clearData(): Promise<void> {
  await getBackendService().clearData(collectionName);
}

export function setup(data = disciplina): void {
  dataService(collectionName, (db) => {
    db.addReplaceUrl(collectionName, endpoints.core.v1.disciplinas.path);
    db.addReplaceUrl(collectionName, endpoints.query.v1.disciplinas.path);

    db.addJoinGetByIdMap(collectionName, {
      collectionSource: professorCollectionName,
      fieldId: 'professorRef',
      fieldDest: 'professor',
      removeFieldId: true,
    });

    db.addRequestInterceptor(
      createSearchRequestInterceptor(
        collectionName,
        endpoints.query.v1.disciplinas.path,
        (searchTerm) => (item) =>
          searchOneOf(searchTerm, [
            item.descricao,
            item.sigla,
            String(item.cargaHoraria),
          ])
      )
    );

    insertInitialData(data);
  });
}
