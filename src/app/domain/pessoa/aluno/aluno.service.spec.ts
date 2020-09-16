import { TestBed } from '@angular/core/testing';
import { AlunoService } from './aluno.service';
import { injectionToken } from './alunos.mock';
import { Page, Pageable } from 'app/shared/util/service.util';
import { Aluno } from './aluno';
import { take } from 'rxjs/operators';
import alunosMock, { AlunosMock } from './alunos.mock';
import { environment } from 'environments/environment';

let mockValues: AlunosMock = {
  values: [],
};

environment.delaySimulado = [100, 300];

describe('AlunoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: injectionToken,
          useValue: mockValues,
        },
        AlunoService,
      ],
    });
  });

  describe('Quando não há alunos cadastrados', () => {
    let service: AlunoService;
    beforeEach(() => {
      mockValues.values = [];
      service = TestBed.inject(AlunoService);
    });

    describe('Quando a função "buscarAlunosLikeNomeOuEmailOuCpfOuMatricula" é invocada', () => {
      let result: Page<Aluno>;
      beforeEach(async () => {
        result = await service
          .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(new Pageable())
          .pipe(take(1))
          .toPromise();
      });

      it('O array de items é vazio', () =>
        expect(result.items.length).toEqual(0));
      it('A flag "hasNext" é false', () => expect(result.hasNext).toBeFalse());
    });
  });

  describe('Quando há 20 alunos cadastrados', () => {
    let service: AlunoService;
    beforeEach(() => {
      mockValues.values = alunosMock.slice(0, 20);
      service = TestBed.inject(AlunoService);
    });

    describe('Quando a função "buscarAlunosLikeNomeOuEmailOuCpfOuMatricula" é invocada', () => {
      let result: Page<Aluno>;
      beforeEach(async () => {
        result = await service
          .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(new Pageable())
          .pipe(take(1))
          .toPromise();
      });

      it('O array de items possui 20 elementos', () =>
        expect(result.items.length).toEqual(20));
      it('A flag "hasNext" é false', () => expect(result.hasNext).toBeFalse());
    });
  });

  describe('Quando há 50 alunos cadastrados', () => {
    let service: AlunoService;
    beforeEach(() => {
      mockValues.values = alunosMock.slice(0, 50);
      service = TestBed.inject(AlunoService);
    });

    describe('Quando a função "buscarAlunosLikeNomeOuEmailOuCpfOuMatricula" é invocada', () => {
      describe('Sem informar um filtro', () => {
        let result: Page<Aluno>;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(new Pageable())
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 20 elementos', () =>
          expect(result.items.length).toEqual(20));
        it('A flag "hasNext" é true', () => expect(result.hasNext).toBeTrue());
      });

      describe('Informando o valor "Teste 1" como filtro', () => {
        let result: Page<Aluno>;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
              new Pageable(),
              'Teste 1'
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 11 elementos', () =>
          expect(result.items.length).toEqual(11));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });
    });
  });
});
