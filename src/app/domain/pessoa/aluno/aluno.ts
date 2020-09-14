import { AbstractControl, Validators } from '@angular/forms';
import { Id } from 'app/domain/entidade';
import { CustomValidators } from 'app/shared/validators';
import { Pessoa } from '../pessoa';

export enum FormaIngresso {
  ENADE = 'ENADE',
  VESTIBULAR = 'Vestibular',
}

export class Aluno extends Pessoa {
  constructor(
    id: Id = null,
    nome = '',
    email = '',
    cpf = '',
    public formaIngresso: FormaIngresso | '' = '',
    public matricula?: number
  ) {
    super(id, nome, email, cpf);
  }

  protected onChanges({ formaIngresso, matricula, ...pessoa }: any) {
    super.onChanges(pessoa);
    this.formaIngresso = formaIngresso;
    this.matricula = +matricula;
  }

  protected getFormControls() {
    return {
      ...super.getFormControls(),
      formaIngresso: [
        this.formaIngresso,
        [Validators.required, this.formaIngressoValidator],
      ],
      matricula: [
        this.matricula ?? '',
        [Validators.required, CustomValidators.number],
      ],
    };
  }

  private formaIngressoValidator(control: AbstractControl) {
    if (control.value)
      switch (control.value) {
        case FormaIngresso.ENADE:
        case FormaIngresso.VESTIBULAR:
          break;
        default:
          return { formaIngresso: true };
      }
    return null;
  }

  public static fromJson({
    id,
    nome,
    email,
    cpf,
    formaIngresso,
    matricula,
  }: any): Aluno {
    return new Aluno(id, nome, email, cpf, formaIngresso, +matricula);
  }
}
