import { Validators } from '@angular/forms';
import { Entidade, Id } from '../entidade';
import { CustomValidators } from 'app/shared/validators';

export abstract class Pessoa extends Entidade {
  constructor(id: Id, public nome = '', public email = '', public cpf = '') {
    super(id);
  }

  protected onChanges({ nome, email, cpf }: any) {
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
  }

  protected getFormControls() {
    return {
      nome: [this.nome, [Validators.required, Validators.maxLength(255)]],
      email: [
        this.email,
        [
          Validators.required,
          Validators.maxLength(255),
          CustomValidators.email,
        ],
      ],
      cpf: [
        this.cpf,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          CustomValidators.cpf,
        ],
      ],
    };
  }
}
