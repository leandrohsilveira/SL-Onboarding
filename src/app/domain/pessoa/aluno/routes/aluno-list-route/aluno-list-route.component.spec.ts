/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoListRouteComponent } from './aluno-list-route.component';
import { take, skip } from 'rxjs/operators';
import { PageState, Sort } from 'app/shared/util/service.util';
import { Aluno, AlunoSortFields } from '../../aluno';
import { AlunoModule } from '../../aluno.module';
import { AlunoListModule } from '../../aluno-list/aluno-list.module';
import { CommonModule } from '@angular/common';
import { PoPageModule } from '@po-ui/ng-components';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'environments/environment';
import alunosMock from '../../aluno.mock';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

environment.delaySimulado = null;

describe('AlunoListRouteComponent', () => {
  let component: AlunoListRouteComponent;
  let fixture: ComponentFixture<AlunoListRouteComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        AlunoModule,
        AlunoListModule,
        PoPageModule,
        RouterTestingModule,
      ],
      declarations: [AlunoListRouteComponent],
    }).compileComponents();
    httpClient = TestBed.inject(HttpClient);
  });

  let pageState: PageState<Aluno, AlunoSortFields>;
  let httpClientSpy: jasmine.Spy;
  beforeEach(() => {
    fixture = TestBed.createComponent(AlunoListRouteComponent);
    component = fixture.componentInstance;
    httpClientSpy = spyOn(httpClient, 'get');
    httpClientSpy.and.returnValue(
      of({
        items: alunosMock.slice(0, 20),
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

    it('O array do estado "items" contém os 20 primeiros alunos', () =>
      expect(pageState.items).toEqual(
        alunosMock.slice(0, 20).map(Aluno.fromJson)
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
            items: alunosMock.slice(20, 40),
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

        it('O array do estado "items" contém os 20 primeiros alunos', () =>
          expect(pageState.items).toEqual(
            alunosMock.slice(0, 20).map(Aluno.fromJson)
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

        it('O array do estado "items" contém os 40 primeiros alunos', () =>
          expect(pageState.items).toEqual(
            alunosMock.slice(0, 40).map(Aluno.fromJson)
          ));
        it('O estado "loading" é false', () =>
          expect(pageState.loading).toBeFalse());
        it('O estado "hasNext" é true', () =>
          expect(pageState.hasNext).toBeTrue());
        it('O estado "sort" é undefined', () =>
          expect(pageState.sort).toBeUndefined());
      });
    });

    describe('Quando a função "handleOrdenacaoChange" é invocada para ordenar a coluna "matricula" em ordem decrescente', () => {
      const sort = new Sort<AlunoSortFields>('matricula', 'desc');
      let values: any[];

      beforeEach(() => {
        values = [...alunosMock]
          .sort((a, b) => b.matricula - a.matricula)
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

        it('O array do estado "items" contém os 20 primeiros alunos', () =>
          expect(pageState.items).toEqual(
            alunosMock.slice(0, 20).map(Aluno.fromJson)
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

        it('O array do estado "items" contém os 20 últimos alunos', () =>
          expect(pageState.items).toEqual(values.map(Aluno.fromJson)));
        it('O estado "loading" é false', () =>
          expect(pageState.loading).toBeFalse());
        it('O estado "hasNext" é true', () =>
          expect(pageState.hasNext).toBeTrue());
        it('O estado "sort" é igual ao valor "sort" informado', () =>
          expect(pageState.sort).toEqual(sort));
      });
    });

    describe('Quando a função "handleFilterChange" é invocada para filtrar os alunos pelo nome "Teste 200"', () => {
      beforeEach(() => {
        httpClientSpy.and.returnValue(
          of({
            items: [alunosMock[199]],
            hasNext: false,
          })
        );
      });

      describe('Quando os dados ordenados começam a ser carregados', () => {
        beforeEach(async () => {
          const promise = component.pageState$
            .pipe(skip(1), take(1))
            .toPromise();
          component.handleFilterChange('Teste 200');
          pageState = await promise;
        });

        it('O array do estado "items" contém os 20 primeiros alunos', () =>
          expect(pageState.items).toEqual(
            alunosMock.slice(0, 20).map(Aluno.fromJson)
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
          component.handleFilterChange('Teste 200');
          pageState = await component.pageState$.pipe(take(1)).toPromise();
        });

        it('O array do estado "items" contém um registro com o nome "Teste 200"', () =>
          expect(pageState.items).toEqual([Aluno.fromJson(alunosMock[199])]));
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
