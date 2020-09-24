import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplinaFormComponent } from './disciplina-form.component';
import { PoFieldModule } from '@po-ui/ng-components';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldMessagesModule } from 'app/shared/components/field-messages/field-messages.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoFieldModule,
    FieldMessagesModule,
  ],
  declarations: [DisciplinaFormComponent],
  exports: [DisciplinaFormComponent],
})
export class DisciplinaFormModule {}
