import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Aluno, FormaIngresso } from '../aluno';
import { PoTableColumn } from '@po-ui/ng-components';
import { CustomLiterals } from 'app/shared/literals';

@Component({
  selector: 'app-aluno-list',
  templateUrl: './aluno-list.component.html',
  styleUrls: ['./aluno-list.component.css'],
})
export class AlunoListComponent implements OnChanges {
  constructor() {}

  @Input()
  alunos: Aluno[] = [];

  @Input()
  count = 0;

  @Input()
  carregando = false;

  @Output('carregarMais')
  onCarregarMais = new EventEmitter<void>();

  carregandoMais = false;

  literals = CustomLiterals.forTable();

  columns: PoTableColumn[] = [
    {
      property: 'matricula',
      label: $localize`:Cabeçalho da coluna "Matrícula" da tabela de alunos:Matrícula`,
      type: 'number',
      width: '70px',
    },
    {
      property: 'nome',
      label: $localize`:Cabeçalho da coluna "Nome" da tabela de alunos:Nome`,
    },
    {
      property: 'email',
      label: $localize`:Cabeçalho da coluna "E-mail" da tabela de alunos:E-mail`,
    },
    {
      property: 'cpfFormatado',
      label: $localize`:Cabeçalho da coluna "CPF" da tabela de alunos:CPF`,
      width: '110px',
    },
    {
      property: 'formaIngresso',
      type: 'label',
      label: $localize`:Cabeçalho da coluna "Forma de ingresso" da tabela de alunos:Forma de ingresso`,
      width: '120px',
      labels: [
        {
          value: FormaIngresso.ENADE,
          color: 'color-05',
          label: $localize`:Valor "ENADE" da coluna "Forma de ingresso" da tabela de alunos:ENADE`,
        },
        {
          value: FormaIngresso.VESTIBULAR,
          color: 'color-10',
          label: $localize`:Valor "Vestibular" da coluna "Forma de ingresso" da tabela de alunos:Vestibular`,
        },
      ],
    },
  ];

  get podeCarregarMais() {
    return this.alunos.length < this.count;
  }

  ngOnChanges({ alunos }: SimpleChanges) {
    if (alunos && this.carregandoMais) this.carregandoMais = false;
  }

  carregarMais() {
    if (this.podeCarregarMais) {
      this.carregandoMais = true;
      this.onCarregarMais.emit();
    }
  }
}
