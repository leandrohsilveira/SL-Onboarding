import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoListRouteModule } from './routes/aluno-list-route/aluno-list-route.module';
import { AlunoListRouteComponent } from './routes/aluno-list-route/aluno-list-route.component';

const routes: Routes = [{ path: '', component: AlunoListRouteComponent }];

@NgModule({
  imports: [CommonModule, AlunoListRouteModule, RouterModule.forChild(routes)],
})
export class AlunoRoutingModule {}
