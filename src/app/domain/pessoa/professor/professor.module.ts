import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppBackendModule } from 'backend/app-backend.module';
import { ProfessorService } from './professor.service';

@NgModule({
  imports: [CommonModule, HttpClientModule, AppBackendModule.forFeature()],
  providers: [ProfessorService],
})
export class ProfessorModule {}
