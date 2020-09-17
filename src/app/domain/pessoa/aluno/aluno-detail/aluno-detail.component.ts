import { Component, Input } from '@angular/core';
import { Aluno, FormaIngresso } from '../aluno';

@Component({
  selector: 'app-aluno-detail',
  templateUrl: './aluno-detail.component.html',
})
export class AlunoDetailComponent {
  constructor() {}

  @Input()
  aluno: Aluno;

  get formaIngresso() {
    switch (this.aluno.formaIngresso) {
      case FormaIngresso.ENADE:
        return '';
      case FormaIngresso.VESTIBULAR:
        return '';
      default:
        throw new Error(
          `Forma de ingresso desconhecida: "${this.aluno.formaIngresso}"`
        );
    }
  }
}
