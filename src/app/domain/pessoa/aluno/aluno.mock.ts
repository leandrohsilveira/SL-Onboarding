import { InjectionToken } from '@angular/core';
import data from './aluno.mock.json';

const alunosMock = [...data];

export const injectionToken = new InjectionToken<AlunosMock>('app.mocks.aluno');

export interface AlunosMock {
  values: any[];
}

export default alunosMock;
