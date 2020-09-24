import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { BaseComponent } from 'app/shared/base/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Disciplina } from '../disciplina';

@Component({
  selector: 'app-disciplina-form',
  templateUrl: './disciplina-form.component.html',
})
export class DisciplinaFormComponent
  extends BaseComponent
  implements OnInit, OnChanges {
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  @Input()
  disciplina = new Disciplina();

  @Input()
  disabled = false;

  @Output()
  formSubmit = new EventEmitter<Disciplina>();

  formSubscription: Subscription;

  form: FormGroup;

  get canSubmit(): boolean {
    return (
      this.form && this.form.valid && this.form.dirty && !this.form.pending
    );
  }

  ngOnChanges({ disciplina }: SimpleChanges): void {
    if (disciplina) this.criarForm();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.criarForm();
  }

  criarForm(): void {
    this.formSubscription?.unsubscribe();
    this.form = this.disciplina.criarForm(this.formBuilder);
    this.formSubscription = this.disciplina.subscribeFormChanges(
      this.form,
      this.takeWhileMounted()
    );
  }

  handleSubmit(): void {
    if (this.canSubmit) this.formSubmit.emit(this.disciplina);
  }
}
