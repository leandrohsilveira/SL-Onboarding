import { AlunoDetailComponent } from './aluno-detail.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { AlunoDetailModule } from './aluno-detail.module';
import { Aluno } from '../aluno';
import alunosMock from '../aluno.mock';

describe('AlunoDetailComponent', () => {
  let fixture: ComponentFixture<AlunoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, AlunoDetailModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AlunoDetailComponent);
    fixture.componentInstance.aluno = Aluno.fromJson(alunosMock[0]);
    fixture.detectChanges();
  });

  describe('Quando renderizado', () => {
    it('exibe 5 elementos do tipo span com classe "po-info-value"', () => {
      const infos: HTMLSpanElement[] = fixture.nativeElement.querySelectorAll(
        'span.po-info-value'
      );
      expect(infos.length).toEqual(5);
    });
  });
});
