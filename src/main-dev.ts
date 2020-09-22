import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { BackendConfigArgs, setupBackend } from 'web-backend-api';

if (environment.production) {
  enableProdMode();
}

declare const require: any;

const backend = require.context('./backend/', true, /\.data\.ts$/);
backend.keys().forEach((mod: any) => {
  const { setup } = backend(mod);
  if (setup && typeof setup === 'function') {
    setup();
  } else {
    console.warn(
      `Módulo de backend "${mod}" não exporta uma função "setup", a coleção não foi inicializada!`
    );
  }
});

const { schema, host, port } = environment.backend;

const backendConfig: BackendConfigArgs = {
  strategyId: 'uuid',
  host: `${schema}://${host}:${port}`,
  apiBase: '',
  passThruUnknownUrl: true,
};

setupBackend(backendConfig, {
  dbtype: 'indexdb',
  databaseName: 'sl-onboarding-db',
})
  .then(() =>
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .then(() => console.log('App is running!'))
  )
  .catch((err) => console.error(err));
