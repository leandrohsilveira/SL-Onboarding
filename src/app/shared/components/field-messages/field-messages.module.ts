import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldMessagesComponent } from './field-messages.component';
import { PoPopupModule } from '@po-ui/ng-components';

@NgModule({
  imports: [CommonModule, PoPopupModule],
  declarations: [FieldMessagesComponent],
  exports: [FieldMessagesComponent],
})
export class FieldMessagesModule {}
