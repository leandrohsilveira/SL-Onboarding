import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { AlunoModule } from '../../aluno.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AlunoFormModule } from '../../aluno-form/aluno-form.module';
import { AlunoFormRouteComponent } from './aluno-form-route.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import alunosMock from '../../aluno.mock';
import { Aluno } from '../../aluno';
import { PoModalModule, PoLoadingModule } from '@po-ui/ng-components';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

environment.delaySimulado = null;

describe('AlunoFormRouteComponent', () => {
  let component: AlunoFormRouteComponent;
  let fixture: ComponentFixture<AlunoFormRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        AlunoModule,
        AlunoFormModule,
        PoModalModule,
        PoLoadingModule,
        RouterModule,
        RouterTestingModule,
      ],
      declarations: [AlunoFormRouteComponent],
    }).compileComponents();
    const activatedRoute = TestBed.inject(ActivatedRoute);
    const httpClient = TestBed.inject(HttpClient);
    spyOn(httpClient, 'get').and.returnValue(of(alunosMock[0]));
    activatedRoute.data = of({
      loadFromParam: 'id',
      returnUrl: () => ['url'],
    });
    activatedRoute.params = of({
      id: alunosMock[0].id,
    });
    fixture = TestBed.createComponent(AlunoFormRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(async () => {
    component.modalRef.close();
    fixture.detectChanges();
  });

  describe('Quando os dados da rota atual possui um "loadFromParam" = "id"', () => {
    it('A instancia de aluno do componente é igual ao primeiro aluno do array de mocks', () =>
      expect(component.aluno).toEqual(Aluno.fromJson(alunosMock[0])));
  });
});
