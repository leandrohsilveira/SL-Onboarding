import { Component, ViewChild } from '@angular/core';
import { AlunoListComponent } from './aluno-list.component';
import { Aluno, FormaIngresso } from '../aluno';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { AlunoListModule } from './aluno-list.module';
import { RouterTestingModule } from '@angular/router/testing';
import alunosMock from '../alunos.mock';
import { generate as generateCpf } from '@fnando/cpf';

const ALUNOS = alunosMock.map((json) => Aluno.fromJson(json));

describe('AlunoListComponent', () => {
  @Component({
    template: `
      <app-aluno-list
        #list
        [carregando]="carregando"
        [alunos]="alunos"
        [count]="count"
        (carregarMais)="onCarregarMais()"
      ></app-aluno-list>
    `,
  })
  class HostComponent {
    @ViewChild('list')
    component: AlunoListComponent;

    carregando = false;
    alunos: Aluno[] = [];
    count = 0;

    onCarregarMais() {
      this.carregando = true;
    }
  }

  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, AlunoListModule],
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

    it('A tabela possui 6 colunas no header', () => {
      let headerThs: HTMLTableHeaderCellElement[] = fixture.nativeElement.querySelectorAll(
        'thead > tr > th'
      );
      expect(headerThs.length).toEqual(6);
    });

    describe('Com o array de alunos vazio', () => {
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

    describe('Com o array de alunos não vazio, com a mesma quantidade da propriedade "count"', () => {
      beforeEach(() => {
        host.alunos = ALUNOS;
        host.count = ALUNOS.length;
        fixture.detectChanges();
        carregarElementos();
      });

      it(`A tabela possui ALUNOS.length (mock) linhas`, () =>
        expect(bodyTrs.length).toEqual(ALUNOS.length));

      it('Possui um botão que contém o texto "Mostrar mais"', () =>
        expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

      it('O botão "Mostrar mais" está desabilitado', () =>
        expect(carregarMaisBtn.disabled).toBeTrue());

      it('O estado "podeCarregarMais" do componente é false', () =>
        expect(host.component.podeCarregarMais).toBeFalse());

      describe('Quando a propriedade count é menor que o tamanho do array de alunos', () => {
        beforeEach(() => {
          host.count = ALUNOS.length + 2;
          fixture.detectChanges();
          carregarElementos();
        });

        it('Possui um botão que contém o texto "Mostrar mais"', () =>
          expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

        it('O botão "Mostrar mais" está habilitado', () =>
          expect(carregarMaisBtn.disabled).toBeFalse());

        it('O estado "podeCarregarMais" do componente é true', () =>
          expect(host.component.podeCarregarMais).toBeTrue());

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

          describe('Quando a instancia da propriedade alunos é alterada', () => {
            beforeEach(() => {
              host.alunos = [
                ...host.alunos,
                new Aluno(
                  'uuidx',
                  'Teste X',
                  'testex@totvs.com.br',
                  generateCpf(false),
                  FormaIngresso.ENADE,
                  200
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

            it('O estado "podeCarregarMais" do componente é true', () =>
              expect(host.component.podeCarregarMais).toBeTrue());
          });
        });
      });
    });
  });
});
