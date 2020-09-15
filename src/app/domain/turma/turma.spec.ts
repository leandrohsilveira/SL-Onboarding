import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Turma } from './turma';

describe('classe Turma', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
    });

    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('Quando instanciado através da função estática "fromJson"', () => {
    let turma: Turma;
    beforeEach(
      () =>
        (turma = Turma.fromJson({
          id: 'uuid',
          descricao: 'Teste',
          anoLetivo: 2020,
          periodoLetivo: 6,
          numeroVagas: 56,
        }))
    );

    it('A prop id é "uuid"', () => {
      expect(turma.id).toEqual('uuid');
    });

    it('A prop descricao é "Teste"', () => {
      expect(turma.descricao).toEqual('Teste');
    });

    it('A prop anoLetivo é 2020', () => {
      expect(turma.anoLetivo).toEqual(2020);
    });

    it('A prop periodoLetivo é 6', () => {
      expect(turma.periodoLetivo).toEqual(6);
    });

    it('A prop numeroVagas é 56', () => {
      expect(turma.numeroVagas).toEqual(56);
    });
  });

  describe('Quando instanciada sem parametros', () => {
    let turma: Turma;

    beforeEach(() => {
      turma = new Turma();
    });

    it('A prop id é nula', () => {
      expect(turma.id).toBeNull();
    });

    it('A prop descricao é vazia', () => {
      expect(turma.descricao).toEqual('');
    });

    it('A prop anoLetivo é undefined', () => {
      expect(turma.anoLetivo).toBeUndefined();
    });

    it('A prop periodoLetivo é undefined', () => {
      expect(turma.periodoLetivo).toBeUndefined();
    });

    it('A prop numeroVagas é undefined', () => {
      expect(turma.numeroVagas).toBeUndefined();
    });

    describe('Quando o método "criarForm" é invocado', () => {
      let formGroup: FormGroup;

      beforeEach(() => {
        formGroup = turma.criarForm(formBuilder);
      });

      it('O campo "descricao" possui o valor vazio', () => {
        const valor = formGroup.get('descricao').value;
        expect(valor).toEqual('');
      });

      it('O campo "descricao" é inválido', () =>
        expect(formGroup.get('descricao').valid).toBeFalse());

      it('O campo "anoLetivo" possui o valor vazio', () => {
        const valor = formGroup.get('anoLetivo').value;
        expect(valor).toEqual('');
      });

      it('O campo "anoLetivo" é inválido', () =>
        expect(formGroup.get('anoLetivo').valid).toBeFalse());

      it('O campo "periodoLetivo" possui o valor vazio', () => {
        const valor = formGroup.get('periodoLetivo').value;
        expect(valor).toEqual('');
      });

      it('O campo "periodoLetivo" é inválido', () =>
        expect(formGroup.get('periodoLetivo').valid).toBeFalse());

      it('O campo "numeroVagas" possui o valor vazio', () => {
        const valor = formGroup.get('numeroVagas').value;
        expect(valor).toEqual('');
      });

      it('O campo "numeroVagas" é válido', () =>
        expect(formGroup.get('numeroVagas').valid).toBeFalse());

      it('O formlário é invalido', () => {
        expect(formGroup.valid).toBeFalse();
      });

      describe('Quando o método "fromForm" é invocado', () => {
        describe('Após preencher o campo "descricao"', () => {
          beforeEach(() => formGroup.patchValue({ descricao: 'Teste' }));

          it('A prop "descricao" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(turma.descricao).toEqual('');
          });

          it('A prop "descricao" é alterada para o valor "Teste" após chamar o método "fromForm"', () => {
            turma.fromForm(formGroup);
            expect(turma.descricao).toEqual('Teste');
          });
        });

        describe('Após preencher o campo "anoLetivo"', () => {
          beforeEach(() => formGroup.patchValue({ anoLetivo: '2020' }));

          it('A prop "anoLetivo" permanece undefined antes de chamar o método "fromForm"', () => {
            expect(turma.anoLetivo).toBeUndefined();
          });

          it('A prop "anoLetivo" é alterada para o valor 2020 após chamar o método "fromForm"', () => {
            turma.fromForm(formGroup);
            expect(turma.anoLetivo).toEqual(2020);
          });
        });

        describe('Após preencher o campo "periodoLetivo"', () => {
          beforeEach(() => formGroup.patchValue({ periodoLetivo: '6' }));

          it('A prop "periodoLetivo" permanece undefined antes de chamar o método "fromForm"', () => {
            expect(turma.periodoLetivo).toBeUndefined();
          });

          it('A prop "periodoLetivo" é alterada para o valor 6 após chamar o método "fromForm"', () => {
            turma.fromForm(formGroup);
            expect(turma.periodoLetivo).toEqual(6);
          });
        });

        describe('Após preencher o campo "numeroVagas"', () => {
          beforeEach(() => formGroup.patchValue({ numeroVagas: '56' }));

          it('A prop "numeroVagas" permanece undefined antes de chamar o método "fromForm"', () => {
            expect(turma.numeroVagas).toBeUndefined();
          });

          it('A prop "numeroVagas" é alterada para o valor 56 após chamar o método "fromForm"', () => {
            turma.fromForm(formGroup);
            expect(turma.numeroVagas).toEqual(56);
          });
        });
      });

      describe('Quando o método "subscribeFormChanges" é invocado', () => {
        let subscripion: Subscription;
        beforeEach(() => (subscripion = turma.subscribeFormChanges(formGroup)));
        afterEach(() => subscripion.unsubscribe());

        it('Após preencher o campo "descricao", a prop "descricao" é alterada para o valor "Teste" automaticamente', () => {
          formGroup.patchValue({ descricao: 'Teste' });
          expect(turma.descricao).toEqual('Teste');
        });

        it('Após preencher o campo "anoLetivo", a prop "anoLetivo" é alterada para o valor 2020 automaticamente', () => {
          formGroup.patchValue({ anoLetivo: '2020' });
          expect(turma.anoLetivo).toEqual(2020);
        });

        it('Após preencher o campo "periodoLetivo", a prop "periodoLetivo" é alterada para o valor 6 automaticamente', () => {
          formGroup.patchValue({ periodoLetivo: '6' });
          expect(turma.periodoLetivo).toEqual(6);
        });

        it('Após preencher o campo "numeroVagas", a prop "numeroVagas" é alterada para o valor 56 automaticamente', () => {
          formGroup.patchValue({ numeroVagas: '56' });
          expect(turma.numeroVagas).toEqual(56);
        });
      });
    });
  });

  describe('Quando instanciada com todos os parametros', () => {
    let turma: Turma;
    beforeEach(() => {
      turma = new Turma('uuid', 'Teste', 2020, 6, 56);
    });

    it('A prop id é "uuid"', () => {
      expect(turma.id).toEqual('uuid');
    });

    it('A prop descricao é "Teste"', () => {
      expect(turma.descricao).toEqual('Teste');
    });

    it('A prop anoLetivo é 2020', () => {
      expect(turma.anoLetivo).toEqual(2020);
    });

    it('A prop periodoLetivo é 6', () => {
      expect(turma.periodoLetivo).toEqual(6);
    });

    it('A prop numeroVagas é 56', () => {
      expect(turma.numeroVagas).toEqual(56);
    });

    describe('Quando o método "criarForm" é invocado', () => {
      let formGroup: FormGroup;

      beforeEach(() => {
        formGroup = turma.criarForm(formBuilder);
      });

      it('O campo "descricao" possui o valor "Teste"', () => {
        const valor = formGroup.get('descricao').value;
        expect(valor).toEqual('Teste');
      });

      it('O campo "descricao" é válido', () =>
        expect(formGroup.get('descricao').valid).toBeTrue());

      it('O campo "anoLetivo" possui o valor 2020', () => {
        const valor = formGroup.get('anoLetivo').value;
        expect(valor).toEqual(2020);
      });

      it('O campo "anoLetivo" é válido', () =>
        expect(formGroup.get('anoLetivo').valid).toBeTrue());

      it('O campo "periodoLetivo" possui o valor 6', () => {
        const valor = formGroup.get('periodoLetivo').value;
        expect(valor).toEqual(6);
      });

      it('O campo "periodoLetivo" é válido', () =>
        expect(formGroup.get('periodoLetivo').valid).toBeTrue());

      it('O campo "numeroVagas" possui o valor 56', () => {
        const valor = formGroup.get('numeroVagas').value;
        expect(valor).toEqual(56);
      });

      it('O campo "numeroVagas" é válido', () =>
        expect(formGroup.get('numeroVagas').valid).toBeTrue());

      it('O formlário é valido', () => {
        expect(formGroup.valid).toBeTrue();
      });
    });
  });
});
