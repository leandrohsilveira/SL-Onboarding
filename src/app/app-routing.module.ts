import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'alunos',
    loadChildren: () =>
      import('./domain/pessoa/aluno/aluno.routing').then(
        ({ AlunoRoutingModule }) => AlunoRoutingModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
