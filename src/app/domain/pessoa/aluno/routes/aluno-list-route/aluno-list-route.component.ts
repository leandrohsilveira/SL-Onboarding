import { Component } from '@angular/core';
import { AlunoService } from '../../aluno.service';
import { Observable } from 'rxjs';
import {
  Sort,
  PageState,
  PageStateSubject,
} from 'app/shared/util/service.util';
import { Aluno, AlunoSortFields } from '../../aluno';
import { BaseComponent } from 'app/shared/base/base.component';
import { PoPageFilter } from '@po-ui/ng-components';

@Component({
  selector: 'app-aluno-list-route',
  templateUrl: './aluno-list-route.component.html',
  styleUrls: ['./aluno-list-route.component.css'],
})
export class AlunoListRouteComponent extends BaseComponent {
  constructor(private alunoService: AlunoService) {
    super();
    this.pageStateSubject = new PageStateSubject(
      (pageable, filter, sort) =>
        this.alunoService.buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
          pageable,
          filter,
          sort
        ),
      () => this.takeWhileMounted()
    );
    this.pageState$ = this.pageStateSubject.asObservable();
  }

  filtro: PoPageFilter = {
    placeholder: $localize`:Placeholder do campo de busca da página "Lista de alunos":Buscar alunos`,
    action: (filter: string) => this.handleFilterChange(filter),
  };

  pageState$: Observable<PageState<Aluno, AlunoSortFields>>;

  private pageStateSubject: PageStateSubject<Aluno, AlunoSortFields>;

  ngOnInit() {
    super.ngOnInit();
    this.pageStateSubject.load();
  }

  handleOrdenacaoChange(sort: Sort<AlunoSortFields>) {
    this.pageStateSubject.setSort(sort);
  }

  handleCarregarMais() {
    this.pageStateSubject.nextPage();
  }

  handleFilterChange(filter: string) {
    this.pageStateSubject.setFilter(filter);
  }
}
