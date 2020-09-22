import { dataService, IBackendService } from 'web-backend-api';
import alunos from './aluno.mock.json';
import { searchString } from 'app/shared/util/service.util';
import { AlunoJson } from 'app/domain/pessoa/aluno/aluno';
import { endpoints } from 'app/shared/endpoints';
import { map, max, take, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const collectionName = 'aluno';

export function setup(data: any[] = alunos) {
  dataService(collectionName, (db: IBackendService) => {
    db.addReplaceUrl(collectionName, endpoints.core.v1.alunos.path);
    db.addReplaceUrl(collectionName, endpoints.query.v1.alunos.path);

    db.addFieldFilterMap(
      collectionName,
      'searchTerm',
      (filtro: string, aluno: AlunoJson) => {
        return (
          filtro === '' ||
          searchString(aluno.nome, filtro) ||
          searchString(aluno.cpf, filtro.replace(/(\.|\-)/g, '')) ||
          searchString(aluno.email, filtro) ||
          searchString(aluno.formaIngresso, filtro) ||
          searchString(String(aluno.matricula), filtro)
        );
      }
    );

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
