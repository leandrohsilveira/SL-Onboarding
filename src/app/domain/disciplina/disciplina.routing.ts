import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplinaListRouteModule } from './routes/disciplina-list-route/disciplina-list-route.module';
import { DisciplinaListRouteComponent } from './routes/disciplina-list-route/disciplina-list-route.component';

const routes: Routes = [
  {
    path: '',
    component: DisciplinaListRouteComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    DisciplinaListRouteModule,
    RouterModule.forChild(routes),
  ],
})
export class DisciplinaRoutingModule {}
