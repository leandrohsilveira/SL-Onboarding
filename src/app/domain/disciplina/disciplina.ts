import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'app/shared/validators';
import { Entidade, Id } from '../entidade';

export class Disciplina extends Entidade {
  public static fromJson({
    id,
    descricao,
    sigla,
    cargaHoraria,
  }: any): Disciplina {
    return new Disciplina(id, descricao, sigla, +cargaHoraria);
  }

  constructor(
    id: Id = null,
    public descricao = '',
    public sigla = '',
    public cargaHoraria?: number
  ) {
    super(id);
  }

  public fromForm(form: FormGroup): void {
    this.descricao = form.get('descricao').value;
    this.sigla = form.get('sigla').value;
    this.cargaHoraria = +form.get('cargaHoraria').value;
  }

  protected onChanges({ descricao, sigla, cargaHoraria }: any): void {
    this.descricao = descricao;
    this.sigla = sigla;
    this.cargaHoraria = +cargaHoraria;
  }

  public criarForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      descricao: [
        this.descricao,
        [Validators.required, Validators.maxLength(255)],
      ],
      sigla: [this.sigla, [Validators.required, Validators.maxLength(10)]],
      cargaHoraria: [
        this.cargaHoraria ?? '',
        [Validators.required, CustomValidators.number],
      ],
    });
  }
}
