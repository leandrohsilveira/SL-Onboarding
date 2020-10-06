import { moduleMetadata } from '@storybook/angular';
import { v4 } from 'uuid';

import { DisciplinaFormComponent } from './disciplina-form.component';
import { DisciplinaFormModule } from './disciplina-form.module';

import '../../../../polyfills';
import { Disciplina } from '../disciplina';
import { Professor, Titulacao } from 'app/domain/pessoa/professor/professor';
import {
  PoLookupFilter,
  PoLookupResponseApi,
  PoLookupModalComponent,
} from '@po-ui/ng-components';
import { Observable, of, throwError } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Pessoa } from 'app/domain/pessoa/pessoa';

const professor = new Professor(
  v4(),
  'Professor teste',
  'professor.teste@totvs.com.br',
  '17164219001',
  Titulacao.DOUTOR
);
const disciplina = new Disciplina(
  v4(),
  'Disciplina Teste',
  'DSPLTESTE',
  50,
  professor
);

const professorService: PoLookupFilter = {
  getObjectByValue(value: string): Observable<Professor> {
    if (value === professor.id || Pessoa.nomeOuCpfPredicate(value)(professor))
      return of(professor);
    else return throwError(new Error('Professor não encontrado'));
  },
  getFilteredItems(params): Observable<PoLookupResponseApi> {
    console.log('getFilteredItems', params);
    return of({
      items: [professor],
      hasNext: false,
    });
  },
};

export const New = () => ({
  component: DisciplinaFormComponent,
  props: {
    professorService,
    novoProfessorClick: () => console.log('novo professor click'),
  },
});

export const Edit = () => ({
  component: DisciplinaFormComponent,
  props: {
    disciplina,
    professorService,
    novoProfessorClick: () => console.log('novo professor click'),
  },
});

export default {
  title: 'DisciplinaForm',
  component: DisciplinaFormComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserModule, RouterTestingModule, DisciplinaFormModule],
      entryComponents: [PoLookupModalComponent],
    }),
  ],
};
