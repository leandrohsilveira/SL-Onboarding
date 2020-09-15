import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoListComponent } from './aluno-list.component';
import { PoTableModule, PoColorPaletteModule } from '@po-ui/ng-components';

@NgModule({
  imports: [CommonModule, PoTableModule, PoColorPaletteModule],
  declarations: [AlunoListComponent],
  exports: [AlunoListComponent],
})
export class AlunoListModule {}
