import { NgModule } from '@angular/core';
import { AlunoService } from './aluno.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppBackendModule } from 'backend/app-backend.module';

@NgModule({
  imports: [CommonModule, HttpClientModule, AppBackendModule.forFeature()],
  providers: [AlunoService],
})
export class AlunoModule {}
