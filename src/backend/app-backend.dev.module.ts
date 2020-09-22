import { ModuleWithProviders, NgModule } from '@angular/core';
import { WebBackendApiModule } from 'web-backend-api';

@NgModule({})
export class AppBackendModule {
  static forRoot(): ModuleWithProviders<WebBackendApiModule> {
    return WebBackendApiModule.forRoot();
  }

  static forFeature(): ModuleWithProviders<WebBackendApiModule> {
    return WebBackendApiModule.forFeature();
  }
}
