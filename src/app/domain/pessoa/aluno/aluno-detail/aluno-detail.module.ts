import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoDetailComponent } from './aluno-detail.component';
import { PoInfoModule, PoDividerModule } from '@po-ui/ng-components';

@NgModule({
  imports: [CommonModule, PoInfoModule, PoDividerModule],
  declarations: [AlunoDetailComponent],
  exports: [AlunoDetailComponent],
})
export class AlunoDetailModule {}
