import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoListRouteModule } from './routes/aluno-list-route/aluno-list-route.module';
import { AlunoListRouteComponent } from './routes/aluno-list-route/aluno-list-route.component';
import { AlunoFormRouteModule } from './routes/aluno-form-route/aluno-form-route.module';
import { AlunoFormRouteComponent } from './routes/aluno-form-route/aluno-form-route.component';
import { RouterUtil } from 'app/shared/util/router.util';

const routes: Routes = [
  {
    path: '',
    component: AlunoListRouteComponent,
    children: [
      {
        path: 'new',
        pathMatch: 'full',
        component: AlunoFormRouteComponent,
        data: {
          returnUrl: RouterUtil.urlSegmentsOfParentFromRoot,
        },
      },
      {
        path: ':id/edit',
        pathMatch: 'full',
        component: AlunoFormRouteComponent,
        data: {
          loadFromParam: 'id',
          returnUrl: RouterUtil.urlSegmentsOfParentFromRoot,
        },
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    AlunoListRouteModule,
    AlunoFormRouteModule,
    RouterModule.forChild(routes),
  ],
})
export class AlunoRoutingModule {}
