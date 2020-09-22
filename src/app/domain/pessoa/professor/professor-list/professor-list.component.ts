import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import {
  PoTableComponent,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSortType,
} from '@po-ui/ng-components';
import { Professor, ProfessorSortFields, Titulacao } from '../professor';
import { Sort } from 'app/shared/util/service.util';
import { CustomLiterals } from 'app/shared/literals';

@Component({
  selector: 'app-professor-list',
  templateUrl: './professor-list.component.html',
})
export class ProfessorListComponent implements OnInit {
  constructor() {}

  @ViewChild('tableRef', { static: true })
  poTable: PoTableComponent;

  @Input()
  professores: Professor[] = [];

  @Input()
  podeCarregarMais = false;

  @Input()
  carregando = false;

  @Input()
  ordenar: Sort<ProfessorSortFields>;

  @Output('carregarMais')
  onCarregarMais = new EventEmitter<void>();

  @Output()
  ordenarChange = new EventEmitter<Sort<ProfessorSortFields>>();

  @Output()
  editar = new EventEmitter<Professor>();

  carregandoMais = false;

  literals = CustomLiterals.forTable();

  actions: PoTableAction[] = [
    {
      label: $localize`:Texto do botão "Editar" na tabela de professores:Editar`,
      action: (item: Professor) => this.editar.emit(item),
    },
  ];

  columns: PoTableColumn[] = [
    {
      property: 'nome',
      label: $localize`:Cabeçalho da coluna "Nome" da tabela de professores:Nome`,
    },
    {
      property: 'email',
      label: $localize`:Cabeçalho da coluna "E-mail" da tabela de professores:E-mail`,
    },
    {
      property: 'cpfFormatado',
      label: $localize`:Cabeçalho da coluna "CPF" da tabela de professores:CPF`,
      width: '140px',
    },
    {
      property: 'titulacao',
      type: 'label',
      label: $localize`:Cabeçalho da coluna "Titulação" da tabela de professores:Titulação`,
      width: '140px',
      labels: [
        {
          value: Titulacao.PHD,
          color: 'color-05',
          label: $localize`:Valor "PHD" da coluna "Titulação" da tabela de professores:PHD`,
        },
        {
          value: Titulacao.DOUTOR,
          color: 'color-10',
          label: $localize`:Valor "Doutor" da coluna "Titulação" da tabela de professores:Doutor`,
        },
        {
          value: Titulacao.MESTRE,
          color: 'color-01',
          label: $localize`:Valor "Mestre" da coluna "Titulação" da tabela de professores:Mestre`,
        },
      ],
    },
  ];

  ngOnInit() {
    console.log(this.professores);
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
      Sort.fromOrderChange<ProfessorSortFields>(change, { cpfFormatado: 'cpf' })
    );
  }

  ngOnChanges({ professores }: SimpleChanges) {
    if (professores && this.carregandoMais) this.carregandoMais = false;
  }

  carregarMais() {
    if (this.podeCarregarMais) {
      this.carregandoMais = true;
      this.onCarregarMais.emit();
    }
  }
}
