import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Aluno, FormaIngresso } from '../aluno';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseComponent } from 'app/shared/base/base.component';
import { PoSelectOption, PoSelectComponent } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aluno-form',
  templateUrl: './aluno-form.component.html',
})
export class AlunoFormComponent extends BaseComponent implements OnChanges {
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  @Input()
  aluno = new Aluno();

  @Input()
  disabled = false;

  @Output()
  onSubmit = new EventEmitter<Aluno>();

  @ViewChild('formaIngressoRef', { static: true })
  formaIngressoRef: PoSelectComponent;

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
    return (
      this.form && this.form.valid && this.form.dirty && !this.form.pending
    );
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

  handleEnterPressed() {
    if (this.formaIngressoRef.open) this.formaIngressoRef.toggleButton();
    this.handleSubmit();
  }

  handleSubmit() {
    if (this.canSubmit) this.onSubmit.emit(this.aluno);
  }
}
