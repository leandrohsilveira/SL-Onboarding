import { Component, ViewChild, ElementRef } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlunoFormModule } from './aluno-form.module';
import { Aluno } from '../aluno';
import { AlunoFormComponent } from './aluno-form.component';
import { CommonModule } from '@angular/common';

describe('Sobre aluno-form.component.ts, AlunoFormComponent', () => {
  @Component({
    template: `
      <app-aluno-form
        #form
        [(aluno)]="aluno"
        (submit)="handleSubmit()"
      ></app-aluno-form>
      {{ aluno.nome }}
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

  it('Quando renderizado, apresenta 5 campos', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input,select');
    expect(inputs.length).toEqual(5);
  });

  describe('Quando a instância de Aluno está limpa', () => {
    it('A propriedade form.canSubmit é false', () =>
      expect(component.alunoFormComponent.canSubmit).toBeFalse());
  });
});
