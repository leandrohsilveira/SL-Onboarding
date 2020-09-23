import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  OnInit,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from 'app/shared/base/base.component';
import { Professor, Titulacao } from '../professor';
import { PoSelectComponent, PoSelectOption } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-professor-form',
  templateUrl: './professor-form.component.html',
})
export class ProfessorFormComponent
  extends BaseComponent
  implements OnInit, OnChanges {
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  @Input()
  professor = new Professor();

  @Input()
  disabled = false;

  @Output()
  submitForm = new EventEmitter<Professor>();

  @ViewChild('titulacaoRef', { static: true })
  titulacaoRef: PoSelectComponent;

  formSubscription: Subscription;

  form: FormGroup;

  titulacaoOptions: PoSelectOption[] = [
    {
      label: $localize`:Rótulo da opção "PHD" do campo "Titulação" do formulário de professor:PHD`,
      value: Titulacao.PHD,
    },
    {
      label: $localize`:Rótulo da opção "Doutor" do campo "Titulação" do formulário de professor:Doutor`,
      value: Titulacao.DOUTOR,
    },
    {
      label: $localize`:Rótulo da opção "Mestre" do campo "Titulação" do formulário de professor:Mestre`,
      value: Titulacao.MESTRE,
    },
  ];

  get canSubmit(): boolean {
    return (
      this.form && this.form.valid && this.form.dirty && !this.form.pending
    );
  }

  ngOnChanges({ professor }: SimpleChanges): void {
    if (professor) this.criarForm();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.criarForm();
  }

  criarForm(): void {
    this.formSubscription?.unsubscribe();
    this.form = this.professor.criarForm(this.formBuilder);
    this.formSubscription = this.professor.subscribeFormChanges(
      this.form,
      this.takeWhileMounted()
    );
  }

  handleEnterPressed(): void {
    if (this.titulacaoRef.open) this.titulacaoRef.toggleButton();
    this.handleSubmit();
  }

  handleSubmit(): void {
    if (this.canSubmit) this.submitForm.emit(this.professor);
  }
}
