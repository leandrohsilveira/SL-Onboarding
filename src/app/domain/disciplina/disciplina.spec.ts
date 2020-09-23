import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Disciplina } from './disciplina';
import { Professor, Titulacao } from '../pessoa/professor/professor';

describe('classe Disciplina', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
    });

    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('Quando instanciado através da função estática "fromJson"', () => {
    let disciplina: Disciplina;
    beforeEach(
      () =>
        (disciplina = Disciplina.fromJson({
          id: 'uuid',
          descricao: 'Teste',
          sigla: 'TESTE01',
          cargaHoraria: 40,
          professor: {
            id: 'profUuid',
            nome: 'Professor 1',
            email: 'professor1@totvs.com.br',
            cpf: '36603472058',
            titulacao: 'PHD',
          },
        }))
    );

    it('A prop id é "uuid"', () => {
      expect(disciplina.id).toEqual('uuid');
    });

    it('A prop descricao é "Teste"', () => {
      expect(disciplina.descricao).toEqual('Teste');
    });

    it('A prop sigla é "TESTE01"', () => {
      expect(disciplina.sigla).toEqual('TESTE01');
    });

    it('A prop cargaHoraria é 40', () => {
      expect(disciplina.cargaHoraria).toEqual(40);
    });

    it('A prop professorRef é "profUuid"', () =>
      expect(disciplina.professorRef).toEqual('profUuid'));

    it('A prop professor é preenchida corretamente', () =>
      expect(disciplina.professor).toEqual(
        new Professor(
          'profUuid',
          'Professor 1',
          'professor1@totvs.com.br',
          '36603472058',
          Titulacao.PHD
        )
      ));
  });

  describe('Quando instanciada sem parametros', () => {
    let disciplina: Disciplina;

    beforeEach(() => {
      disciplina = new Disciplina();
    });

    it('A prop id é nula', () => {
      expect(disciplina.id).toBeNull();
    });

    it('A prop descricao é vazia', () => {
      expect(disciplina.descricao).toEqual('');
    });

    it('A prop sigla é vazia', () => {
      expect(disciplina.sigla).toEqual('');
    });

    it('A prop cargaHoraria é undefined', () => {
      expect(disciplina.cargaHoraria).toBeUndefined();
    });

    it('A prop professorRef é undefined', () =>
      expect(disciplina.professorRef).toBeUndefined());

    it('A prop professor é undefined', () =>
      expect(disciplina.professor).toBeUndefined());

    describe('Quando o método "criarForm" é invocado', () => {
      let formGroup: FormGroup;

      beforeEach(() => {
        formGroup = disciplina.criarForm(formBuilder);
      });

      it('O campo "descricao" possui o valor vazio', () => {
        const valor = formGroup.get('descricao').value;
        expect(valor).toEqual('');
      });

      it('O campo "descricao" é inválido', () =>
        expect(formGroup.get('descricao').valid).toBeFalse());

      it('O campo "sigla" possui o valor vazio', () => {
        const valor = formGroup.get('sigla').value;
        expect(valor).toEqual('');
      });

      it('O campo "sigla" é inválido', () =>
        expect(formGroup.get('sigla').valid).toBeFalse());

      it('O campo "cargaHoraria" possui o valor vazio', () => {
        const valor = formGroup.get('cargaHoraria').value;
        expect(valor).toEqual('');
      });

      it('O campo "cargaHoraria" é inválido', () =>
        expect(formGroup.get('cargaHoraria').valid).toBeFalse());

      it('O formlário é invalido', () => {
        expect(formGroup.valid).toBeFalse();
      });

      describe('Quando o método "fromForm" é invocado', () => {
        describe('Após preencher o campo "descricao"', () => {
          beforeEach(() => formGroup.patchValue({ descricao: 'Teste' }));

          it('A prop "descricao" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(disciplina.descricao).toEqual('');
          });

          it('A prop "descricao" é alterada para o valor "Teste" após chamar o método "fromForm"', () => {
            disciplina.fromForm(formGroup);
            expect(disciplina.descricao).toEqual('Teste');
          });
        });

        describe('Após preencher o campo "sigla"', () => {
          beforeEach(() => formGroup.patchValue({ sigla: 'TESTE01' }));

          it('A prop "sigla" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(disciplina.sigla).toEqual('');
          });

          it('A prop "sigla" é alterada para o valor "TESTE01" após chamar o método "fromForm"', () => {
            disciplina.fromForm(formGroup);
            expect(disciplina.sigla).toEqual('TESTE01');
          });
        });

        describe('Após preencher o campo "cargaHoraria"', () => {
          beforeEach(() => formGroup.patchValue({ cargaHoraria: '40' }));

          it('A prop "cargaHoraria" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(disciplina.cargaHoraria).toBeUndefined();
          });

          it('A prop "cargaHoraria" é alterada para o valor 40 após chamar o método "fromForm"', () => {
            disciplina.fromForm(formGroup);
            expect(disciplina.cargaHoraria).toEqual(40);
          });
        });
      });

      describe('Quando o método "subscribeFormChanges" é invocado', () => {
        let subscripion: Subscription;
        beforeEach(
          () => (subscripion = disciplina.subscribeFormChanges(formGroup))
        );
        afterEach(() => subscripion.unsubscribe());

        it('Após preencher o campo "descricao", a prop "descricao" é alterada para o valor "Teste" automaticamente', () => {
          formGroup.patchValue({ descricao: 'Teste' });
          expect(disciplina.descricao).toEqual('Teste');
        });

        it('Após preencher o campo "sigla", a prop "sigla" é alterada para o valor "TESTE01" automaticamente', () => {
          formGroup.patchValue({ sigla: 'TESTE01' });
          expect(disciplina.sigla).toEqual('TESTE01');
        });

        it('Após preencher o campo "cargaHoraria", a prop "cargaHoraria" é alterada para o valor "40" automaticamente', () => {
          formGroup.patchValue({ cargaHoraria: '40' });
          expect(disciplina.cargaHoraria).toEqual(40);
        });
      });
    });
  });

  describe('Quando instanciada com todos os parametros', () => {
    let disciplina: Disciplina;
    beforeEach(() => {
      disciplina = new Disciplina(
        'uuid',
        'Teste',
        'TESTE01',
        40,
        new Professor(
          'profUuid',
          'Professor 1',
          'professor1@totvs.com.br',
          '36603472058',
          Titulacao.PHD
        )
      );
    });

    it('A prop id é "uuid"', () => {
      expect(disciplina.id).toEqual('uuid');
    });

    it('A prop descricao é "Teste"', () => {
      expect(disciplina.descricao).toEqual('Teste');
    });

    it('A prop sigla é "TESTE01"', () => {
      expect(disciplina.sigla).toEqual('TESTE01');
    });

    it('A prop cargaHoraria é 40', () => {
      expect(disciplina.cargaHoraria).toEqual(40);
    });

    describe('Quando o método "criarForm" é invocado', () => {
      let formGroup: FormGroup;

      beforeEach(() => {
        formGroup = disciplina.criarForm(formBuilder);
      });

      it('O campo "descricao" possui o valor "Teste"', () => {
        const valor = formGroup.get('descricao').value;
        expect(valor).toEqual('Teste');
      });

      it('O campo "descricao" é válido', () =>
        expect(formGroup.get('descricao').valid).toBeTrue());

      it('O campo "sigla" possui o valor "TESTE01"', () => {
        const valor = formGroup.get('sigla').value;
        expect(valor).toEqual('TESTE01');
      });

      it('O campo "sigla" é válido', () =>
        expect(formGroup.get('sigla').valid).toBeTrue());

      it('O campo "cargaHoraria" possui o valor 40', () => {
        const valor = formGroup.get('cargaHoraria').value;
        expect(valor).toEqual(40);
      });

      it('O campo "cargaHoraria" é válido', () =>
        expect(formGroup.get('cargaHoraria').valid).toBeTrue());

      it('O formlário é valido', () => {
        expect(formGroup.valid).toBeTrue();
      });
    });
  });
});
