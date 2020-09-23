import { environment } from 'environments/environment';

const { schema, host, port } = environment.backend;

const api = 'api';
const core = 'core';
const query = 'query';
const v1 = 'v1';

export class Endpoint {
  constructor(public path: string) {}

  get urlCompleta(): string {
    return `${schema}://${host}:${port}${this.path}`;
  }
}

export const endpoints = {
  core: {
    v1: {
      alunos: new Endpoint(`/${api}/${core}/${v1}/alunos`),
      professores: new Endpoint(`/${api}/${core}/${v1}/professores`),
      disciplinas: new Endpoint(`/${api}/${core}/${v1}/disciplinas`),
    },
  },
  query: {
    v1: {
      alunos: new Endpoint(`/${api}/${query}/${v1}/alunos`),
      professores: new Endpoint(`/${api}/${query}/${v1}/professores`),
      disciplinas: new Endpoint(`/${api}/${query}/${v1}/disciplinas`),
    },
  },
};
