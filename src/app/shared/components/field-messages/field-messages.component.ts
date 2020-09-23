import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
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

  get hidden(): boolean {
    return this.control.pristine;
  }

  get errors(): ValidationErrors {
    return this.control.errors ?? {};
  }

  get errorsCount(): number {
    return Object.keys(this.errors).length;
  }

  get hasError(): boolean {
    return this.errorsCount === 0;
  }

  get singleError(): boolean {
    return this.errorsCount === 1;
  }

  ngOnChanges({ control }: SimpleChanges): void {
    if (control) {
      if (this.hasError && !this.singleError) this.popupComponent?.open();
      else this.popupComponent?.close();
    }
  }
}
