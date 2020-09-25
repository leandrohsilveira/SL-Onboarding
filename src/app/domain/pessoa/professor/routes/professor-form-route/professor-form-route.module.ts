import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorFormRouteComponent } from './professor-form-route.component';
import { ProfessorFormModule } from '../../professor-form/professor-form.module';
import { PoModalModule } from '@po-ui/ng-components';
import { LoadingIndicatorModule } from 'app/shared/components/loading-indicator/loading-indicator.module';
import { ProfessorModule } from '../../professor.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PoModalModule,
    ProfessorModule,
    ProfessorFormModule,
    LoadingIndicatorModule,
  ],
  declarations: [ProfessorFormRouteComponent],
})
export class ProfessorFormRouteModule {}
