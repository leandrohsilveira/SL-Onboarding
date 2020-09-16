import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AlunoService } from '../../aluno.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { Page, Pageable, Sort } from 'app/shared/util/service.util';
import { Aluno, AlunoSortFields } from '../../aluno';
import {
  map,
  switchMap,
  startWith,
  tap,
  distinctUntilChanged,
  debounceTime,
  withLatestFrom,
  skip,
} from 'rxjs/operators';
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
  }

  carregando = true;
  podeCarregarMais = false;
  alunos: Aluno[] = [];
  ordenacao = new Sort<AlunoSortFields>('nome', 'asc');
  filtro: PoPageFilter = {
    placeholder: $localize`:Placeholder do campo de busca da página "Lista de alunos":Buscar alunos`,
    action: (q: string) => this.filtroSubject.next(q),
  };

  private pageSubject = new BehaviorSubject(1);
  private pageSizeSubject = new BehaviorSubject(20);
  private filtroSubject = new BehaviorSubject('');
  private ordenacaoSubject: BehaviorSubject<Sort<AlunoSortFields>>;

  ngOnInit() {
    super.ngOnInit();
    this.ordenacaoSubject = new BehaviorSubject(this.ordenacao);
    combineLatest(
      this.pageSubject.pipe(distinctUntilChanged()),
      this.pageSizeSubject.pipe(distinctUntilChanged()),
      this.filtroSubject.pipe(
        distinctUntilChanged(),
        tap(() => (this.alunos = [])),
        tap(() => this.pageSubject.next(1))
      ),
      this.ordenacaoSubject.pipe(tap(() => (this.alunos = [])))
    )
      .pipe(
        this.takeWhileMounted(),
        tap(() => (this.carregando = true)),
        debounceTime(100),
        switchMap(([pagina, limite, filtro, ordenacao]) =>
          this.alunoService.buscarAlunosLikeNomeOuEmailOuCpfOuMatricula(
            new Pageable(pagina, limite),
            filtro,
            ordenacao
          )
        )
      )
      .subscribe(
        (resultado) => {
          this.carregando = false;
          this.alunos = [...this.alunos, ...resultado.items];
          this.podeCarregarMais = resultado.hasNext;
        },
        (err) => {
          this.carregando = false;
          console.error(err);
        }
      );
  }

  handleOrdenacaoChange() {
    this.ordenacaoSubject.next(this.ordenacao);
  }

  handleCarregarMais() {
    this.pageSubject.next(this.pageSubject.value + 1);
  }
}
