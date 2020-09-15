import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Aluno, FormaIngresso } from '../aluno';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseComponent } from 'app/shared/base/base.component';
import { PoSelectOption } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aluno-form',
  templateUrl: './aluno-form.component.html',
  styleUrls: ['./aluno-form.component.css'],
})
export class AlunoFormComponent extends BaseComponent implements OnChanges {
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  @Input()
  aluno = new Aluno();

  @Output('submit')
  onSubmit = new EventEmitter<Aluno>();

  formSubscription: Subscription;

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

  ngOnChanges({ aluno }: SimpleChanges) {
    if (aluno) this.criarForm();
  }

  ngOnInit() {
    super.ngOnInit();
    this.criarForm();
  }

  criarForm() {
    this.formSubscription?.unsubscribe();
    this.form = this.aluno.criarForm(this.formBuilder);
    this.formSubscription = this.aluno.subscribeFormChanges(
      this.form,
      this.takeWhileMounted()
    );
  }

  submit() {
    this.canSubmit && this.onSubmit.emit(this.aluno);
  }
}
