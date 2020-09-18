import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Aluno, FormaIngresso } from '../../aluno';
import { PoModalComponent, PoModalAction } from '@po-ui/ng-components';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'app/shared/base/base.component';
import { AlunoService } from '../../aluno.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-aluno-form-route',
  templateUrl: './aluno-form-route.component.html',
  styleUrls: ['./aluno-form-route.component.css'],
})
export class AlunoFormRouteComponent extends BaseComponent {
  constructor(
    private alunoService: AlunoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  @ViewChild(PoModalComponent, { static: true })
  modalRef: PoModalComponent;

  get actions() {
    return {
      salvar: <PoModalAction>{
        label: $localize`:Texto do botão "Salvar" da modal (janela) de formulário de aluno:Salvar`,
        action: () => this.salvar(),
        loading: this.loading,
      },
      cancelar: <PoModalAction>{
        label: $localize`:Texto do botão "Cancelar" da modal (janela) de formulário de aluno:Cancelar`,
        action: () => this.cancelar(),
        disabled: !this.podeCancelar,
      },
    };
  }

  aluno: Aluno = new Aluno();

  podeCancelar = true;

  loading = false;

  ngOnInit() {
    super.ngOnInit();
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
    this.loading = true;
    this.alunoService
      .salvar(this.aluno)
      .pipe(this.takeWhileMounted())
      .subscribe(
        () => this.retornar(),
        (error) => {
          this.loading = false;
          console.error(error);
        }
      );
  }

  private retornar(): void {
    this.router.navigate(this.returnUrl, { relativeTo: this.activatedRoute });
  }

  private get returnUrl() {
    return this.activatedRoute.snapshot.data.returnUrl;
  }
}
