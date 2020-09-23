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

  get formaIngresso(): string {
    switch (this.aluno.formaIngresso) {
      case FormaIngresso.ENADE:
        return $localize`Enade`;
      case FormaIngresso.VESTIBULAR:
        return $localize`Vestibular`;
      default:
        throw new Error(
          `Forma de ingresso desconhecida: "${this.aluno.formaIngresso}"`
        );
    }
  }
}
