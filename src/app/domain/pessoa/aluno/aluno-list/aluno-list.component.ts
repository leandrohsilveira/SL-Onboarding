import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Aluno, FormaIngresso, AlunoSortFields } from '../aluno';
import {
  PoTableColumn,
  PoTableComponent,
  PoTableColumnSortType,
  PoTableAction,
} from '@po-ui/ng-components';
import { CustomLiterals } from 'app/shared/literals';
import { Sort } from 'app/shared/util/service.util';

@Component({
  selector: 'app-aluno-list',
  templateUrl: './aluno-list.component.html',
})
export class AlunoListComponent implements OnChanges, OnInit {
  constructor() {}

  @ViewChild('tableRef', { static: true })
  poTable: PoTableComponent;

  @Input()
  alunos: Aluno[] = [];

  @Input()
  podeCarregarMais = false;

  @Input()
  carregando = false;

  @Input()
  ordenar: Sort<AlunoSortFields>;

  @Output('carregarMais')
  onCarregarMais = new EventEmitter<void>();

  @Output()
  ordenarChange = new EventEmitter<Sort<AlunoSortFields>>();

  @Output()
  editar = new EventEmitter<Aluno>();

  carregandoMais = false;

  literals = CustomLiterals.forTable();

  actions: PoTableAction[] = [
    {
      label: $localize`:Texto do botão "Editar" na tabela de alunos:Editar`,
      action: (item: Aluno) => this.editar.emit(item),
    },
  ];

  columns: PoTableColumn[] = [
    {
      property: 'matricula',
      label: $localize`:Cabeçalho da coluna "Matrícula" da tabela de alunos:Matrícula`,
      type: 'number',
      width: '80px',
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
      width: '140px',
    },
    {
      property: 'formaIngresso',
      type: 'label',
      label: $localize`:Cabeçalho da coluna "Forma de ingresso" da tabela de alunos:Forma de ingresso`,
      width: '140px',
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

  ngOnInit() {
    if (this.ordenar)
      this.poTable.sortedColumn = {
        property: this.columns.find(
          (column) => column.property === this.ordenar.field
        ),
        ascending: this.ordenar.ascending,
      };
  }

  onOrdenar(change: { column: PoTableColumn; type: PoTableColumnSortType }) {
    this.ordenarChange.emit(
      Sort.fromOrderChange<AlunoSortFields>(change, { cpfFormatado: 'cpf' })
    );
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
