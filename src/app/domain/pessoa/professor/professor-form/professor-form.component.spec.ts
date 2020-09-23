import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProfessorFormModule } from './professor-form.module';
import { Professor, Titulacao } from '../professor';
import { ProfessorFormComponent } from './professor-form.component';
import { CommonModule } from '@angular/common';

describe('ProfessorFormComponent', () => {
  @Component({
    template: `
      <app-professor-form
        #form
        [professor]="professor"
        (onSubmit)="handleSubmit()"
      ></app-professor-form>
      <span id="nome">{{ professor.nome }}</span>
    `,
  })
  class TestHostComponent {
    @ViewChild('form')
    professorFormComponent: ProfessorFormComponent;

    professor = new Professor();

    submitted = false;

    handleSubmit() {
      this.submitted = true;
    }
  }

  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ProfessorFormModule],
      declarations: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('Quando renderizado, apresenta 4 campos', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input,select');
    expect(inputs.length).toEqual(4);
  });

  describe('Quando a propriedade "professor" inicia limpa (new Professor())', () => {
    it('A propriedade canSubmit é false', () =>
      expect(component.professorFormComponent.canSubmit).toBeFalse());

    describe('Quando a função handleSubmit é invocada', () => {
      it('O formulário não é submetido pois a propriedade canSubmit é false', () => {
        component.professorFormComponent.handleSubmit();
        fixture.detectChanges();
        expect(component.submitted).toBeFalse();
      });
    });

    describe('Quando a propriedade "professor" é modificada para uma instancia válida', () => {
      beforeEach(() => {
        component.professor = new Professor(
          'uuid',
          'Teste',
          'teste@totvs.com.br',
          '17475054047',
          Titulacao.MESTRE
        );
        fixture.detectChanges();
      });

      it('A propriedade canSubmit ainda é false pois o formulário ainda é "pristine"', () =>
        expect(component.professorFormComponent.canSubmit).toBeFalse());

      describe('Quando a função handleSubmit é invocada', () => {
        it('O formulário não é submetido pois a propriedade canSubmit é false', () => {
          component.professorFormComponent.handleSubmit();
          fixture.detectChanges();
          expect(component.submitted).toBeFalse();
        });
      });

      describe('Quando um campo do formulário é modificado', () => {
        beforeEach(() => {
          component.professorFormComponent.form.patchValue({ nome: 'Teste 1' });
          component.professorFormComponent.form.markAsDirty();
          fixture.detectChanges();
        });

        it('A propriedade canSubmit é true pois o formulário é válido e dirty', () =>
          expect(component.professorFormComponent.canSubmit).toBeTrue());

        describe('Quando a função handleSubmit é invocada', () => {
          it('O formulário é submetido', () => {
            component.professorFormComponent.handleSubmit();
            fixture.detectChanges();
            expect(component.submitted).toBeTrue();
          });
        });
      });
    });

    describe('Quando um campo do formulário é modificado', () => {
      let ngOnChangesSpy: jasmine.Spy;

      beforeEach(() => {
        ngOnChangesSpy = spyOn(component.professorFormComponent, 'ngOnChanges');
        component.professorFormComponent.form.patchValue({ nome: 'Teste' });
        fixture.detectChanges();
      });

      it('Como a mesma instância de professor é mantida, a função ngOnChanges não é invocada', () => {
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
