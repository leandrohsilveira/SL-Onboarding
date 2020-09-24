import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { DisciplinaListComponent } from './disciplina-list.component';
import { Disciplina } from '../disciplina';
import { DisciplinaListModule } from './disciplina-list.module';
import professoresMock from 'backend/domain/pessoa/professor/professor.mock.json';
import disciplinasMock from 'backend/domain/disciplina/disciplina.mock.json';
import { Professor } from 'app/domain/pessoa/professor/professor';

const DISCIPLINAS = disciplinasMock
  .slice(0, 15)
  .map(({ professorRef, ...data }) =>
    Disciplina.fromJson({
      ...data,
      professor: Professor.fromJson(
        professoresMock.find(({ id }) => id === professorRef)
      ),
    })
  );

describe('DisciplinaListComponent', () => {
  @Component({
    template: `
      <app-disciplina-list
        #list
        [carregando]="carregando"
        [disciplinas]="disciplinas"
        [podeCarregarMais]="podeCarregarMais"
        (carregarMais)="onCarregarMais()"
      ></app-disciplina-list>
    `,
  })
  class HostComponent {
    @ViewChild('list')
    component: DisciplinaListComponent;

    carregando = false;
    disciplinas: Disciplina[] = [];
    podeCarregarMais = false;

    onCarregarMais(): void {
      this.carregando = true;
    }
  }

  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, DisciplinaListModule],
      declarations: [HostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    host = fixture.componentInstance;
  });

  describe('Quando renderizado', () => {
    let bodyTrs: HTMLTableRowElement[];
    let carregarMaisBtn: HTMLButtonElement;

    function carregarElementos(): void {
      bodyTrs = fixture.nativeElement.querySelectorAll('tbody > tr');
      carregarMaisBtn = fixture.nativeElement.querySelector(
        '.po-table-footer-show-more button'
      );
    }

    it('A tabela possui 5 colunas no header', () => {
      const headerThs: HTMLTableHeaderCellElement[] = fixture.nativeElement.querySelectorAll(
        'thead > tr > th'
      );
      expect(headerThs.length).toEqual(5);
    });

    describe('Quando a propriedade carregandoMais é false', () => {
      describe('Quando a função do componente "carregarMais" é invocada', () => {
        let onCarregarMaisSpy: jasmine.Spy;
        beforeEach(() => {
          onCarregarMaisSpy = spyOn(host, 'onCarregarMais');
          host.component.handleCarregarMais();
          fixture.detectChanges(true);
        });

        it('O estado "carregandoMais" do componente permanece false', () =>
          expect(host.component.carregandoMais).toBeFalse());

        it('A função "onCarregarMais" do host não é invocada', () =>
          expect(onCarregarMaisSpy).not.toHaveBeenCalled());
      });

      describe('Com o array de disciplinas vazio', () => {
        beforeEach(() => carregarElementos());

        it('A tabela possui apenas uma linha', () =>
          expect(bodyTrs.length).toEqual(1));

        it('A primeira linha contém o texto "Nenhum dado encontrado"', () =>
          expect(bodyTrs[0].textContent).toMatch('Nenhum dado encontrado'));

        it('Possui um botão que contém o texto "Mostrar mais"', () =>
          expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

        it('O botão "Mostrar mais" está desabilitado', () =>
          expect(carregarMaisBtn.disabled).toBeTrue());
      });

      describe('Com o array de disciplinas não vazio', () => {
        beforeEach(() => {
          host.disciplinas = DISCIPLINAS;
          fixture.detectChanges();
          carregarElementos();
        });

        it(`A tabela possui DISCIPLINAS.length (mock) linhas`, () =>
          expect(bodyTrs.length).toEqual(DISCIPLINAS.length));

        it('Possui um botão que contém o texto "Mostrar mais"', () =>
          expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

        it('O botão "Mostrar mais" está desabilitado', () =>
          expect(carregarMaisBtn.disabled).toBeTrue());

        it('O valor da terceira coluna contém o nome do professor da disciplina', () =>
          expect(bodyTrs[0].children[2].textContent).toContain(
            DISCIPLINAS[0].professor.nome
          ));

        describe('Quando a carga horária da disciplina é 1', () => {
          beforeEach(() => {
            host.disciplinas = [
              new Disciplina(
                'uuidx',
                'Disciplina X',
                'DSPLXXXXXX',
                1,
                Professor.fromJson(professoresMock[0])
              ),
            ];
            fixture.detectChanges();
            carregarElementos();
          });

          it('O valor da quarta coluna contém o texto "Uma hora"', () =>
            expect(bodyTrs[0].children[3].textContent).toContain('Uma hora'));
        });

        describe('Quando a carga horária da disciplina é 10', () => {
          beforeEach(() => {
            host.disciplinas = [
              new Disciplina(
                'uuidx',
                'Disciplina X',
                'DSPLXXXXXX',
                10,
                Professor.fromJson(professoresMock[0])
              ),
            ];
            fixture.detectChanges();
            carregarElementos();
          });

          it('O valor da quarta coluna contém o texto "10 horas"', () =>
            expect(bodyTrs[0].children[3].textContent).toContain('10 horas'));
        });

        describe('Quando a carga horária da disciplina é 0', () => {
          beforeEach(() => {
            host.disciplinas = [
              new Disciplina(
                'uuidx',
                'Disciplina X',
                'DSPLXXXXXX',
                0,
                Professor.fromJson(professoresMock[0])
              ),
            ];
            fixture.detectChanges();
            carregarElementos();
          });

          it('O valor da quarta coluna contém o texto "Sem carga horária definida"', () =>
            expect(bodyTrs[0].children[3].textContent).toContain(
              'Sem carga horária definida'
            ));
        });

        describe('Quando a propriedade podeCarregarMais é true', () => {
          beforeEach(() => {
            host.podeCarregarMais = true;
            fixture.detectChanges();
            carregarElementos();
          });

          it('Possui um botão que contém o texto "Mostrar mais"', () =>
            expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

          it('O botão "Mostrar mais" está habilitado', () =>
            expect(carregarMaisBtn.disabled).toBeFalse());

          describe('Quando a função do componente "carregarMais" é invocada', () => {
            beforeEach(() => {
              host.component.handleCarregarMais();
              fixture.detectChanges();
              carregarElementos();
            });

            it('Possui um botão que contém o texto "Mostrar mais"', () =>
              expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

            it('O botão "Mostrar mais" está desabilitado', () =>
              expect(carregarMaisBtn.disabled).toBeTrue());

            it('O estado "carregandoMais" do componente é true', () =>
              expect(host.component.carregandoMais).toBeTrue());

            describe('Quando a instancia da propriedade disciplinas é alterada', () => {
              beforeEach(() => {
                host.disciplinas = [
                  ...host.disciplinas,
                  new Disciplina(
                    'uuidx',
                    'Disciplina X',
                    'DSPLXXXXXX',
                    80,
                    Professor.fromJson(professoresMock[0])
                  ),
                ];
                host.carregando = false;
                fixture.detectChanges();
                carregarElementos();
              });

              it('Possui um botão que contém o texto "Mostrar mais"', () =>
                expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

              it('O botão "Mostrar mais" está habilitado', () =>
                expect(carregarMaisBtn.disabled).toBeFalse());

              it('O estado "carregandoMais" do componente é false', () =>
                expect(host.component.carregandoMais).toBeFalse());
            });
          });
        });
      });
    });
  });
});
