import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'app/shared/base/base.component';
import { DisciplinaService } from '../../disciplina.service';
import { EventService } from 'app/shared/event/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  PageStateSubject,
  PageState,
  Sort,
} from 'app/shared/util/service.util';
import { PoPageFilter, PoPageAction } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import {
  Disciplina,
  DisciplinaSortFields,
  DisciplinaEvent,
} from '../../disciplina';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-disciplina-list-route',
  templateUrl: './disciplina-list-route.component.html',
})
export class DisciplinaListRouteComponent
  extends BaseComponent
  implements OnInit {
  constructor(
    private disciplinaService: DisciplinaService,
    private eventService: EventService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.pageStateSubject = new PageStateSubject(
      (pageable, query, sort) =>
        this.disciplinaService.filtrar(pageable, query, sort),
      () => this.takeWhileMounted()
    );
    this.pageState$ = this.pageStateSubject.asObservable();
  }

  filtro: PoPageFilter = {
    placeholder: $localize`:Placeholder do campo de busca da página "Disciplinas cadastradas":Buscar disciplinas`,
    action: (query: string) => this.handleFilterChange(query),
  };

  acoes: PoPageAction[] = [
    {
      icon: 'po-icon po-icon-plus',
      label: $localize`:Texto do botão "Novo disciplina" para cadastrar uma nova disciplina, presente na página "Disciplinas cadastradas":Nova disciplina`,
      action: () =>
        this.router.navigate(['new'], { relativeTo: this.activatedRoute }),
    },
  ];

  pageState$: Observable<PageState<Disciplina, DisciplinaSortFields>>;

  private pageStateSubject: PageStateSubject<Disciplina, DisciplinaSortFields>;

  ngOnInit(): void {
    super.ngOnInit();
    this.pageStateSubject.load();
    this.eventService.bus$
      .pipe(
        this.takeWhileMounted(),
        filter((e) => e instanceof DisciplinaEvent),
        map((e) => e as DisciplinaEvent)
      )
      .subscribe(() => this.pageStateSubject.load(true));
  }

  handleEditarClick(item: Disciplina): void {
    this.router.navigate([item.id, 'edit'], {
      relativeTo: this.activatedRoute,
    });
  }

  handleOrdenacaoChange(sort: Sort<DisciplinaSortFields>): void {
    this.pageStateSubject.setSort(sort);
  }

  handleCarregarMais(): void {
    this.pageStateSubject.nextPage();
  }

  handleFilterChange(query: string): void {
    this.pageStateSubject.setFilter(query);
  }
}
