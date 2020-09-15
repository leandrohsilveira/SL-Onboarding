import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlunoFormModule } from './aluno-form.module';
import { Aluno, FormaIngresso } from '../aluno';
import { AlunoFormComponent } from './aluno-form.component';
import { CommonModule } from '@angular/common';

describe('Sobre aluno-form.component.ts, AlunoFormComponent', () => {
  @Component({
    template: `
      <app-aluno-form
        #form
        [aluno]="aluno"
        (submit)="handleSubmit()"
      ></app-aluno-form>
      <span id="nome">{{ aluno.nome }}</span>
    `,
  })
  class AlunoFormTestComponent {
    @ViewChild('form')
    alunoFormComponent: AlunoFormComponent;

    aluno = new Aluno();

    submitted = false;

    handleSubmit() {
      this.submitted = true;
    }
  }

  let fixture: ComponentFixture<AlunoFormTestComponent>;
  let component: AlunoFormTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, AlunoFormModule],
      declarations: [AlunoFormTestComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AlunoFormTestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('Quando renderizado, apresenta 4 campos', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input,select');
    expect(inputs.length).toEqual(4);
  });

  describe('Quando a propriedade "aluno" inicia limpa (new Aluno())', () => {
    it('A propriedade canSubmit é false', () =>
      expect(component.alunoFormComponent.canSubmit).toBeFalse());

    describe('Quando a função submit é invocada', () => {
      it('O formulário não é submetido pois a propriedade canSubmit é false', () => {
        component.alunoFormComponent.submit();
        fixture.detectChanges();
        expect(component.submitted).toBeFalse();
      });
    });

    describe('Quando a propriedade "aluno" é modificada para uma instancia válida', () => {
      beforeEach(() => {
        component.aluno = new Aluno(
          'uuid',
          'Teste',
          'teste@totvs.com.br',
          '17475054047',
          FormaIngresso.ENADE,
          56
        );
        fixture.detectChanges();
      });

      it('A propriedade canSubmit é true', () =>
        expect(component.alunoFormComponent.canSubmit).toBeTrue());

      describe('Quando a função submit é invocada', () => {
        it('O formulário é submetido', () => {
          component.alunoFormComponent.submit();
          fixture.detectChanges();
          expect(component.submitted).toBeTrue();
        });
      });
    });

    describe('Quando um campo do formulário é modificado', () => {
      let ngOnChangesSpy: jasmine.Spy;

      beforeEach(() => {
        ngOnChangesSpy = spyOn(component.alunoFormComponent, 'ngOnChanges');
        component.alunoFormComponent.form.patchValue({ nome: 'Teste' });
        fixture.detectChanges();
      });

      it('Como a mesma instância de aluno é mantida, a função ngOnChanges não é invocada', () => {
        expect(ngOnChangesSpy.calls.count()).toEqual(0);
      });

      it('O componente que aplicou o property binding é atualizado', () => {
        const span: HTMLSpanElement = fixture.nativeElement.querySelector(
          'span#nome'
        );
        expect(span.innerText).toEqual('Teste');
      });
    });
  });
});
