import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/shared/base/base.component';
import { DisciplinaService } from '../../disciplina.service';
import {
  PoNotificationService,
  PoModalComponent,
  PoModalAction,
  PoLookupFilter,
} from '@po-ui/ng-components';
import { Router, ActivatedRoute } from '@angular/router';
import { DisciplinaFormComponent } from '../../disciplina-form/disciplina-form.component';
import { Disciplina } from '../../disciplina';
import { filter, map, switchMap, tap, catchError, delay } from 'rxjs/operators';
import { ProfessorService } from 'app/domain/pessoa/professor/professor.service';
import { ProfessorEvent } from 'app/domain/pessoa/professor/professor';
import { Pageable } from 'app/shared/util/service.util';
import { of, throwError } from 'rxjs';
import { EventService } from 'app/shared/event/event.service';

interface Actions {
  salvar: PoModalAction;
  cancelar: PoModalAction;
}

@Component({
  selector: 'app-disciplina-form-route',
  templateUrl: './disciplina-form-route.component.html',
})
export class DisciplinaFormRouteComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  constructor(
    private disciplinaService: DisciplinaService,
    private professorService: ProfessorService,
    private notificationService: PoNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService
  ) {
    super();
  }

  @ViewChild(PoModalComponent, { static: true })
  modalRef: PoModalComponent;

  @ViewChild('formRef', { static: true })
  formRef: DisciplinaFormComponent;

  processando = false;

  disciplina = new Disciplina();

  podeCancelar = true;

  loading = false;

  service: PoLookupFilter = {
    getFilteredItems: ({ filter: query, page, pageSize }) =>
      this.professorService.filtrar(new Pageable(page, pageSize), query),
    getObjectByValue: (query) => {
      if (this.disciplina.professorRef === query)
        of(this.disciplina.professor).pipe(
          tap(() => (this.loading = false)),
          delay(20)
        );
      this.loading = true;
      return this.professorService.lookup(query).pipe(
        tap(() => (this.loading = false)),
        catchError((error) => {
          this.loading = false;
          return throwError(error);
        })
      );
    },
  };

  get nomeProfessor(): string {
    return this.disciplina?.professor?.nome || '';
  }

  get actions(): Actions {
    return {
      salvar: {
        label: $localize`:Texto do botão "Salvar" da modal (janela) de formulário de disciplina:Salvar`,
        action: () => this.salvar(),
        loading: this.loading || this.processando,
        disabled: !this.formRef.canSubmit,
      },
      cancelar: {
        label: $localize`:Texto do botão "Cancelar" da modal (janela) de formulário de disciplina:Cancelar`,
        action: () => this.cancelar(),
        disabled: !this.podeCancelar,
      },
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.activatedRoute.data
      .pipe(
        this.takeWhileMounted(),
        filter((data) => data.loadFromParam),
        map((data) => data.loadFromParam),
        tap(() => (this.loading = true)),
        switchMap((param) =>
          this.activatedRoute.params.pipe(
            filter((params) => params[param]),
            map((params) => params[param])
          )
        ),
        switchMap((id) => this.disciplinaService.recuperarPorId(id))
      )
      .subscribe((disciplina) => {
        this.disciplina = disciplina;
        if (!disciplina.professor) this.loading = false;
      });
    this.eventService.bus$
      .pipe(
        this.takeWhileMounted(),
        filter((evt) => evt instanceof ProfessorEvent),
        map((evt) => evt as ProfessorEvent),
        filter((evt) => evt.source === 'client' && evt.type === 'cadastrado')
      )
      .subscribe(({ entidade: { id } }) =>
        this.formRef.form.patchValue({ professorRef: id })
      );

    this.modalRef.open();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.modalRef.close();
  }

  cancelar(): void {
    this.retornar();
  }

  salvar(): void {
    this.processando = true;
    this.podeCancelar = false;
    this.disciplinaService
      .salvar(this.disciplina)
      .pipe(this.takeWhileMounted())
      .subscribe(
        () => {
          this.notificationService.success(this.mensagemSucesso);
          this.retornar();
        },
        (error) => {
          this.processando = false;
          this.podeCancelar = true;
          console.error(error);
        }
      );
  }

  handleNovoProfessorClick(): void {
    this.router.navigate(['professor', 'new'], {
      relativeTo: this.activatedRoute,
    });
  }

  private retornar(): void {
    this.router.navigate(this.urlRetorno);
  }

  private get urlRetorno(): string[] {
    return this.activatedRoute.snapshot.data.urlRetorno(this.activatedRoute);
  }

  private get mensagemSucesso(): string {
    return this.activatedRoute.snapshot.data.mensagemSucesso();
  }
}
