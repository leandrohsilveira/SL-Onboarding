import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import(
        './domain/pessoa/aluno/routes/aluno-list-route/aluno-list-route.module'
      ).then(({ AlunoListRouteModule }) => AlunoListRouteModule),
    // loadChildren:
    //   './domain/pessoa/aluno/routes/aluno-list-route/aluno-list-route.module#AlunoListRoutingModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
