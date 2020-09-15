import { generate } from "@fnando/cpf";

const alunosMock = [
  {
    id: "uuid1",
    nome: "Teste 1",
    email: "teste1@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "ENADE",
    matricula: 1,
  },
  {
    id: "uuid2",
    nome: "Teste 2",
    email: "teste2@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "Vestibular",
    matricula: 2,
  },
  {
    id: "uuid3",
    nome: "Teste 3",
    email: "teste3@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "ENADE",
    matricula: 3,
  },
  {
    id: "uuid4",
    nome: "Teste 4",
    email: "teste4@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "ENADE",
    matricula: 4,
  },
  {
    id: "uuid5",
    nome: "Teste 5",
    email: "teste5@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "Vestibular",
    matricula: 5,
  },
  {
    id: "uuid6",
    nome: "Teste 6",
    email: "teste6@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "Vestibular",
    matricula: 6,
  },
  {
    id: "uuid7",
    nome: "Teste 7",
    email: "teste7@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "ENADE",
    matricula: 7,
  },
  {
    id: "uuid8",
    nome: "Teste 8",
    email: "teste8@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "Vestibular",
    matricula: 8,
  },
  {
    id: "uuid9",
    nome: "Teste 9",
    email: "teste9@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "Vestibular",
    matricula: 9,
  },
  {
    id: "uuid11",
    nome: "Teste 11",
    email: "teste11@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "Vestibular",
    matricula: 11,
  },
  {
    id: "uuid12",
    nome: "Teste 12",
    email: "teste12@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "ENADE",
    matricula: 12,
  },
  {
    id: "uuid13",
    nome: "Teste 13",
    email: "teste13@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "ENADE",
    matricula: 13,
  },
  {
    id: "uuid14",
    nome: "Teste 14",
    email: "teste14@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "Vestibular",
    matricula: 14,
  },
  {
    id: "uuid15",
    nome: "Teste 15",
    email: "teste15@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "ENADE",
    matricula: 15,
  },
  {
    id: "uuid16",
    nome: "Teste 16",
    email: "teste16@totvs.com.br",
    cpf: generate(false),
    formaIngresso: "ENADE",
    matricula: 16,
  },
];

export default alunosMock;