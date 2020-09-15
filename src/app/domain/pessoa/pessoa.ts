import { Validators, FormBuilder } from '@angular/forms';
import { Entidade, Id } from '../entidade';
import { CustomValidators, NotTakenService } from 'app/shared/validators';
import { of } from 'rxjs';
import { format as formatCpf } from '@fnando/cpf';

const DEFAULT_NOT_TAKEN_SERVICE: NotTakenService = () => of(true);

export abstract class Pessoa extends Entidade {
  constructor(id: Id, public nome = '', public email = '', public cpf = '') {
    super(id);
  }

  get cpfFormatado() {
    return formatCpf(this.cpf);
  }

  protected onChanges({ nome, email, cpf }: any) {
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
  }

  protected getFormControls(
    emailNotTaken: NotTakenService,
    cpfNotTaken: NotTakenService
  ) {
    return {
      nome: [this.nome, [Validators.required, Validators.maxLength(255)]],
      email: [
        this.email,
        [
          Validators.required,
          Validators.maxLength(255),
          CustomValidators.email,
        ],
        CustomValidators.notTakenValidator(emailNotTaken),
      ],
      cpf: [
        this.cpf,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          CustomValidators.cpf,
        ],
        CustomValidators.notTakenValidator(cpfNotTaken),
      ],
    };
  }

  public criarForm(
    builder: FormBuilder,
    emailNotTaken = DEFAULT_NOT_TAKEN_SERVICE,
    cpfNotTaken = DEFAULT_NOT_TAKEN_SERVICE
  ) {
    return builder.group(this.getFormControls(emailNotTaken, cpfNotTaken));
  }
}
