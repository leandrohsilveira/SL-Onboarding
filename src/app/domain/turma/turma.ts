import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'app/shared/validators';
import { Entidade, Id } from '../entidade';

export class Turma extends Entidade {
  constructor(
    id: Id = null,
    public descricao = '',
    public anoLetivo?: number,
    public periodoLetivo?: number,
    public numeroVagas?: number
  ) {
    super(id);
  }

  public criarForm(builder: FormBuilder) {
    return builder.group({
      descricao: [
        this.descricao,
        [Validators.required, Validators.maxLength(255)],
      ],
      anoLetivo: [
        this.anoLetivo ?? '',
        [Validators.required, CustomValidators.number],
      ],
      periodoLetivo: [
        this.periodoLetivo ?? '',
        [Validators.required, CustomValidators.number],
      ],
      numeroVagas: [
        this.numeroVagas ?? '',
        [Validators.required, CustomValidators.number],
      ],
    });
  }

  protected onChanges({
    descricao,
    anoLetivo,
    periodoLetivo,
    numeroVagas,
  }: any) {
    this.descricao = descricao;
    this.anoLetivo = +anoLetivo;
    this.periodoLetivo = +periodoLetivo;
    this.numeroVagas = +numeroVagas;
  }

  public static fromJson({
    id,
    descricao,
    anoLetivo,
    periodoLetivo,
    numeroVagas,
  }: any): Turma {
    return new Turma(id, descricao, +anoLetivo, +periodoLetivo, +numeroVagas);
  }
}
