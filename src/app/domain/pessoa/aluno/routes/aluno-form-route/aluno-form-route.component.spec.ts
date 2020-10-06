import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { AlunoModule } from '../../aluno.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AlunoFormModule } from '../../aluno-form/aluno-form.module';
import { AlunoFormRouteComponent } from './aluno-form-route.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import alunosMock from '../../aluno.mock';
import { PoModalModule, PoLoadingModule } from '@po-ui/ng-components';
import { environment } from 'environments/environment';
import { LoadingIndicatorModule } from 'app/shared/components/loading-indicator/loading-indicator.module';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { insertInitialData } from 'backend/domain/pessoa/aluno/aluno.data';
import { Aluno } from '../../aluno';

environment.delaySimulado = null;

describe('AlunoFormRouteComponent', () => {
  let values: any[];
  let component: AlunoFormRouteComponent;
  let fixture: ComponentFixture<AlunoFormRouteComponent>;

  beforeEach(async () => {
    values = await insertInitialData(alunosMock.slice(0, 40));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserTestingModule,
        HttpClientTestingModule,
        AlunoModule,
        AlunoFormModule,
        PoModalModule,
        PoLoadingModule,
        RouterModule,
        LoadingIndicatorModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: values[0].id,
            }),
            data: of({
              loadFromParam: 'id',
              returnUrl: () => ['url'],
            }),
          },
        },
      ],
      declarations: [AlunoFormRouteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlunoFormRouteComponent);
    component = fixture.componentInstance;
    fixture.whenStable();
  });

  afterEach(async () => {
    component.modalRef.close();
    fixture.detectChanges();
  });

  describe('Quando os dados da rota atual possui um "loadFromParam" = "id"', () => {
    it('A instancia de aluno do componente é igual ao primeiro aluno do array de mocks', () =>
      expect(component.aluno).toEqual(Aluno.fromJson(values[0])));
  });
});
