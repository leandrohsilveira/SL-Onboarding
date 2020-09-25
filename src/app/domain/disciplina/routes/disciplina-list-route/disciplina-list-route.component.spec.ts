import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinaListRouteComponent } from './disciplina-list-route.component';
import { take, skip } from 'rxjs/operators';
import { PageState, Sort } from 'app/shared/util/service.util';
import {
  Disciplina,
  DisciplinaSortFields,
  DisciplinaJson,
} from '../../disciplina';
import { DisciplinaModule } from '../../disciplina.module';
import { DisciplinaListModule } from '../../disciplina-list/disciplina-list.module';
import { CommonModule } from '@angular/common';
import { PoPageModule } from '@po-ui/ng-components';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'environments/environment';
import disciplinasMock from 'backend/domain/disciplina/disciplina.mock.json';
import professoresMock from 'backend/domain/pessoa/professor/professor.mock.json';
import {
  insertInitialData,
  clearData,
} from 'backend/domain/disciplina/disciplina.data';
import {
  insertInitialData as insertProfessoresInitialData,
  clearData as clearProfessorData,
} from 'backend/domain/pessoa/professor/professor.data';
import { ProfessorJson } from 'app/domain/pessoa/professor/professor';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';

environment.delaySimulado = null;

describe('DisciplinaListRouteComponent', () => {
  let component: DisciplinaListRouteComponent;
  let fixture: ComponentFixture<DisciplinaListRouteComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserTestingModule,
        HttpClientTestingModule,
        DisciplinaModule,
        DisciplinaListModule,
        PoPageModule,
        RouterTestingModule,
      ],
      declarations: [DisciplinaListRouteComponent],
    }).compileComponents();
  });

  let pageState: PageState<Disciplina, DisciplinaSortFields>;
  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplinaListRouteComponent);
    component = fixture.componentInstance;
  });

  let disciplinas: DisciplinaJson[];
  let professores: ProfessorJson[];
  beforeEach(async () => {
    disciplinas = await insertInitialData(disciplinasMock);
    professores = await insertProfessoresInitialData(
      professoresMock.filter(
        (prof) => !!disciplinas.find((dis) => dis.professorRef === prof.id)
      )
    );
  });

  function fromDisciplinaJson({
    professorRef,
    ...disciplina
  }: DisciplinaJson): Disciplina {
    return Disciplina.fromJson({
      ...disciplina,
      professor: professores.find(({ id }) => id === professorRef),
    });
  }

  afterEach(() => Promise.all([clearData(), clearProfessorData()]));

  it('É criado com sucesso', () => expect(component).toBeTruthy());

  describe('Quando dados iniciais começam a ser carregados', async () => {
    beforeEach(async () => {
      const promise = component.pageState$.pipe(skip(1), take(1)).toPromise();
      fixture.detectChanges();
      pageState = await promise;
    });

    it('O array do estado "items" é vazio', () =>
      expect(pageState.items.length).toBe(0));
    it('O estado "loading" é true', () => expect(pageState.loading).toBeTrue());
    it('O estado "hasNext" é false', () =>
      expect(pageState.hasNext).toBeFalse());
    it('O estado "sort" é undefined', () =>
      expect(pageState.sort).toBeUndefined());
  });

  describe('Quando os dados iniciais foram carregados', async () => {
    beforeEach(async () => {
      fixture.detectChanges();
      pageState = await component.pageState$.pipe(take(1)).toPromise();
    });

    it('O array do estado "items" contém as 20 primeiras disciplinas', () =>
      expect(pageState.items).toEqual(
        disciplinas.slice(0, 20).map(fromDisciplinaJson)
      ));
    it('O estado "loading" é false', () =>
      expect(pageState.loading).toBeFalse());
    it('O estado "hasNext" é true', () => expect(pageState.hasNext).toBeTrue());
    it('O estado "sort" é undefined', () =>
      expect(pageState.sort).toBeUndefined());

    describe('Quando a função "handleCarregarMais" é invocada', () => {
      describe('Quando os dados da próxima página começam a ser carregados', () => {
        beforeEach(async () => {
          const promise = component.pageState$
            .pipe(skip(1), take(1))
            .toPromise();
          component.handleCarregarMais();
          pageState = await promise;
        });

        it('O array do estado "items" contém as 20 primeiras disciplinas', () =>
          expect(pageState.items).toEqual(
            disciplinas.slice(0, 20).map(fromDisciplinaJson)
          ));
        it('O estado "loading" é true', () =>
          expect(pageState.loading).toBeTrue());
        it('O estado "hasNext" é true', () =>
          expect(pageState.hasNext).toBeTrue());
        it('O estado "sort" é undefined', () =>
          expect(pageState.sort).toBeUndefined());
      });

      describe('Quando os dados da próxima página foram carregados', () => {
        beforeEach(async () => {
          component.handleCarregarMais();
          pageState = await component.pageState$.pipe(take(1)).toPromise();
        });

        it('O array do estado "items" contém as 40 primeiras disciplinas', () =>
          expect(pageState.items).toEqual(
            disciplinas.slice(0, 40).map(fromDisciplinaJson)
          ));
        it('O estado "loading" é false', () =>
          expect(pageState.loading).toBeFalse());
        it('O estado "hasNext" é true', () =>
          expect(pageState.hasNext).toBeTrue());
        it('O estado "sort" é undefined', () =>
          expect(pageState.sort).toBeUndefined());
      });
    });

    describe('Quando a função "handleOrdenacaoChange" é invocada para ordenar a coluna "descricao" em ordem decrescente', () => {
      const sort = new Sort<DisciplinaSortFields>('descricao', 'desc');
      let values: any[];

      beforeEach(() => {
        values = [...disciplinas]
          .sort((a, b) => (b.descricao > a.descricao ? 1 : -1))
          .slice(0, 20);
      });

      describe('Quando os dados ordenados começam a ser carregados', () => {
        beforeEach(async () => {
          const promise = component.pageState$
            .pipe(skip(1), take(1))
            .toPromise();
          component.handleOrdenacaoChange(sort);
          pageState = await promise;
        });

        it('O array do estado "items" contém as 20 primeiras disciplinas', () =>
          expect(pageState.items).toEqual(
            disciplinas.slice(0, 20).map(fromDisciplinaJson)
          ));
        it('O estado "loading" é true', () =>
          expect(pageState.loading).toBeTrue());
        it('O estado "hasNext" é true', () =>
          expect(pageState.hasNext).toBeTrue());
        it('O estado "sort" é igual ao valor "sort" informado', () =>
          expect(pageState.sort).toEqual(sort));
      });

      describe('Quando os dados ordenados foram carregados', () => {
        beforeEach(async () => {
          component.handleOrdenacaoChange(sort);
          pageState = await component.pageState$.pipe(take(1)).toPromise();
        });

        it('O array do estado "items" contém as 20 últimos disciplinas', () =>
          expect(pageState.items).toEqual(values.map(fromDisciplinaJson)));
        it('O estado "loading" é false', () =>
          expect(pageState.loading).toBeFalse());
        it('O estado "hasNext" é true', () =>
          expect(pageState.hasNext).toBeTrue());
        it('O estado "sort" é igual ao valor "sort" informado', () =>
          expect(pageState.sort).toEqual(sort));
      });
    });

    describe('Quando a função "handleFilterChange" é invocada para filtrar as disciplinas pela descrição "Disciplina 50"', () => {
      describe('Quando os dados ordenados começam a ser carregados', () => {
        beforeEach(async () => {
          const promise = component.pageState$
            .pipe(skip(1), take(1))
            .toPromise();
          component.handleFilterChange('Disciplina 50');
          pageState = await promise;
        });

        it('O array do estado "items" contém as 20 primeiras disciplinas', () =>
          expect(pageState.items).toEqual(
            disciplinas.slice(0, 20).map(fromDisciplinaJson)
          ));
        it('O estado "loading" é true', () =>
          expect(pageState.loading).toBeTrue());
        it('O estado "hasNext" é true', () =>
          expect(pageState.hasNext).toBeTrue());
        it('O estado "sort" é undefined', () =>
          expect(pageState.sort).toBeUndefined());
      });

      describe('Quando os dados ordenados foram carregados', () => {
        beforeEach(async () => {
          component.handleFilterChange('Disciplina 50');
          pageState = await component.pageState$.pipe(take(1)).toPromise();
        });

        it('O array do estado "items" possui 1 registro', () =>
          expect(pageState.items.length).toEqual(1));
        it('A descrição do primeiro registro é "Disciplina 50"', () =>
          expect(pageState.items[0].descricao).toEqual('Disciplina 50'));
        it('O estado "loading" é false', () =>
          expect(pageState.loading).toBeFalse());
        it('O estado "hasNext" é false', () =>
          expect(pageState.hasNext).toBeFalse());
        it('O estado "sort" é undefined', () =>
          expect(pageState.sort).toBeUndefined());
      });
    });
  });
});
