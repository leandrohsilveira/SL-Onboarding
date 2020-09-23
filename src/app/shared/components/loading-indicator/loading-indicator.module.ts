import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from './loading-indicator.component';
import { PoLoadingModule } from '@po-ui/ng-components';

@NgModule({
  imports: [CommonModule, PoLoadingModule],
  declarations: [LoadingIndicatorComponent],
  exports: [LoadingIndicatorComponent],
})
export class LoadingIndicatorModule {}
