import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoFormComponent } from './aluno-form.component';
import { PoFieldModule, PoButtonModule } from '@po-ui/ng-components';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldMessagesModule } from 'app/shared/components/field-messages/field-messages.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoFieldModule,
    PoButtonModule,
    FieldMessagesModule,
  ],
  declarations: [AlunoFormComponent],
  exports: [AlunoFormComponent],
})
export class AlunoFormModule {}
