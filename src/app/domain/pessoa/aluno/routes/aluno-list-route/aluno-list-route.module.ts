import { Routes, RouterModule } from '@angular/router';
import { AlunoListRouteComponent } from './aluno-list-route.component';
import { NgModule } from '@angular/core';
import { AlunoListModule } from '../../aluno-list/aluno-list.module';
import { AlunoModule } from '../../aluno.module';
import { PoPageModule } from '@po-ui/ng-components';
import { CommonModule } from '@angular/common';

const routes: Routes = [{ path: '', component: AlunoListRouteComponent }];

@NgModule({
  imports: [
    CommonModule,
    AlunoModule,
    AlunoListModule,
    PoPageModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [AlunoListRouteComponent],
})
export class AlunoListRouteModule {}
