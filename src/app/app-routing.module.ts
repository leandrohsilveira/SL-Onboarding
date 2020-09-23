import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfessorListModule } from './domain/pessoa/professor/professor-list/professor-list.module';

const routes: Routes = [
  {
    path: 'alunos',
    loadChildren: () =>
      import('./domain/pessoa/aluno/aluno.routing').then(
        ({ AlunoRoutingModule }) => AlunoRoutingModule
      ),
  },
  {
    path: 'professores',
    loadChildren: () =>
      import('./domain/pessoa/professor/professor.routing').then(
        ({ ProfessorRoutingModule }) => ProfessorRoutingModule
      ),
  },
];

@NgModule({
  imports: [ProfessorListModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
