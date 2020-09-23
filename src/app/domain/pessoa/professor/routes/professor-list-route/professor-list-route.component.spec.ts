import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorListRouteComponent } from './professor-list-route.component';
import { take, skip } from 'rxjs/operators';
import { PageState, Sort } from 'app/shared/util/service.util';
import { Professor, ProfessorSortFields } from '../../professor';
import { ProfessorModule } from '../../professor.module';
import { ProfessorListModule } from '../../professor-list/professor-list.module';
import { CommonModule } from '@angular/common';
import { PoPageModule } from '@po-ui/ng-components';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'environments/environment';
import { professoresMock } from '../../professor.mock';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

environment.delaySimulado = null;

describe('ProfessorListRouteComponent', () => {
  let component: ProfessorListRouteComponent;
  let fixture: ComponentFixture<ProfessorListRouteComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ProfessorModule,
        ProfessorListModule,
        PoPageModule,
        RouterTestingModule,
      ],
      declarations: [ProfessorListRouteComponent],
    }).compileComponents();
    httpClient = TestBed.inject(HttpClient);
  });

  let pageState: PageState<Professor, ProfessorSortFields>;
  let httpClientSpy: jasmine.Spy;
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorListRouteComponent);
    component = fixture.componentInstance;
    httpClientSpy = spyOn(httpClient, 'get');
    httpClientSpy.and.returnValue(
      of({
        items: professoresMock.slice(0, 20),
        hasNext: true,
      })
    );
  });

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

    it('O array do estado "items" contém os 20 primeiros professores', () =>
      expect(pageState.items).toEqual(
        professoresMock.slice(0, 20).map(Professor.fromJson)
      ));
    it('O estado "loading" é false', () =>
      expect(pageState.loading).toBeFalse());
    it('O estado "hasNext" é true', () => expect(pageState.hasNext).toBeTrue());
    it('O estado "sort" é undefined', () =>
      expect(pageState.sort).toBeUndefined());

    describe('Quando a função "handleCarregarMais" é invocada', () => {
      beforeEach(() => {
        httpClientSpy.and.returnValue(
          of({
            items: professoresMock.slice(20, 40),
            hasNext: true,
          })
        );
      });

      describe('Quando os dados da próxima página começam a ser carregados', () => {
        beforeEach(async () => {
          const promise = component.pageState$
            .pipe(skip(1), take(1))
            .toPromise();
          component.handleCarregarMais();
          pageState = await promise;
        });

        it('O array do estado "items" contém os 20 primeiros professores', () =>
          expect(pageState.items).toEqual(
            professoresMock.slice(0, 20).map(Professor.fromJson)
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

        it('O array do estado "items" contém os 40 primeiros professores', () =>
          expect(pageState.items).toEqual(
            professoresMock.slice(0, 40).map(Professor.fromJson)
          ));
        it('O estado "loading" é false', () =>
          expect(pageState.loading).toBeFalse());
        it('O estado "hasNext" é true', () =>
          expect(pageState.hasNext).toBeTrue());
        it('O estado "sort" é undefined', () =>
          expect(pageState.sort).toBeUndefined());
      });
    });

    describe('Quando a função "handleOrdenacaoChange" é invocada para ordenar a coluna "nome" em ordem decrescente', () => {
      const sort = new Sort<ProfessorSortFields>('nome', 'desc');
      let values: any[];

      beforeEach(() => {
        values = [...professoresMock]
          .sort((a, b) => (b.nome < a.nome ? -1 : 1))
          .slice(0, 20);
        httpClientSpy.and.returnValue(
          of({
            items: values,
            hasNext: true,
          })
        );
      });

      describe('Quando os dados ordenados começam a ser carregados', () => {
        beforeEach(async () => {
          const promise = component.pageState$
            .pipe(skip(1), take(1))
            .toPromise();
          component.handleOrdenacaoChange(sort);
          pageState = await promise;
        });

        it('O array do estado "items" contém os 20 primeiros professores', () =>
          expect(pageState.items).toEqual(
            professoresMock.slice(0, 20).map(Professor.fromJson)
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

        it('O array do estado "items" contém os 20 últimos professores', () =>
          expect(pageState.items).toEqual(values.map(Professor.fromJson)));
        it('O estado "loading" é false', () =>
          expect(pageState.loading).toBeFalse());
        it('O estado "hasNext" é true', () =>
          expect(pageState.hasNext).toBeTrue());
        it('O estado "sort" é igual ao valor "sort" informado', () =>
          expect(pageState.sort).toEqual(sort));
      });
    });

    describe('Quando a função "handleFilterChange" é invocada para filtrar os professores pelo nome "Professor 200"', () => {
      beforeEach(() => {
        httpClientSpy.and.returnValue(
          of({
            items: [professoresMock[199]],
            hasNext: false,
          })
        );
      });

      describe('Quando os dados ordenados começam a ser carregados', () => {
        beforeEach(async () => {
          const promise = component.pageState$
            .pipe(skip(1), take(1))
            .toPromise();
          component.handleFilterChange('Professor 200');
          pageState = await promise;
        });

        it('O array do estado "items" contém os 20 primeiros professores', () =>
          expect(pageState.items).toEqual(
            professoresMock.slice(0, 20).map(Professor.fromJson)
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
          component.handleFilterChange('Professor 200');
          pageState = await component.pageState$.pipe(take(1)).toPromise();
        });

        it('O array do estado "items" contém um registro com o nome "Professor 200"', () =>
          expect(pageState.items).toEqual([
            Professor.fromJson(professoresMock[199]),
          ]));
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
