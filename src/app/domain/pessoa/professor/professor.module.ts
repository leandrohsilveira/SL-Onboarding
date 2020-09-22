import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorComponent } from './professor.component';
import { HttpClientModule } from '@angular/common/http';
import { AppBackendModule } from 'backend/app-backend.module';
import { ProfessorService } from './professor.service';

@NgModule({
  imports: [CommonModule, HttpClientModule, AppBackendModule.forFeature()],
  providers: [ProfessorService],
  declarations: [ProfessorComponent]
})
export class ProfessorModule {}
