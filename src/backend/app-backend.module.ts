import { NgModule, ModuleWithProviders } from '@angular/core';

@NgModule({})
export class AppBackendModule {
  static forRoot(): ModuleWithProviders<AppBackendModule> {
    return {
      ngModule: AppBackendModule,
      providers: [],
    };
  }

  static forFeature(): ModuleWithProviders<AppBackendModule> {
    return AppBackendModule.forRoot();
  }
}
