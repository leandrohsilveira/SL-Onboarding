import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { PoPopupComponent } from '@po-ui/ng-components';

@Component({
  selector: 'app-field-messages',
  templateUrl: './field-messages.component.html',
  styleUrls: ['./field-messages.component.css'],
})
export class FieldMessagesComponent implements OnChanges {
  constructor() {}

  @Input()
  control: AbstractControl;

  @ViewChild('errorPopup')
  popupComponent?: PoPopupComponent;

  get hidden() {
    return this.control.pristine;
  }

  get errors() {
    return this.control.errors ?? {};
  }

  get errorsCount() {
    return Object.keys(this.errors).length;
  }

  get hasError() {
    return this.errorsCount === 0;
  }

  get singleError() {
    return this.errorsCount === 1;
  }

  ngOnChanges({ control }: SimpleChanges) {
    if (control) {
      if (this.hasError && !this.singleError) this.popupComponent?.open();
      else this.popupComponent?.close();
    }
  }
}
