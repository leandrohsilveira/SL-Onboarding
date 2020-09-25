import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-field-container',
  templateUrl: './field-container.component.html',
})
export class FieldContainerComponent {
  constructor() {}

  @Input()
  label: string;

  @Input()
  help?: string;
}
