import { AbstractControl, Validators } from '@angular/forms';
import { Id, EntidadeEvent } from 'app/domain/entidade';
import { NotTakenService } from 'app/shared/validators';
import { Pessoa, PessoaSortFields, PessoaJson } from '../pessoa';

export interface AlunoJson extends PessoaJson {
  matricula: number;
  formaIngresso: string;
}

export class AlunoEvent extends EntidadeEvent<Aluno> {}

export enum FormaIngresso {
  ENADE = 'ENADE',
  VESTIBULAR = 'Vestibular',
}

export type AlunoSortFields = PessoaSortFields | 'formaIngresso' | 'matricula';

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

  protected onChanges({ formaIngresso, ...pessoa }: any) {
    super.onChanges(pessoa);
    this.formaIngresso = formaIngresso;
  }

  protected getFormControls(
    emailNotTaken: NotTakenService,
    cpfNotTaken: NotTakenService
  ) {
    return {
      ...super.getFormControls(emailNotTaken, cpfNotTaken),
      formaIngresso: [
        this.formaIngresso,
        [Validators.required, this.formaIngressoValidator],
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
