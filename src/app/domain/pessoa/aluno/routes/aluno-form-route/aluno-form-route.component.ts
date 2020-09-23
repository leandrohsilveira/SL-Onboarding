import { Component, ViewChild } from '@angular/core';
import { Aluno } from '../../aluno';
import {
  PoModalComponent,
  PoModalAction,
  PoNotificationService,
} from '@po-ui/ng-components';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'app/shared/base/base.component';
import { AlunoService } from '../../aluno.service';
import { map, filter, tap, switchMap } from 'rxjs/operators';
import { AlunoFormComponent } from '../../aluno-form/aluno-form.component';

@Component({
  selector: 'app-aluno-form-route',
  templateUrl: './aluno-form-route.component.html',
})
export class AlunoFormRouteComponent extends BaseComponent {
  constructor(
    private alunoService: AlunoService,
    private notificationService: PoNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  @ViewChild(PoModalComponent, { static: true })
  modalRef: PoModalComponent;

  @ViewChild('formRef', { static: true })
  formRef: AlunoFormComponent;

  get actions() {
    return {
      salvar: <PoModalAction>{
        label: $localize`:Texto do botão "Salvar" da modal (janela) de formulário de aluno:Salvar`,
        action: () => this.salvar(),
        loading: this.loading || this.processando,
        disabled: !this.formRef.canSubmit,
      },
      cancelar: <PoModalAction>{
        label: $localize`:Texto do botão "Cancelar" da modal (janela) de formulário de aluno:Cancelar`,
        action: () => this.cancelar(),
        disabled: !this.podeCancelar,
      },
    };
  }

  processando = false;

  aluno: Aluno = new Aluno();

  podeCancelar = true;

  loading = false;

  ngOnInit() {
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
        switchMap((id) => this.alunoService.recuperarPorId(id))
      )
      .subscribe((aluno) => {
        this.loading = false;
        this.aluno = aluno;
      });

    this.modalRef.open();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.modalRef.close();
  }

  cancelar() {
    this.retornar();
  }

  salvar() {
    this.processando = true;
    this.podeCancelar = false;
    this.alunoService
      .salvar(this.aluno)
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

  private get urlRetorno() {
    return this.activatedRoute.snapshot.data.urlRetorno(this.activatedRoute);
  }

  private get mensagemSucesso() {
    return this.activatedRoute.snapshot.data.mensagemSucesso();
  }
}
