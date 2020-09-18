import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoFormRouteComponent } from './aluno-form-route.component';
import { AlunoFormModule } from '../../aluno-form/aluno-form.module';
import { AlunoModule } from '../../aluno.module';
import { PoModalModule, PoLoadingModule } from '@po-ui/ng-components';

@NgModule({
  imports: [
    CommonModule,
    AlunoModule,
    AlunoFormModule,
    PoModalModule,
    PoLoadingModule,
  ],
  declarations: [AlunoFormRouteComponent],
})
export class AlunoFormRouteModule {}
