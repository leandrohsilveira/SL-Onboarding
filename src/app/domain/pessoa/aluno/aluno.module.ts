import { NgModule } from '@angular/core';
import { AlunoListModule } from './aluno-list/aluno-list.module';
import { AlunoFormModule } from './aluno-form/aluno-form.module';
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
  imports: [AlunoListModule, AlunoFormModule],
})
export class AlunoModule {}
