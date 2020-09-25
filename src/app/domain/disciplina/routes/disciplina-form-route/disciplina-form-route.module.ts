import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplinaFormRouteComponent } from './disciplina-form-route.component';
import { DisciplinaFormModule } from '../../disciplina-form/disciplina-form.module';
import { DisciplinaModule } from '../../disciplina.module';
import { RouterModule } from '@angular/router';
import {
  PoModalModule,
  PoDividerModule,
  PoFieldModule,
  PoButtonModule,
} from '@po-ui/ng-components';
import { LoadingIndicatorModule } from 'app/shared/components/loading-indicator/loading-indicator.module';
import { ProfessorModule } from 'app/domain/pessoa/professor/professor.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ProfessorModule,
    DisciplinaModule,
    DisciplinaFormModule,
    PoModalModule,
    RouterModule,
    PoFieldModule,
    LoadingIndicatorModule,
    ReactiveFormsModule,
  ],
  declarations: [DisciplinaFormRouteComponent],
})
export class DisciplinaFormRouteModule {}
