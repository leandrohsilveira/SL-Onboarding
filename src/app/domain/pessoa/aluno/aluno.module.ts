import { NgModule } from '@angular/core';
import { AlunoService } from './aluno.service';
import alunosMock, { AlunosMock, injectionToken } from './alunos.mock';
import { CommonModule } from '@angular/common';

@NgModule({
  providers: [
    CommonModule,
    {
      provide: injectionToken,
      useValue: <AlunosMock>{
        values: alunosMock,
      },
    },
    AlunoService,
  ],
})
export class AlunoModule {}
