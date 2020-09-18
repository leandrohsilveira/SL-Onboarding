import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Aluno, FormaIngresso } from '../../aluno';
import { PoModalComponent, PoModalAction } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/shared/base/base.component';

@Component({
  selector: 'app-aluno-form-route',
  templateUrl: './aluno-form-route.component.html',
  styleUrls: ['./aluno-form-route.component.css'],
})
export class AlunoFormRouteComponent extends BaseComponent {
  constructor(private router: Router) {
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

  loading = true;

  ngOnInit() {
    super.ngOnInit();
    this.modalRef.open();
    setTimeout(() => {
      this.aluno = new Aluno(
        'uuid1',
        'Teste 1',
        'teste1@totvs.com.br',
        '05141510999',
        FormaIngresso.ENADE,
        1
      );
      this.loading = false;
    }, 2000);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.modalRef.close();
  }

  cancelar() {
    console.log('Cancelando...');
    this.router.navigate(['..']);
  }

  salvar() {
    console.log('Salvando...', this.aluno);
    this.router.navigate(['..']);
  }
}
