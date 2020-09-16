import { generate } from '@fnando/cpf';
import { InjectionToken } from '@angular/core';

const limit = 1500;
const min = 450;
const random = Math.round(Math.random() * (limit - min));
const length = min + random;

const alunosMock = [];

for (let i = 1; i <= length; i++) {
  alunosMock.push({
    id: `uuid${i}`,
    nome: `Teste ${i}`,
    email: `teste${i}@totvs.com.br`,
    cpf: generate(false),
    formaIngresso:
      Math.round(Math.random() * 100) % 2 === 0 ? 'ENADE' : 'Vestibular',
    matricula: i,
  });
}

export const injectionToken = new InjectionToken<AlunosMock>('app.mocks.aluno');

export interface AlunosMock {
  values: any[];
}

export default alunosMock;
