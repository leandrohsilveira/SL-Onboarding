import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplinaListRouteComponent } from './disciplina-list-route.component';
import { DisciplinaModule } from '../../disciplina.module';
import { DisciplinaListModule } from '../../disciplina-list/disciplina-list.module';
import { PoPageModule } from '@po-ui/ng-components';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    DisciplinaModule,
    DisciplinaListModule,
    PoPageModule,
    RouterModule,
  ],
  declarations: [DisciplinaListRouteComponent],
})
export class DisciplinaListRouteModule {}
