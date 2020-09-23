import { dataService } from 'web-backend-api';
import professores from './professor.mock.json';
import { endpoints } from 'app/shared/endpoints';
import { createSearchRequestInterceptor } from 'backend/interceptors';
import { searchString } from 'app/shared/util/service.util';

export const collectionName = 'professor';

export function setup(data = professores) {
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

    data.forEach((item) => {
      db.storeData(collectionName, item);
    });
  });
}
