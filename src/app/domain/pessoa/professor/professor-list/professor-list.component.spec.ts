import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { generate as generateCpf } from '@fnando/cpf';

import { ProfessorListComponent } from './professor-list.component';
import { Professor, Titulacao } from '../professor';
import { ProfessorListModule } from './professor-list.module';
import { professoresMock } from '../professor.mock';

const PROFESSORES = professoresMock
  .slice(0, 15)
  .map((json) => Professor.fromJson(json));

describe('ProfessorListComponent', () => {
  @Component({
    template: `
      <app-professor-list
        #list
        [carregando]="carregando"
        [professores]="professores"
        [podeCarregarMais]="podeCarregarMais"
        (carregarMais)="onCarregarMais()"
      ></app-professor-list>
    `,
  })
  class HostComponent {
    @ViewChild('list')
    component: ProfessorListComponent;

    carregando = false;
    professores: Professor[] = [];
    podeCarregarMais = false;

    onCarregarMais() {
      this.carregando = true;
    }
  }

  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, ProfessorListModule],
      declarations: [HostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    host = fixture.componentInstance;
  });

  describe('Quando renderizado', () => {
    let bodyTrs: HTMLTableRowElement[];
    let carregarMaisBtn: HTMLButtonElement;

    function carregarElementos() {
      bodyTrs = fixture.nativeElement.querySelectorAll('tbody > tr');
      carregarMaisBtn = fixture.nativeElement.querySelector(
        '.po-table-footer-show-more button'
      );
    }

    it('A tabela possui 5 colunas no header', () => {
      let headerThs: HTMLTableHeaderCellElement[] = fixture.nativeElement.querySelectorAll(
        'thead > tr > th'
      );
      expect(headerThs.length).toEqual(5);
    });

    describe('Quando a propriedade carregandoMais é false', () => {
      describe('Quando a função do componente "carregarMais" é invocada', () => {
        let onCarregarMaisSpy: jasmine.Spy;
        beforeEach(() => {
          onCarregarMaisSpy = spyOn(host, 'onCarregarMais');
          host.component.carregarMais();
          fixture.detectChanges(true);
        });

        it('O estado "carregandoMais" do componente permanece false', () =>
          expect(host.component.carregandoMais).toBeFalse());

        it('A função "onCarregarMais" do host não é invocada', () =>
          expect(onCarregarMaisSpy).not.toHaveBeenCalled());
      });

      describe('Com o array de professores vazio', () => {
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

      describe('Com o array de professores não vazio', () => {
        beforeEach(() => {
          host.professores = PROFESSORES;
          fixture.detectChanges();
          carregarElementos();
        });

        it(`A tabela possui PROFESSORES.length (mock) linhas`, () =>
          expect(bodyTrs.length).toEqual(PROFESSORES.length));

        it('Possui um botão que contém o texto "Mostrar mais"', () =>
          expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

        it('O botão "Mostrar mais" está desabilitado', () =>
          expect(carregarMaisBtn.disabled).toBeTrue());

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
              host.component.carregarMais();
              fixture.detectChanges();
              carregarElementos();
            });

            it('Possui um botão que contém o texto "Mostrar mais"', () =>
              expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

            it('O botão "Mostrar mais" está desabilitado', () =>
              expect(carregarMaisBtn.disabled).toBeTrue());

            it('O estado "carregandoMais" do componente é true', () =>
              expect(host.component.carregandoMais).toBeTrue());

            describe('Quando a instancia da propriedade professores é alterada', () => {
              beforeEach(() => {
                host.professores = [
                  ...host.professores,
                  new Professor(
                    'uuidx',
                    'Teste X',
                    'testex@totvs.com.br',
                    generateCpf(false),
                    Titulacao.MESTRE
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
