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
import { PoPageFilter, PoPageAction } from '@po-ui/ng-components';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  ActivationEnd,
  RoutesRecognized,
} from '@angular/router';
import {
  map,
  filter,
  withLatestFrom,
  tap,
  distinctUntilChanged,
} from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-aluno-list-route',
  templateUrl: './aluno-list-route.component.html',
})
export class AlunoListRouteComponent extends BaseComponent {
  constructor(
    private alunoService: AlunoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.pageStateSubject = new PageStateSubject(
      (pageable, query, sort) =>
        this.alunoService.buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
          pageable,
          query,
          sort
        ),
      () => this.takeWhileMounted()
    );
    this.pageState$ = this.pageStateSubject.asObservable();
  }

  filtro: PoPageFilter = {
    placeholder: $localize`:Placeholder do campo de busca da página "Lista de alunos":Buscar alunos`,
    action: (query: string) => this.handleFilterChange(query),
  };

  acoes: PoPageAction[] = [
    {
      icon: 'po-icon po-icon-plus',
      label: $localize`:Texto do botão "Novo aluno" para cadastrar um novo aluno, presente na página Lista de alunos:Novo aluno`,
      action: () =>
        this.router.navigate(['new'], { relativeTo: this.activatedRoute }),
    },
  ];

  pageState$: Observable<PageState<Aluno, AlunoSortFields>>;

  private pageStateSubject: PageStateSubject<Aluno, AlunoSortFields>;

  ngOnInit() {
    super.ngOnInit();
    this.pageStateSubject.load();
    this.alunoService.events$
      .pipe(this.takeWhileMounted())
      .subscribe(() => this.pageStateSubject.load(true));
  }

  handleOrdenacaoChange(sort: Sort<AlunoSortFields>) {
    this.pageStateSubject.setSort(sort);
  }

  handleCarregarMais() {
    this.pageStateSubject.nextPage();
  }

  handleFilterChange(query: string) {
    this.pageStateSubject.setFilter(query);
  }
}
