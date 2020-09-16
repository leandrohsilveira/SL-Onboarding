import { NgModule } from '@angular/core';
import { AlunoService } from './aluno.service';
import alunosMock, { AlunosMock, injectionToken } from './alunos.mock';

@NgModule({
  providers: [
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
