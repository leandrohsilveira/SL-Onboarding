import { environment } from 'environments/environment';

const { schema, host, port } = environment.backend;

const api = 'api';
const core = 'core';
const query = 'query';
const v1 = 'v1';

export class Endpoint {
  constructor(public path: string) {}

  get urlCompleta() {
    return `${schema}://${host}:${port}${this.path}`;
  }
}

export const endpoints = {
  core: {
    v1: {
      alunos: new Endpoint(`/${api}/${core}/${v1}/alunos`),
    },
  },
  query: {
    v1: {
      alunos: new Endpoint(`/${api}/${query}/${v1}/alunos`),
    },
  },
};
