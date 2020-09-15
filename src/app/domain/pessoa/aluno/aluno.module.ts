import { NgModule } from '@angular/core';
import { AlunoListModule } from './aluno-list/aluno-list.module';
import { AlunoFormModule } from './aluno-form/aluno-form.module';

@NgModule({
  imports: [AlunoListModule, AlunoFormModule],
})
export class AlunoModule {}
