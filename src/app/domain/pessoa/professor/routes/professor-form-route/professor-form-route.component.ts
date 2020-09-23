import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {
  PoModalComponent,
  PoNotificationService,
  PoModalAction,
} from '@po-ui/ng-components';
import { BaseComponent } from 'app/shared/base/base.component';
import { ProfessorService } from '../../professor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfessorFormComponent } from '../../professor-form/professor-form.component';
import { Professor } from '../../professor';
import { filter, map, tap, switchMap } from 'rxjs/operators';

interface Actions {
  salvar: PoModalAction;
  cancelar: PoModalAction;
}

@Component({
  selector: 'app-professor-form-route',
  templateUrl: './professor-form-route.component.html',
})
export class ProfessorFormRouteComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  constructor(
    private professorService: ProfessorService,
    private notificationService: PoNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  @ViewChild(PoModalComponent, { static: true })
  modalRef: PoModalComponent;

  @ViewChild('formRef', { static: true })
  formRef: ProfessorFormComponent;

  get actions(): Actions {
    return {
      salvar: {
        label: $localize`:Texto do botão "Salvar" da modal (janela) de formulário de professor:Salvar`,
        action: () => this.salvar(),
        loading: this.loading || this.processando,
        disabled: !this.formRef.canSubmit,
      },
      cancelar: {
        label: $localize`:Texto do botão "Cancelar" da modal (janela) de formulário de professor:Cancelar`,
        action: () => this.cancelar(),
        disabled: !this.podeCancelar,
      },
    };
  }

  processando = false;

  professor = new Professor();

  podeCancelar = true;

  loading = false;

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
        switchMap((id) => this.professorService.recuperarPorId(id))
      )
      .subscribe((professor) => {
        this.loading = false;
        this.professor = professor;
      });

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
    this.professorService
      .salvar(this.professor)
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
