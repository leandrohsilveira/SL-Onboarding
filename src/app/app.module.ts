import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  PoMenuModule,
  PoToolbarModule,
  PoPageModule,
} from '@po-ui/ng-components';
import { AppBackendModule } from 'backend/app-backend.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoMenuModule,
    PoToolbarModule,
    PoPageModule,
    HttpClientModule,
    AppBackendModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
