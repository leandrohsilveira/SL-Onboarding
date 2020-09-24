import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppBackendModule } from 'backend/app-backend.module';
import { DisciplinaService } from './disciplina.service';

@NgModule({
  imports: [CommonModule, HttpClientModule, AppBackendModule.forRoot()],
  providers: [DisciplinaService],
})
export class DisciplinaModule {}
