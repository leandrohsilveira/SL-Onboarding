import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorFormComponent } from './professor-form.component';
import { PoFieldModule } from '@po-ui/ng-components';
import { FieldMessagesModule } from 'app/shared/components/field-messages/field-messages.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PoFieldModule,
    FieldMessagesModule,
    ReactiveFormsModule,
  ],
  declarations: [ProfessorFormComponent],
  exports: [ProfessorFormComponent],
})
export class ProfessorFormModule {}
