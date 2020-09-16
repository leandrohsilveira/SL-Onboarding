/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoListRouteComponent } from './aluno-list-route.component';

describe('AlunoListRouteComponent', () => {
  let component: AlunoListRouteComponent;
  let fixture: ComponentFixture<AlunoListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlunoListRouteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlunoListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
