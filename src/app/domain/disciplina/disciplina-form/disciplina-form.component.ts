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
import { PoLookupFilter, PoLookupColumn } from '@po-ui/ng-components';

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

  @Input()
  professorService: PoLookupFilter;

  @Output()
  formSubmit = new EventEmitter<Disciplina>();

  @Output()
  novoProfessorClick = new EventEmitter<void>();

  formSubscription: Subscription;

  form: FormGroup;

  professorColumns: PoLookupColumn[] = [
    { property: 'nome', label: $localize`Nome` },
    { property: 'email', label: $localize`E-mail` },
    { property: 'cpfFormatado', label: $localize`CPF` },
  ];

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

  handleLookupError(error: Error): void {
    this.form.get('professorRef').setErrors({ lookup: error.message });
  }
}
