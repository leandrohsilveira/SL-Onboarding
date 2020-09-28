import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Entidade, Id, EntidadeJson } from '../entidade';
import { CustomValidators, NotTakenService } from 'app/shared/validators';
import { of } from 'rxjs';
import { format as formatCpf } from '@fnando/cpf';
import { Predicate } from '@angular/core';

const DEFAULT_NOT_TAKEN_SERVICE: NotTakenService = () => of(true);

export type PessoaSortFields = 'nome' | 'email' | 'cpf';

export interface CpfNotTakenJson {
  id: Id;
  cpf: string;
}

export interface EmailNotTakenJson {
  id: Id;
  email: string;
}

export interface PessoaJson extends EntidadeJson {
  nome: string;
  email: string;
  cpf: string;
}

export abstract class Pessoa extends Entidade {
  public static nomeOuCpfPredicate<R extends Pessoa>(
    query: string
  ): Predicate<R> {
    return ({ nome, cpf }) =>
      nome === query || cpf === query.replace(/(\.|\-)/g, '');
  }

  constructor(id: Id, public nome = '', public email = '', public cpf = '') {
    super(id);
  }

  get cpfFormatado(): string {
    return formatCpf(this.cpf);
  }

  protected onChanges({ nome, email, cpf }: any): void {
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
  }

  protected getFormControls(
    emailNotTaken: NotTakenService,
    cpfNotTaken: NotTakenService
  ): any {
    return {
      nome: [this.nome, [Validators.required, Validators.maxLength(255)]],
      email: [
        this.email,
        [
          Validators.required,
          Validators.maxLength(255),
          CustomValidators.email,
        ],
        CustomValidators.notTakenValidator(emailNotTaken, 'emailTaken'),
      ],
      cpf: [
        this.cpf,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          CustomValidators.cpf,
        ],
        CustomValidators.notTakenValidator(cpfNotTaken, 'cpfTaken'),
      ],
    };
  }

  public criarForm(
    builder: FormBuilder,
    emailNotTaken = DEFAULT_NOT_TAKEN_SERVICE,
    cpfNotTaken = DEFAULT_NOT_TAKEN_SERVICE
  ): FormGroup {
    return builder.group(this.getFormControls(emailNotTaken, cpfNotTaken));
  }
}
