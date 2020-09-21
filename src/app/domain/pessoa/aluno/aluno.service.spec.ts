import { TestBed } from '@angular/core/testing';
import { AlunoService } from './aluno.service';
import { injectionToken } from './aluno.mock';
import { Page, Pageable, Sort } from 'app/shared/util/service.util';
import { Aluno, AlunoSortFields, FormaIngresso, AlunoEvent } from './aluno';
import { take, filter, map } from 'rxjs/operators';
import alunosMock, { AlunosMock } from './aluno.mock';
import { environment } from 'environments/environment';
import { format as formatCpf } from '@fnando/cpf';
import { EventService } from 'app/shared/event/event.service';
import { Observable } from 'rxjs';

let mockValues: AlunosMock = {
  values: [],
};

environment.delaySimulado = null;

describe('AlunoService', () => {
  let events$: Observable<AlunoEvent>;
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
    const eventService = TestBed.inject(EventService);
    events$ = eventService.bus$.pipe(
      filter((e) => e instanceof AlunoEvent),
      map((e) => e as AlunoEvent)
    );
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

      describe('Informando o valor "TESTE 1" como filtro (para filtrar nome)', () => {
        let result: Page<Aluno>;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
              new Pageable(),
              'TESTE 1'
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 11 elementos', () =>
          expect(result.items.length).toEqual(11));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });

      describe('Informando o valor "teste1" como filtro (para filtrar email)', () => {
        let result: Page<Aluno>;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
              new Pageable(),
              'teste1'
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 11 elementos', () =>
          expect(result.items.length).toEqual(11));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });

      describe('Informando o valor "TESTE1" como filtro (para filtrar email)', () => {
        let result: Page<Aluno>;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
              new Pageable(),
              'TESTE1'
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 11 elementos', () =>
          expect(result.items.length).toEqual(11));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });

      describe('Informando o valor "ena" como filtro (para filtrar formaIngresso)', () => {
        let result: Page<Aluno>;
        let expectedLength: number;
        let expectedHasNext: boolean;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(new Pageable(), 'ena')
            .pipe(take(1))
            .toPromise();

          expectedLength = mockValues.values.filter(
            (aluno) => aluno.formaIngresso === 'ENADE'
          ).length;
          expectedHasNext = expectedLength > 20;
          expectedLength = expectedHasNext ? 20 : expectedLength;
        });

        it('O array de items possui 11 elementos', () =>
          expect(result.items.length).toEqual(expectedLength));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toEqual(expectedHasNext));
      });

      describe('Informando o valor "ves" como filtro (para filtrar formaIngresso)', () => {
        let result: Page<Aluno>;
        let expectedLength: number;
        let expectedHasNext: boolean;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(new Pageable(), 'ves')
            .pipe(take(1))
            .toPromise();

          expectedLength = mockValues.values.filter(
            (aluno) => aluno.formaIngresso === 'Vestibular'
          ).length;
          expectedHasNext = expectedLength > 20;
          expectedLength = expectedHasNext ? 20 : expectedLength;
        });

        it('O array de items possui 11 elementos', () =>
          expect(result.items.length).toEqual(expectedLength));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toEqual(expectedHasNext));
      });

      describe('Informando o cpf do primeiro elemento como valor do filtro (para filtrar CPF, sem formatação)', () => {
        let result: Page<Aluno>;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
              new Pageable(),
              mockValues.values[0].cpf
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 1 elementos', () =>
          expect(result.items.length).toEqual(1));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });

      describe('Informando o cpf do primeiro elemento como valor do filtro (para filtrar CPF, com formatação)', () => {
        let result: Page<Aluno>;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
              new Pageable(),
              formatCpf(mockValues.values[0].cpf)
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 1 elementos', () =>
          expect(result.items.length).toEqual(1));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });

      describe('Informando o sort pelo nome e asc', () => {
        let result: Page<Aluno>;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
              new Pageable(),
              '',
              new Sort<AlunoSortFields>('nome', 'asc')
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 20 elementos', () =>
          expect(result.items.length).toEqual(20));
        it('A flag "hasNext" é true', () => expect(result.hasNext).toBeTrue());
        it('O array de items está ordenado com ordem crescente', () =>
          expect(result.items.map((aluno) => aluno.nome)).toEqual([
            'Teste 1',
            'Teste 10',
            'Teste 11',
            'Teste 12',
            'Teste 13',
            'Teste 14',
            'Teste 15',
            'Teste 16',
            'Teste 17',
            'Teste 18',
            'Teste 19',
            'Teste 2',
            'Teste 20',
            'Teste 21',
            'Teste 22',
            'Teste 23',
            'Teste 24',
            'Teste 25',
            'Teste 26',
            'Teste 27',
          ]));
      });

      describe('Informando o sort pelo nome e desc', () => {
        let result: Page<Aluno>;
        beforeEach(async () => {
          result = await service
            .buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
              new Pageable(),
              '',
              new Sort<AlunoSortFields>('nome', 'desc')
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 20 elementos', () =>
          expect(result.items.length).toEqual(20));
        it('A flag "hasNext" é true', () => expect(result.hasNext).toBeTrue());
        it('O array de items está ordenado com ordem decrescente', () =>
          expect(result.items.map((aluno) => aluno.nome)).toEqual([
            'Teste 9',
            'Teste 8',
            'Teste 7',
            'Teste 6',
            'Teste 50',
            'Teste 5',
            'Teste 49',
            'Teste 48',
            'Teste 47',
            'Teste 46',
            'Teste 45',
            'Teste 44',
            'Teste 43',
            'Teste 42',
            'Teste 41',
            'Teste 40',
            'Teste 4',
            'Teste 39',
            'Teste 38',
            'Teste 37',
          ]));
      });
    });

    describe('Quando a função "salvar" é invocada', () => {
      let event: AlunoEvent;
      let aluno: Aluno;

      describe('Informando um novo aluno (id = null)', () => {
        beforeEach(async () => {
          const eventPromise = events$.pipe(take(1)).toPromise();
          aluno = new Aluno(
            null,
            'Teste X',
            'testex@totvs.com.br',
            '51346550069',
            FormaIngresso.ENADE
          );
          await service.salvar(aluno).pipe(take(1)).toPromise();
          event = await eventPromise;
        });

        it('O array de mock possui 51 elemento', () =>
          expect(mockValues.values.length).toEqual(51));
        it('O campo id foi preenchido automaticamente com o valor "uuid51"', () =>
          expect(aluno.id).toEqual('uuid51'));
        it('O campo matrícula foi preenchido automaticamente com o valor 51', () =>
          expect(aluno.matricula).toEqual(51));
        it('Existe um objeto no indice 50 que é a representação JSON do aluno', () =>
          expect(mockValues.values[50]).toEqual({
            id: 'uuid51',
            nome: 'Teste X',
            email: 'testex@totvs.com.br',
            cpf: '51346550069',
            formaIngresso: 'ENADE',
            matricula: 51,
          }));
        it('Um evento de persistencia foi emitido', () =>
          expect(event).toBeDefined());
        it('Um evento de persistencia que foi emitido possui origem "cadastrado"', () =>
          expect(event.type).toEqual('cadastrado'));
      });

      describe('Informando um aluno existente (id = "uuid1")', () => {
        beforeEach(async () => {
          const eventPromise = events$.pipe(take(1)).toPromise();
          aluno = new Aluno(
            'uuid1',
            'Teste X',
            'testex@totvs.com.br',
            '51346550069',
            FormaIngresso.ENADE,
            51
          );
          await service.salvar(aluno).pipe(take(1)).toPromise();
          event = await eventPromise;
        });

        it('O array de mock possui 50 elemento', () =>
          expect(mockValues.values.length).toEqual(50));
        it('O campo id foi preenchido automaticamente com o valor "uuid1"', () =>
          expect(aluno.id).toEqual('uuid1'));
        it('O campo matrícula foi preenchido automaticamente com o valor 51', () =>
          expect(aluno.matricula).toEqual(51));
        it('Existe um objeto no indice 0 que é a representação JSON do aluno', () =>
          expect(mockValues.values[0]).toEqual({
            id: 'uuid1',
            nome: 'Teste X',
            email: 'testex@totvs.com.br',
            cpf: '51346550069',
            formaIngresso: 'ENADE',
            matricula: 51,
          }));
        it('Um evento de persistencia foi emitido', () =>
          expect(event).toBeDefined());
        it('Um evento de persistencia que foi emitido possui origem "atualizado"', () =>
          expect(event.type).toEqual('atualizado'));
      });
    });
  });
});
