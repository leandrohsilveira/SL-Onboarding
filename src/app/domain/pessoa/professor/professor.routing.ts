import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfessorListRouteModule } from './routes/professor-list-route/professor-list-route.module';
import { ProfessorListRouteComponent } from './routes/professor-list-route/professor-list-route.component';
import { ProfessorFormRouteModule } from './routes/professor-form-route/professor-form-route.module';
import { ProfessorFormRouteComponent } from './routes/professor-form-route/professor-form-route.component';
import { RouterUtil } from 'app/shared/util/router.util';

const routes: Routes = [
  {
    path: '',
    component: ProfessorListRouteComponent,
    children: [
      {
        path: 'new',
        component: ProfessorFormRouteComponent,
        data: {
          urlRetorno: RouterUtil.urlFromRootToParent,
          mensagemSucesso: () =>
            $localize`:Mensagem de sucesso ao cadastrar um novo professor:Professor cadastrado com sucesso`,
        },
      },
      {
        path: ':id/edit',
        component: ProfessorFormRouteComponent,
        data: {
          loadFromParam: 'id',
          urlRetorno: RouterUtil.urlFromRootToParent,
          mensagemSucesso: () =>
            $localize`:Mensagem de sucesso ao atualizar os dados de um professor existente:Professor atualizado com sucesso`,
        },
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    ProfessorListRouteModule,
    ProfessorFormRouteModule,
    RouterModule.forChild(routes),
  ],
})
export class ProfessorRoutingModule {}
