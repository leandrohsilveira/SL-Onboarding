import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplinaListRouteModule } from './routes/disciplina-list-route/disciplina-list-route.module';
import { DisciplinaListRouteComponent } from './routes/disciplina-list-route/disciplina-list-route.component';
import { DisciplinaFormRouteComponent } from './routes/disciplina-form-route/disciplina-form-route.component';
import { RouterUtil } from '../../shared/util/router.util';
import { DisciplinaFormRouteModule } from './routes/disciplina-form-route/disciplina-form-route.module';
import { ProfessorFormRouteModule } from '../pessoa/professor/routes/professor-form-route/professor-form-route.module';
import { ProfessorFormRouteComponent } from '../pessoa/professor/routes/professor-form-route/professor-form-route.component';

const formChildren: Routes = [
  {
    path: 'professor/new',
    component: ProfessorFormRouteComponent,
    data: {
      urlRetorno: RouterUtil.urlFromRootToParent,
      mensagemSucesso: () =>
        $localize`:Mensagem de sucesso ao cadastrar um novo professor para uma disciplina:Professor cadastrado com sucesso`,
    },
  },
];

const routes: Routes = [
  {
    path: '',
    component: DisciplinaListRouteComponent,
    children: [
      {
        path: 'new',
        component: DisciplinaFormRouteComponent,
        data: {
          urlRetorno: RouterUtil.urlFromRootToParent,
          mensagemSucesso: () =>
            $localize`:Mensagem de sucesso ao cadastrar uma nova disciplina:Disciplina cadastrada com sucesso`,
        },
        children: formChildren,
      },
      {
        path: ':id/edit',
        component: DisciplinaFormRouteComponent,
        data: {
          loadFromParam: 'id',
          urlRetorno: RouterUtil.urlFromRootToParent,
          mensagemSucesso: () =>
            $localize`:Mensagem de sucesso ao atualizar um disciplina existente:Disciplina atualizada com sucesso`,
        },
        children: formChildren,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    ProfessorFormRouteModule,
    DisciplinaFormRouteModule,
    DisciplinaListRouteModule,
    RouterModule.forChild(routes),
  ],
})
export class DisciplinaRoutingModule {}
