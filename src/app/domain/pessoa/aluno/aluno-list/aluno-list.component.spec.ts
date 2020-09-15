import { Component, ViewChild } from '@angular/core';
import { AlunoListComponent } from './aluno-list.component';
import { Aluno } from '../aluno';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { AlunoListModule } from './aluno-list.module';
import { RouterTestingModule } from '@angular/router/testing';
import alunosMock from '../alunos.mock';

const ALUNOS = alunosMock.map((json) => Aluno.fromJson(json));

describe('AlunoListComponent', () => {
  @Component({
    template: `
      <app-aluno-list #list [alunos]="alunos" [count]="count"></app-aluno-list>
    `,
  })
  class AlunoListTestComponent {
    @ViewChild('list')
    component: AlunoListComponent;

    alunos: Aluno[] = [];
    count = 0;
  }

  let fixture: ComponentFixture<AlunoListTestComponent>;
  let component: AlunoListTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, AlunoListModule],
      declarations: [AlunoListTestComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AlunoListTestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
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

    describe(`Com o array de alunos com ${ALUNOS.length} elementos`, () => {
      beforeEach(() => {
        component.alunos = ALUNOS;
        component.count = ALUNOS.length;
        fixture.detectChanges();
        carregarElementos();
      });

      it(`A tabela possui ${ALUNOS.length} linhas`, () =>
        expect(bodyTrs.length).toEqual(ALUNOS.length));

      it('Possui um botão que contém o texto "Mostrar mais"', () =>
        expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

      it('O botão "Mostrar mais" está desabilitado', () =>
        expect(carregarMaisBtn.disabled).toBeTrue());

      describe('Quando a propriedade count é menor que o tamanho do array de alunos', () => {
        beforeEach(() => {
          component.count = ALUNOS.length + 10;
          fixture.detectChanges();
          carregarElementos();
        });

        it('Possui um botão que contém o texto "Mostrar mais"', () =>
          expect(carregarMaisBtn.textContent).toMatch('Mostrar mais'));

        it('O botão "Mostrar mais" está habilitado', () =>
          expect(carregarMaisBtn.disabled).toBeFalse());
      });
    });
  });
});
