import {
  AbstractControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Id, EntidadeEvent } from 'app/domain/entidade';
import { Pessoa, PessoaJson, PessoaSortFields } from '../pessoa';
import { NotTakenService } from 'app/shared/validators';

export class ProfessorEvent extends EntidadeEvent<Professor> {}

export interface ProfessorJson extends PessoaJson {
  titulacao: string;
}

export type ProfessorSortFields = PessoaSortFields | 'titulacao';

export enum Titulacao {
  MESTRE = 'Mestre',
  DOUTOR = 'Doutor',
  PHD = 'PHD',
}

export class Professor extends Pessoa {
  constructor(
    id: Id = null,
    nome = '',
    email = '',
    cpf = '',
    public titulacao: Titulacao | '' = ''
  ) {
    super(id, nome, email, cpf);
  }

  protected onChanges({ titulacao, ...pessoa }: any) {
    super.onChanges(pessoa);
    this.titulacao = titulacao;
  }

  protected getFormControls(
    emailNotTaken: NotTakenService,
    cpfNotTaken: NotTakenService
  ) {
    return {
      ...super.getFormControls(emailNotTaken, cpfNotTaken),
      titulacao: [
        this.titulacao,
        [Validators.required, this.titulacaoValidator],
      ],
    };
  }

  private titulacaoValidator(control: AbstractControl) {
    const value: string = control.value;

    if (value)
      switch (value) {
        case Titulacao.DOUTOR:
        case Titulacao.MESTRE:
        case Titulacao.PHD:
          break;
        default:
          return { titulacao: true };
      }
    return null;
  }

  public static fromJson({ id, nome, email, cpf, titulacao }: any): Professor {
    return new Professor(id, nome, email, cpf, titulacao);
  }
}
