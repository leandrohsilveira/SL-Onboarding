import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoFormRouteComponent } from './aluno-form-route.component';
import { AlunoFormModule } from '../../aluno-form/aluno-form.module';
import { AlunoModule } from '../../aluno.module';
import { PoModalModule, PoNotificationModule } from '@po-ui/ng-components';
import { LoadingIndicatorModule } from 'app/shared/components/loading-indicator/loading-indicator.module';

@NgModule({
  imports: [
    CommonModule,
    AlunoModule,
    AlunoFormModule,
    PoModalModule,
    PoNotificationModule,
    LoadingIndicatorModule,
  ],
  declarations: [AlunoFormRouteComponent],
})
export class AlunoFormRouteModule {}
