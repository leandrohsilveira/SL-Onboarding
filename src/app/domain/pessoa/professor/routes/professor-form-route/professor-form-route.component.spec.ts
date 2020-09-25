import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ProfessorModule } from '../../professor.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfessorFormModule } from '../../professor-form/professor-form.module';
import { ProfessorFormRouteComponent } from './professor-form-route.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { professoresMock } from '../../professor.mock';
import { Professor } from '../../professor';
import { PoModalModule, PoLoadingModule } from '@po-ui/ng-components';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoadingIndicatorModule } from 'app/shared/components/loading-indicator/loading-indicator.module';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

environment.delaySimulado = null;

describe('ProfessorFormRouteComponent', () => {
  let component: ProfessorFormRouteComponent;
  let fixture: ComponentFixture<ProfessorFormRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ProfessorModule,
        ProfessorFormModule,
        PoModalModule,
        PoLoadingModule,
        RouterModule,
        LoadingIndicatorModule,
        RouterTestingModule,
        BrowserTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [ProfessorFormRouteComponent],
    }).compileComponents();
    const activatedRoute = TestBed.inject(ActivatedRoute);
    const httpClient = TestBed.inject(HttpClient);
    spyOn(httpClient, 'get').and.returnValue(of(professoresMock[0]));
    activatedRoute.data = of({
      loadFromParam: 'id',
      returnUrl: () => ['url'],
    });
    activatedRoute.params = of({
      id: professoresMock[0].id,
    });
    fixture = TestBed.createComponent(ProfessorFormRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(async () => {
    component.modalRef.close();
    fixture.detectChanges();
  });

  describe('Quando os dados da rota atual possui um "loadFromParam" = "id"', () => {
    it('A instancia de professor do componente é igual ao primeiro professor do array de mocks', () =>
      expect(component.professor).toEqual(
        Professor.fromJson(professoresMock[0])
      ));
  });
});
