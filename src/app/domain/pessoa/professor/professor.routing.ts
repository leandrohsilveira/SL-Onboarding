import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfessorListRouteModule } from './routes/professor-list-route/professor-list-route.module';
import { ProfessorListRouteComponent } from './routes/professor-list-route/professor-list-route.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessorListRouteComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    ProfessorListRouteModule,
    RouterModule.forChild(routes),
  ],
})
export class ProfessorRoutingModule {}
