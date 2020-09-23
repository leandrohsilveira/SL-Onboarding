import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'app/shared/validators';
import { Entidade, Id, EntidadeJson, EntidadeEvent } from '../entidade';
import { Professor, ProfessorJson } from '../pessoa/professor/professor';

export class DisciplinaEvent extends EntidadeEvent<Disciplina> {}

export type DisciplinaSortFields = 'descricao' | 'sigla' | 'cargaHoraria';

export interface DisciplinaJson extends EntidadeJson {
  descricao: string;
  sigla: string;
  cargaHoraria: number;
  professorRef?: Id;
  professor?: ProfessorJson;
}

export class Disciplina extends Entidade {
  public static fromJson({
    id,
    descricao,
    sigla,
    cargaHoraria,
    professor: professorJson,
  }: DisciplinaJson): Disciplina {
    const professor = professorJson
      ? Professor.fromJson(professorJson)
      : undefined;
    return new Disciplina(id, descricao, sigla, +cargaHoraria, professor);
  }

  constructor(
    id: Id = null,
    public descricao = '',
    public sigla = '',
    public cargaHoraria?: number,
    public professor?: Professor
  ) {
    super(id);
  }

  public get professorRef(): Id {
    return this.professor?.id;
  }

  public toJson(): DisciplinaJson {
    return {
      id: this.id,
      descricao: this.descricao,
      sigla: this.sigla,
      cargaHoraria: this.cargaHoraria,
      professorRef: this.professorRef,
    };
  }

  public fromForm(form: FormGroup): void {
    this.descricao = form.get('descricao').value;
    this.sigla = form.get('sigla').value;
    this.cargaHoraria = +form.get('cargaHoraria').value;
    const professorRef = form.get('professorRef').value;
    if (professorRef && professorRef !== this.professorRef)
      this.professor = new Professor(professorRef);
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
      professorRef: [this.professorRef ?? '', [Validators.required]],
    });
  }
}
