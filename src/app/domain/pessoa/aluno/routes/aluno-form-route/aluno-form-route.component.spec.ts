import { TestBed, ComponentFixture, async } from '@angular/core/testing';
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

const imports = [
  CommonModule,
  AlunoModule,
  AlunoFormModule,
  PoModalModule,
  PoLoadingModule,
  RouterModule,
  RouterTestingModule,
];

const declarations = [AlunoFormRouteComponent];

environment.delaySimulado = null;

describe('AlunoFormRouteComponent', () => {
  let component: AlunoFormRouteComponent;
  let fixture: ComponentFixture<AlunoFormRouteComponent>;

  describe('Quando os dados da rota atual possui um "loadFromParam" = "id"', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [...imports],
        declarations,
      }).compileComponents();
      const activatedRoute = TestBed.inject(ActivatedRoute);
      activatedRoute.data = of({
        loadFromParam: 'id',
      });
      activatedRoute.params = of({
        id: alunosMock[0].id,
      });
      fixture = TestBed.createComponent(AlunoFormRouteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    afterEach(() => {
      component.modalRef.close();
    });

    it('A instancia de aluno do componente é igual ao primeiro aluno do array de mocks', () =>
      expect(component.aluno).toEqual(Aluno.fromJson(alunosMock[0])));
  });
});
