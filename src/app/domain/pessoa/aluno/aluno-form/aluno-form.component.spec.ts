import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlunoFormModule } from './aluno-form.module';
import { Aluno, FormaIngresso } from '../aluno';
import { AlunoFormComponent } from './aluno-form.component';
import { CommonModule } from '@angular/common';
import { of, Observable } from 'rxjs';

describe('AlunoFormComponent', () => {
  @Component({
    template: `
      <app-aluno-form
        #form
        [aluno]="aluno"
        [cpfNotTaken]="cpfNotTakenService"
        [emailNotTaken]="emailNotTakenService"
        (formSubmit)="handleSubmit()"
      ></app-aluno-form>
      <span id="nome">{{ aluno.nome }}</span>
    `,
  })
  class TestHostComponent {
    @ViewChild('form')
    component: AlunoFormComponent;

    aluno = new Aluno();

    submitted = false;

    cpfNotTakenService(cpf: string): Observable<boolean> {
      return of(cpf !== '18449780012');
    }

    emailNotTakenService(email: string): Observable<boolean> {
      return of(email !== 'testey@totvs.com.br');
    }

    handleSubmit(): void {
      this.submitted = true;
    }
  }

  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, AlunoFormModule],
      declarations: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    host = fixture.componentInstance;
  });

  it('Quando renderizado, apresenta 4 campos', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input,select');
    expect(inputs.length).toEqual(4);
  });

  describe('Quando a propriedade "aluno" inicia limpa (new Aluno())', () => {
    it('A propriedade canSubmit é false', () =>
      expect(host.component.canSubmit).toBeFalse());

    describe('Quando a função handleSubmit é invocada', () => {
      it('O formulário não é submetido pois a propriedade canSubmit é false', () => {
        host.component.handleSubmit();
        fixture.detectChanges();
        expect(host.submitted).toBeFalse();
      });
    });

    describe('Quando a propriedade "aluno" é modificada para uma instância com um CPF que já está cadastrado', () => {
      beforeEach(() => {
        host.aluno = new Aluno(
          'uuid',
          'Teste',
          'teste@totvs.com.br',
          '18449780012',
          FormaIngresso.ENADE,
          56
        );
        host.component.form.markAsDirty();
        fixture.detectChanges();
      });

      it('A propriedade canSubmit é false pois o CPF já está cadastrado', () =>
        expect(host.component.canSubmit).toBeFalse());

      it('O formulário é inválido', () =>
        expect(host.component.form.invalid).toBeTrue());

      it('O campo CPF é inválido (cpfTaken)', () => {
        expect(host.component.form.get('cpf').errors).toEqual({
          cpfTaken: true,
        });
      });
    });

    describe('Quando a propriedade "aluno" é modificada para uma instância com um E-mail que já está cadastrado', () => {
      beforeEach(() => {
        host.aluno = new Aluno(
          'uuid',
          'Teste',
          'testey@totvs.com.br',
          '17475054047',
          FormaIngresso.ENADE,
          56
        );
        host.component.form.markAsDirty();
        fixture.detectChanges();
      });

      it('A propriedade canSubmit é false pois o E-mail já está cadastrado', () =>
        expect(host.component.canSubmit).toBeFalse());

      it('O formulário é inválido', () =>
        expect(host.component.form.invalid).toBeTrue());

      it('O campo E-mail é inválido (emailTaken)', () => {
        expect(host.component.form.get('email').errors).toEqual({
          emailTaken: true,
        });
      });
    });

    describe('Quando a propriedade "aluno" é modificada para uma instancia válida', () => {
      beforeEach(() => {
        host.aluno = new Aluno(
          'uuid',
          'Teste',
          'teste@totvs.com.br',
          '17475054047',
          FormaIngresso.ENADE,
          56
        );
        fixture.detectChanges();
      });

      it('A propriedade canSubmit ainda é false pois o formulário ainda é "pristine"', () =>
        expect(host.component.canSubmit).toBeFalse());

      describe('Quando a função handleSubmit é invocada', () => {
        it('O formulário não é submetido pois a propriedade canSubmit é false', () => {
          host.component.handleSubmit();
          fixture.detectChanges();
          expect(host.submitted).toBeFalse();
        });
      });

      describe('Quando um campo do formulário é modificado', () => {
        beforeEach(() => {
          host.component.form.patchValue({ nome: 'Teste 1' });
          host.component.form.markAsDirty();
          fixture.detectChanges();
        });

        it('A propriedade canSubmit é true pois o formulário é válido e dirty', () =>
          expect(host.component.canSubmit).toBeTrue());

        describe('Quando a função handleSubmit é invocada', () => {
          it('O formulário é submetido', () => {
            host.component.handleSubmit();
            fixture.detectChanges();
            expect(host.submitted).toBeTrue();
          });
        });
      });
    });

    describe('Quando um campo do formulário é modificado', () => {
      let ngOnChangesSpy: jasmine.Spy;

      beforeEach(() => {
        ngOnChangesSpy = spyOn(host.component, 'ngOnChanges');
        host.component.form.patchValue({ nome: 'Teste' });
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
