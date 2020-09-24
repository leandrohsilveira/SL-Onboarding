import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import {
  PoTableComponent,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSortType,
} from '@po-ui/ng-components';
import { Disciplina, DisciplinaSortFields } from '../disciplina';
import { Sort } from 'app/shared/util/service.util';
import { CustomLiterals } from 'app/shared/literals';

@Component({
  selector: 'app-disciplina-list',
  templateUrl: './disciplina-list.component.html',
})
export class DisciplinaListComponent implements OnInit, OnChanges {
  @ViewChild('tableRef', { static: true })
  poTable: PoTableComponent;

  @Input()
  disciplinas: Disciplina[] = [];

  @Input()
  podeCarregarMais = false;

  @Input()
  carregando = false;

  @Input()
  ordenar: Sort<DisciplinaSortFields>;

  @Output()
  carregarMais = new EventEmitter<void>();

  @Output()
  ordenarChange = new EventEmitter<Sort<DisciplinaSortFields>>();

  @Output()
  editar = new EventEmitter<Disciplina>();

  carregandoMais = false;

  literals = CustomLiterals.forTable();

  actions: PoTableAction[] = [
    {
      label: $localize`:Texto do botão "Editar" na tabela de disciplinas:Editar`,
      action: (item: Disciplina) => this.editar.emit(item),
      icon: 'po-icon-edit',
    },
  ];

  columns: PoTableColumn[] = [
    {
      property: 'sigla',
      label: $localize`:Cabeçalho da coluna "Sigla" da tabela de disciplinas:Sigla`,
      width: '100px',
    },
    {
      property: 'descricao',
      label: $localize`:Cabeçalho da coluna "Descrição" da tabela de disciplinas:Descrição`,
    },
    {
      property: 'professor',
      type: 'columnTemplate',
    },
    {
      property: 'cargaHoraria',
      label: $localize`:Cabeçalho da coluna "Carga horária" da tabela de disciplinas:Carga horária`,
      type: 'columnTemplate',
      width: '120px',
    },
  ];

  ngOnInit(): void {
    if (this.ordenar)
      this.poTable.sortedColumn = {
        property: this.columns.find(
          (column) => column.property === this.ordenar.field
        ),
        ascending: this.ordenar.ascending,
      };
  }

  handleOrdenar(change: {
    column: PoTableColumn;
    type: PoTableColumnSortType;
  }): void {
    this.ordenarChange.emit(Sort.fromOrderChange<DisciplinaSortFields>(change));
  }

  ngOnChanges({ disciplinas }: SimpleChanges): void {
    if (disciplinas && this.carregandoMais) this.carregandoMais = false;
  }

  handleCarregarMais(): void {
    if (this.podeCarregarMais) {
      this.carregandoMais = true;
      this.carregarMais.emit();
    }
  }
}
