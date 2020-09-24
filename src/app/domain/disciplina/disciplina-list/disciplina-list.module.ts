import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplinaListComponent } from './disciplina-list.component';
import { PoTableModule, PoColorPaletteModule } from '@po-ui/ng-components';

@NgModule({
  imports: [CommonModule, PoTableModule, PoColorPaletteModule],
  declarations: [DisciplinaListComponent],
  exports: [DisciplinaListComponent],
})
export class DisciplinaListModule {}
