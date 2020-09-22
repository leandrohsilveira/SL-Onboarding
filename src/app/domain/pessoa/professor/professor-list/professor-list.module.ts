import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorListComponent } from './professor-list.component';
import { PoTableModule, PoColorPaletteModule } from '@po-ui/ng-components';

@NgModule({
  imports: [CommonModule, PoTableModule, PoColorPaletteModule],
  declarations: [ProfessorListComponent],
  exports: [ProfessorListComponent],
})
export class ProfessorListModule {}
