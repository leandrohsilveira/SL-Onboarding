import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { EventService } from 'app/shared/event/event.service';
import { AppBackendModule } from 'backend/app-backend.module';
import { Page, Pageable, Sort } from 'app/shared/util/service.util';
import disciplinasMock from 'backend/domain/disciplina/disciplina.mock.json';
import professoresMock from 'backend/domain/pessoa/professor/professor.mock.json';

import {
  Disciplina,
  DisciplinaSortFields,
  DisciplinaEvent,
  DisciplinaJson,
} from './disciplina';
import { DisciplinaService } from './disciplina.service';
import { ProfessorJson, Professor } from '../pessoa/professor/professor';
import {
  insertInitialData as insertProfessoresInitialData,
  clearData as clearProfessorData,
} from 'backend/domain/pessoa/professor/professor.data';
import {
  insertInitialData,
  clearData,
  getAll,
} from 'backend/domain/disciplina/disciplina.data';
import { CommonModule } from '@angular/common';

environment.delaySimulado = null;

describe('DisciplinaService', () => {
  let events$: Observable<DisciplinaEvent>;
  let service: DisciplinaService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, AppBackendModule.forRoot()],
      providers: [DisciplinaService],
    });
    const eventService = TestBed.inject(EventService);
    events$ = eventService.bus$.pipe(
      filter((e) => e instanceof DisciplinaEvent),
      map((e) => e as DisciplinaEvent)
    );
    service = TestBed.inject(DisciplinaService);
  });

  afterEach(async () => {
    await clearProfessorData();
    await clearData();
  });

  describe('Quando não há disciplinas cadastrados', () => {
    describe('Quando a função "filtrar" é invocada', () => {
      let result: Page<Disciplina>;
      beforeEach(async () => {
        result = await service
          .filtrar(new Pageable())
          .pipe(take(1))
          .toPromise();
      });

      it('O array de items é vazio', () =>
        expect(result.items.length).toEqual(0));
      it('A flag "hasNext" é false', () => expect(result.hasNext).toBeFalse());
    });
  });

  describe('Quando há 20 disciplinas cadastrados', () => {
    beforeEach(async () => {
      await insertProfessoresInitialData(professoresMock);
      await insertInitialData(disciplinasMock.slice(0, 20));
    });

    describe('Quando a função "filtrar" é invocada', () => {
      let result: Page<Disciplina>;
      beforeEach(async () => {
        result = await service
          .filtrar(new Pageable())
          .pipe(take(1))
          .toPromise();
      });

      it('O array de items possui 20 elementos', () =>
        expect(result.items.length).toEqual(20));
      it('A flag "hasNext" é false', () => expect(result.hasNext).toBeFalse());
    });
  });

  describe('Quando há 50 disciplinas cadastrados', () => {
    let disciplinas: DisciplinaJson[];
    let professores: ProfessorJson[];
    beforeEach(async () => {
      disciplinas = await insertInitialData(disciplinasMock.slice(0, 50));
      professores = await insertProfessoresInitialData(
        professoresMock.filter(
          (prof) => !!disciplinas.find((dis) => dis.professorRef === prof.id)
        )
      );
    });

    describe('Quando a função "filtrar" é invocada', () => {
      describe('Sem informar um filtro', () => {
        let result: Page<Disciplina>;
        beforeEach(async () => {
          result = await service
            .filtrar(new Pageable())
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 20 elementos', () =>
          expect(result.items.length).toEqual(20));
        it('A flag "hasNext" é true', () => expect(result.hasNext).toBeTrue());
        it('O array items possui as 20 primeiras disciplinas com os dados do professor preenchido', () =>
          expect(result.items).toEqual(
            disciplinas.slice(0, 20).map((disciplina) =>
              Disciplina.fromJson({
                ...disciplina,
                professor: professores.find(
                  ({ id }) => id === disciplina.professorRef
                ),
              })
            )
          ));
      });

      describe('Informando o valor "Disciplina 1" como filtro', () => {
        let result: Page<Disciplina>;
        beforeEach(async () => {
          result = await service
            .filtrar(new Pageable(), 'Disciplina 1')
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 11 elementos', () =>
          expect(result.items.length).toEqual(11));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });

      describe('Informando o valor "DISCIPLINA 1" como filtro (para filtrar descricao)', () => {
        let result: Page<Disciplina>;
        beforeEach(async () => {
          result = await service
            .filtrar(new Pageable(), 'DISCIPLINA 1')
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 11 elementos', () =>
          expect(result.items.length).toEqual(11));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });

      describe('Informando o valor "DSPL000001" como filtro (para filtrar sigla)', () => {
        let result: Page<Disciplina>;
        beforeEach(async () => {
          result = await service
            .filtrar(new Pageable(), 'DSPL000001')
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 1 elemento', () =>
          expect(result.items.length).toEqual(1));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });

      describe('Informando o valor "dspl000001" como filtro (para filtrar sigla)', () => {
        let result: Page<Disciplina>;
        beforeEach(async () => {
          result = await service
            .filtrar(new Pageable(), 'dspl000001')
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 1 elemento', () =>
          expect(result.items.length).toEqual(1));
        it('A flag "hasNext" é false', () =>
          expect(result.hasNext).toBeFalse());
      });

      describe('Informando o sort pelo descricao e asc', () => {
        let result: Page<Disciplina>;
        beforeEach(async () => {
          result = await service
            .filtrar(
              new Pageable(),
              '',
              new Sort<DisciplinaSortFields>('descricao', 'asc')
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 20 elementos', () =>
          expect(result.items.length).toEqual(20));
        it('A flag "hasNext" é true', () => expect(result.hasNext).toBeTrue());
        it('O array de items está ordenado com ordem crescente', () =>
          expect(
            result.items.map((disciplina) => disciplina.descricao)
          ).toEqual([
            'Disciplina 1',
            'Disciplina 10',
            'Disciplina 11',
            'Disciplina 12',
            'Disciplina 13',
            'Disciplina 14',
            'Disciplina 15',
            'Disciplina 16',
            'Disciplina 17',
            'Disciplina 18',
            'Disciplina 19',
            'Disciplina 2',
            'Disciplina 20',
            'Disciplina 21',
            'Disciplina 22',
            'Disciplina 23',
            'Disciplina 24',
            'Disciplina 25',
            'Disciplina 26',
            'Disciplina 27',
          ]));
      });

      describe('Informando o sort pelo descricao e desc', () => {
        let result: Page<Disciplina>;
        beforeEach(async () => {
          result = await service
            .filtrar(
              new Pageable(),
              '',
              new Sort<DisciplinaSortFields>('descricao', 'desc')
            )
            .pipe(take(1))
            .toPromise();
        });

        it('O array de items possui 20 elementos', () =>
          expect(result.items.length).toEqual(20));
        it('A flag "hasNext" é true', () => expect(result.hasNext).toBeTrue());
        it('O array de items está ordenado com ordem decrescente', () =>
          expect(
            result.items.map((disciplina) => disciplina.descricao)
          ).toEqual([
            'Disciplina 9',
            'Disciplina 8',
            'Disciplina 7',
            'Disciplina 6',
            'Disciplina 50',
            'Disciplina 5',
            'Disciplina 49',
            'Disciplina 48',
            'Disciplina 47',
            'Disciplina 46',
            'Disciplina 45',
            'Disciplina 44',
            'Disciplina 43',
            'Disciplina 42',
            'Disciplina 41',
            'Disciplina 40',
            'Disciplina 4',
            'Disciplina 39',
            'Disciplina 38',
            'Disciplina 37',
          ]));
      });
    });

    describe('Quando a função "salvar" é invocada', () => {
      let event: DisciplinaEvent;
      let disciplina: Disciplina;

      describe('Informando uma nova disciplina (id = null)', () => {
        beforeEach(async () => {
          const eventPromise = events$.pipe(take(1)).toPromise();
          disciplina = new Disciplina(
            null,
            'Disciplina X',
            'DSPLXXXXXX',
            80,
            Professor.fromJson(professores[0])
          );
          disciplina = await service
            .salvar(disciplina)
            .pipe(take(1))
            .toPromise();
          event = await eventPromise;
          disciplinas = await getAll();
        });

        it('O array de mock possui 51 elemento', () =>
          expect(disciplinas.length).toEqual(51));
        it('O campo id foi preenchido automaticamente', () =>
          expect(disciplina.id).toBeDefined());
        it('Existe um objeto com o uuid gerado que é a representação JSON da disciplina', () =>
          expect(disciplinas.find((item) => item.id === disciplina.id)).toEqual(
            {
              id: disciplina.id,
              descricao: 'Disciplina X',
              sigla: 'DSPLXXXXXX',
              cargaHoraria: 80,
              professorRef: professores[0].id,
            }
          ));
        it('Um evento de persistencia foi emitido', () =>
          expect(event).toBeDefined());
        it('Um evento de persistencia que foi emitido possui origem "cadastrado"', () =>
          expect(event.type).toEqual('cadastrado'));
      });

      describe('Informando um disciplina existente (com o id definido)', () => {
        beforeEach(async () => {
          const eventPromise = events$.pipe(take(1)).toPromise();
          disciplina = new Disciplina(
            disciplinas[0].id,
            'Disciplina X',
            'DSPLXXXXXX',
            80,
            Professor.fromJson(professores[0])
          );
          await service.salvar(disciplina).pipe(take(1)).toPromise();
          event = await eventPromise;
          disciplinas = await getAll();
        });

        it('O array de mock possui 50 elemento', () =>
          expect(disciplinas.length).toEqual(50));
        it('O campo id não foi alterado', () =>
          expect(disciplina.id).toEqual(disciplinas[0].id));
        it('Existe um objeto no indice 0 que é a representação JSON da disciplina', () =>
          expect(disciplinas.find((item) => item.id === disciplina.id)).toEqual(
            {
              id: disciplina.id,
              descricao: 'Disciplina X',
              sigla: 'DSPLXXXXXX',
              cargaHoraria: 80,
              professorRef: professores[0].id,
            }
          ));
        it('Um evento de persistencia foi emitido', () =>
          expect(event).toBeDefined());
        it('Um evento de persistencia que foi emitido possui origem "atualizado"', () =>
          expect(event.type).toEqual('atualizado'));
      });
    });

    describe('Quando a função "recuperarPorId" é invocada', () => {
      describe('Quando informado o id da primeira disciplina cadastrada', () => {
        let disciplina: Disciplina;
        beforeEach(
          async () =>
            (disciplina = await service
              .recuperarPorId(disciplinas[0].id)
              .pipe(take(1))
              .toPromise())
        );

        it('É retornado um objeto', () => expect(disciplina).toBeDefined());
        it('O objeto retornado possui a instância de professor', () =>
          expect(disciplina.professor).toBeDefined());
        it('O objeto retornado é igual à primeira disciplina cadastrada', () =>
          expect(disciplina).toEqual(
            Disciplina.fromJson({
              ...disciplinas[0],
              professor: professores.find(
                ({ id }) => id === disciplinas[0].professorRef
              ),
            })
          ));
      });
    });
  });
});
