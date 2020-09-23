import { Component } from '@angular/core';
import {
  Professor,
  ProfessorSortFields,
  ProfessorEvent,
} from '../../professor';
import { BaseComponent } from 'app/shared/base/base.component';
import { ProfessorService } from '../../professor.service';
import { EventService } from 'app/shared/event/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  PageStateSubject,
  PageState,
  Sort,
} from 'app/shared/util/service.util';
import { PoPageFilter, PoPageAction } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-professor-list-route',
  templateUrl: './professor-list-route.component.html',
})
export class ProfessorListRouteComponent extends BaseComponent {
  constructor(
    private professorService: ProfessorService,
    private eventService: EventService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.pageStateSubject = new PageStateSubject(
      (pageable, query, sort) =>
        this.professorService.filtrar(pageable, query, sort),
      () => this.takeWhileMounted()
    );
    this.pageState$ = this.pageStateSubject.asObservable();
  }

  filtro: PoPageFilter = {
    placeholder: $localize`:Placeholder do campo de busca da página "Professores cadastrados":Buscar professores`,
    action: (query: string) => this.handleFilterChange(query),
  };

  acoes: PoPageAction[] = [
    {
      icon: 'po-icon po-icon-plus',
      label: $localize`:Texto do botão "Novo professor" para cadastrar um novo professor, presente na página "Professores cadastrados":Novo professor`,
      action: () =>
        this.router.navigate(['new'], { relativeTo: this.activatedRoute }),
    },
  ];

  pageState$: Observable<PageState<Professor, ProfessorSortFields>>;

  private pageStateSubject: PageStateSubject<Professor, ProfessorSortFields>;

  ngOnInit() {
    super.ngOnInit();
    this.pageStateSubject.load();
    this.eventService.bus$
      .pipe(
        this.takeWhileMounted(),
        filter((e) => e instanceof ProfessorEvent),
        map((e) => e as ProfessorEvent)
      )
      .subscribe(() => this.pageStateSubject.load(true));
  }

  handleEditarChange(item: Professor) {
    this.router.navigate([item.id, 'edit'], {
      relativeTo: this.activatedRoute,
    });
  }

  handleOrdenacaoChange(sort: Sort<ProfessorSortFields>) {
    this.pageStateSubject.setSort(sort);
  }

  handleCarregarMais() {
    this.pageStateSubject.nextPage();
  }

  handleFilterChange(query: string) {
    this.pageStateSubject.setFilter(query);
  }
}
