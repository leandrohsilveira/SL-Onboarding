import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorListRouteComponent } from './professor-list-route.component';
import { ProfessorListModule } from '../../professor-list/professor-list.module';
import { PoPageModule } from '@po-ui/ng-components';
import { ProfessorModule } from '../../professor.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    PoPageModule,
    ProfessorListModule,
    ProfessorModule,
    RouterModule,
  ],
  declarations: [ProfessorListRouteComponent],
})
export class ProfessorListRouteModule {}
