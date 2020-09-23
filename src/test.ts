// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { setupBackend } from 'web-backend-api';
import { backendConfig } from 'backend/config';

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
  };
};

const backend = require.context('./backend/', true, /\.data\.ts$/);
backend.keys().forEach((mod: any) => {
  const { setup } = backend(mod);
  if (setup && typeof setup === 'function') {
    setup([]);
  } else {
    console.warn(
      `Módulo de backend "${mod}" não exporta uma função "setup", a coleção não foi inicializada!`
    );
  }
});

setupBackend(backendConfig, { dbtype: 'memory' }).then(() => {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
  // Then we find all the tests.
  const context = require.context('./', true, /\.spec\.ts$/);
  // And load the modules.
  context.keys().forEach(context);
});
