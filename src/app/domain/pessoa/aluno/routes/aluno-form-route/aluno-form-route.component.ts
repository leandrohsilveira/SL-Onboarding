import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
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
import { Observable } from 'rxjs';

interface Actions {
  salvar: PoModalAction;
  cancelar: PoModalAction;
}

@Component({
  selector: 'app-aluno-form-route',
  templateUrl: './aluno-form-route.component.html',
})
export class AlunoFormRouteComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  constructor(
    private alunoService: AlunoService,
    private notificationService: PoNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.cpfNotTaken = this.cpfNotTaken.bind(this);
    this.emailNotTaken = this.emailNotTaken.bind(this);
  }

  @ViewChild(PoModalComponent, { static: true })
  modalRef: PoModalComponent;

  @ViewChild('formRef', { static: true })
  formRef: AlunoFormComponent;

  get actions(): Actions {
    return {
      salvar: {
        label: $localize`:Texto do botão "Salvar" da modal (janela) de formulário de aluno:Salvar`,
        action: () => this.salvar(),
        loading: this.loading || this.processando,
        disabled: !this.formRef.canSubmit,
      },
      cancelar: {
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
        switchMap((id) => this.alunoService.recuperarPorId(id))
      )
      .subscribe((aluno) => {
        this.loading = false;
        this.aluno = aluno;
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

  cpfNotTaken(cpf: string): Observable<boolean> {
    return this.alunoService.cpfNotTaken({
      cpf: cpf?.replace(/(\.|\-)/g, ''),
      id: this.aluno.id ?? '',
    });
  }

  emailNotTaken(email: string): Observable<boolean> {
    return this.alunoService.emailNotTaken({
      email,
      id: this.aluno.id ?? '',
    });
  }

  salvar(): void {
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

  private get urlRetorno(): string[] {
    return this.activatedRoute.snapshot.data.urlRetorno(this.activatedRoute);
  }

  private get mensagemSucesso(): string {
    return this.activatedRoute.snapshot.data.mensagemSucesso();
  }
}
