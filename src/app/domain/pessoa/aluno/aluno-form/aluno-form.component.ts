import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Aluno, FormaIngresso } from '../aluno';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseComponent } from 'app/shared/base/base.component';
import { PoSelectOption } from '@po-ui/ng-components';

@Component({
  selector: 'app-aluno-form',
  templateUrl: './aluno-form.component.html',
  styleUrls: ['./aluno-form.component.css'],
})
export class AlunoFormComponent extends BaseComponent {
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  @Input()
  aluno = new Aluno();

  @Output()
  alunoChange = new EventEmitter<Aluno>();

  @Output('submit')
  onSubmit = new EventEmitter<Aluno>();

  form: FormGroup;

  formaIngressoOptions: PoSelectOption[] = [
    {
      label: $localize`:Rótulo da opção "ENADE" do campo "Forma de ingresso" do formulário de aluno:ENADE`,
      value: FormaIngresso.ENADE,
    },
    {
      label: $localize`:Rótulo da opção "Vestibular" do campo "Forma de ingresso" do formulário de aluno:Vestibular`,
      value: FormaIngresso.VESTIBULAR,
    },
  ];

  get canSubmit() {
    return this.form.valid && !this.form.pending;
  }

  ngOnInit() {
    this.form = this.aluno.criarForm(this.formBuilder);
    this.aluno.subscribeFormChanges(
      this.form,
      this.takeWhileMounted(),
      (aluno) => this.alunoChange.emit(aluno)
    );
  }

  submit() {
    this.onSubmit.emit(this.aluno);
  }
}
