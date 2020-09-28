import { dataService, IBackendService } from 'web-backend-api';
import alunos from './aluno.mock.json';
import { searchString } from 'app/shared/util/service.util';
import { AlunoJson } from 'app/domain/pessoa/aluno/aluno';
import { endpoints } from 'app/shared/endpoints';
import { map, max, mergeMap, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  createSearchRequestInterceptor,
  createNotTakenInterceptor,
} from 'backend/interceptors';

export const collectionName = 'aluno';

export function setup(data: any[] = alunos): void {
  dataService(collectionName, (db: IBackendService) => {
    db.addReplaceUrl(collectionName, endpoints.core.v1.alunos.path);
    db.addReplaceUrl(collectionName, endpoints.query.v1.alunos.path);

    db.addRequestInterceptor(
      createSearchRequestInterceptor(
        collectionName,
        endpoints.query.v1.alunos.path,
        (searchTerm) => (item) =>
          searchTerm === '' ||
          searchString(item.nome, searchTerm) ||
          searchString(item.cpf, searchTerm.replace(/(\.|\-)/g, '')) ||
          searchString(item.email, searchTerm) ||
          searchString(item.formaIngresso, searchTerm) ||
          searchString(String(item.matricula), searchTerm)
      )
    );

    db.addRequestInterceptor(
      createNotTakenInterceptor(
        collectionName,
        endpoints.query.v1.alunos,
        'cpf'
      )
    );

    db.addRequestInterceptor(
      createNotTakenInterceptor(
        collectionName,
        endpoints.query.v1.alunos,
        'email'
      )
    );

    db.addTransformPostMap(collectionName, (aluno: AlunoJson) => {
      return db.getAllByFilter$(collectionName).pipe(
        mergeMap((items: any[]) => of(...items)),
        map((item: AlunoJson) => Number(item.matricula)),
        max(),
        tap((matricula) => (aluno.matricula = matricula + 1))
      );
    });

    data.forEach((aluno) => db.storeData(collectionName, aluno));
  });
}
