import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Sort,
  Pageable,
  searchString,
  Page,
  simularDelay,
  filtrar,
} from 'app/shared/util/service.util';
import { AlunoSortFields, Aluno } from './aluno';
import { AlunosMock, injectionToken } from './aluno.mock';

@Injectable()
export class AlunoService {
  constructor(@Inject(injectionToken) private alunosMock: AlunosMock) {}

  buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
    page: Pageable,
    filtro = '',
    sort?: Sort<AlunoSortFields>
  ): Observable<Page<Aluno>> {
    return simularDelay(
      filtrar(
        this.alunosMock.values,
        page,
        sort,
        (aluno) =>
          filtro === '' ||
          searchString(aluno.nome, filtro) ||
          searchString(aluno.cpf, filtro.replace(/(\.|\-)/g, '')) ||
          searchString(aluno.email, filtro) ||
          searchString(aluno.formaIngresso, filtro) ||
          searchString(String(aluno.matricula), filtro),
        (json) => Aluno.fromJson(json)
      )
    );
  }
}
