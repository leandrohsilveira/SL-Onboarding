import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplinaFormComponent } from './disciplina-form.component';
import { PoFieldModule, PoButtonModule } from '@po-ui/ng-components';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldMessagesModule } from 'app/shared/components/field-messages/field-messages.module';
import { FieldContainerModule } from 'app/shared/components/field-container/field-container.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoFieldModule,
    PoButtonModule,
    FieldMessagesModule,
    FieldContainerModule,
  ],
  declarations: [DisciplinaFormComponent],
  exports: [DisciplinaFormComponent],
})
export class DisciplinaFormModule {}
