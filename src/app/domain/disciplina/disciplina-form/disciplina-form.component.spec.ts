import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DisciplinaFormModule } from './disciplina-form.module';
import { Disciplina } from '../disciplina';
import { DisciplinaFormComponent } from './disciplina-form.component';
import { CommonModule } from '@angular/common';
import { Professor } from 'app/domain/pessoa/professor/professor';
import { professoresMock } from 'app/domain/pessoa/professor/professor.mock';

describe('DisciplinaFormComponent', () => {
  @Component({
    template: `
      <app-disciplina-form
        #form
        [disciplina]="disciplina"
        (formSubmit)="handleSubmit()"
      ></app-disciplina-form>
      <span id="descricao">{{ disciplina.descricao }}</span>
    `,
  })
  class TestHostComponent {
    @ViewChild('form')
    disciplinaFormComponent: DisciplinaFormComponent;

    disciplina = new Disciplina();

    submitted = false;

    handleSubmit(): void {
      this.submitted = true;
    }
  }

  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, DisciplinaFormModule],
      declarations: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('Quando renderizado, apresenta 3 campos', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input,select');
    expect(inputs.length).toEqual(3);
  });

  describe('Quando a propriedade "disciplina" inicia limpa (new Disciplina())', () => {
    it('A propriedade canSubmit é false', () =>
      expect(component.disciplinaFormComponent.canSubmit).toBeFalse());

    describe('Quando a função handleSubmit é invocada', () => {
      it('O formulário não é submetido pois a propriedade canSubmit é false', () => {
        component.disciplinaFormComponent.handleSubmit();
        fixture.detectChanges();
        expect(component.submitted).toBeFalse();
      });
    });

    describe('Quando a propriedade "disciplina" é modificada para uma instancia válida', () => {
      beforeEach(() => {
        component.disciplina = new Disciplina(
          'uuid',
          'Disciplina X',
          'DSPLXXXXXX',
          80,
          Professor.fromJson(professoresMock[0])
        );
        fixture.detectChanges();
      });

      it('A propriedade canSubmit ainda é false pois o formulário ainda é "pristine"', () =>
        expect(component.disciplinaFormComponent.canSubmit).toBeFalse());

      describe('Quando a função handleSubmit é invocada', () => {
        it('O formulário não é submetido pois a propriedade canSubmit é false', () => {
          component.disciplinaFormComponent.handleSubmit();
          fixture.detectChanges();
          expect(component.submitted).toBeFalse();
        });
      });

      describe('Quando um campo do formulário é modificado', () => {
        beforeEach(() => {
          component.disciplinaFormComponent.form.patchValue({
            descricao: 'Teste 1',
          });
          component.disciplinaFormComponent.form.markAsDirty();
          fixture.detectChanges();
        });

        it('A propriedade canSubmit é true pois o formulário é válido e dirty', () =>
          expect(component.disciplinaFormComponent.canSubmit).toBeTrue());

        describe('Quando a função handleSubmit é invocada', () => {
          it('O formulário é submetido', () => {
            component.disciplinaFormComponent.handleSubmit();
            fixture.detectChanges();
            expect(component.submitted).toBeTrue();
          });
        });
      });
    });

    describe('Quando um campo do formulário é modificado', () => {
      let ngOnChangesSpy: jasmine.Spy;

      beforeEach(() => {
        ngOnChangesSpy = spyOn(
          component.disciplinaFormComponent,
          'ngOnChanges'
        );
        component.disciplinaFormComponent.form.patchValue({
          descricao: 'Disciplina Teste',
        });
        fixture.detectChanges();
      });

      it('Como a mesma instância de disciplina é mantida, a função ngOnChanges não é invocada', () => {
        expect(ngOnChangesSpy.calls.count()).toEqual(0);
      });

      it('O componente que aplicou o property binding é atualizado', () => {
        const span: HTMLSpanElement = fixture.nativeElement.querySelector(
          'span#descricao'
        );
        expect(span.innerText).toEqual('Disciplina Teste');
      });
    });
  });
});
