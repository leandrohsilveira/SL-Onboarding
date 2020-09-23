import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from 'app/shared/base/base.component';
import { Professor, Titulacao } from '../professor';
import { PoSelectComponent, PoSelectOption } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-professor-form',
  templateUrl: './professor-form.component.html',
  styleUrls: ['./professor-form.component.css'],
})
export class ProfessorFormComponent extends BaseComponent {
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  @Input()
  professor = new Professor();

  @Input()
  disabled = false;

  @Output()
  onSubmit = new EventEmitter<Professor>();

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

  get canSubmit() {
    return (
      this.form && this.form.valid && this.form.dirty && !this.form.pending
    );
  }

  ngOnChanges({ professor }: SimpleChanges) {
    if (professor) this.criarForm();
  }

  ngOnInit() {
    super.ngOnInit();
    this.criarForm();
  }

  criarForm() {
    this.formSubscription?.unsubscribe();
    this.form = this.professor.criarForm(this.formBuilder);
    this.formSubscription = this.professor.subscribeFormChanges(
      this.form,
      this.takeWhileMounted()
    );
  }

  handleEnterPressed() {
    if (this.titulacaoRef.open) this.titulacaoRef.toggleButton();
    this.handleSubmit();
  }

  handleSubmit() {
    if (this.canSubmit) this.onSubmit.emit(this.professor);
  }
}
