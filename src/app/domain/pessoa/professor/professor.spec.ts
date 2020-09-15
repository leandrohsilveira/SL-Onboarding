import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Professor, Titulacao } from './professor';

describe('classe Professor', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
    });

    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('Quando instanciado através da função estática "fromJson"', () => {
    let professor: Professor;
    beforeEach(
      () =>
        (professor = Professor.fromJson({
          id: 'uuid',
          nome: 'Teste',
          email: 'teste@totvs.com.br',
          cpf: '17475054047',
          titulacao: 'PHD',
        }))
    );

    it('A prop id é "uuid"', () => {
      expect(professor.id).toEqual('uuid');
    });

    it('A prop nome é "Teste"', () => {
      expect(professor.nome).toEqual('Teste');
    });

    it('A prop email é "teste@totvs.com.br"', () => {
      expect(professor.email).toEqual('teste@totvs.com.br');
    });

    it('A prop cpf é "17475054047"', () => {
      expect(professor.cpf).toEqual('17475054047');
    });

    it('A prop titulacao é Titulacao.PHD', () => {
      expect(professor.titulacao).toEqual(Titulacao.PHD);
    });
  });

  describe('Quando instanciada sem parametros', () => {
    let professor: Professor;

    beforeEach(() => {
      professor = new Professor();
    });

    it('A prop id é nula', () => {
      expect(professor.id).toBeNull();
    });

    it('A prop nome é vazia', () => {
      expect(professor.nome).toEqual('');
    });

    it('A prop email é vazia', () => {
      expect(professor.email).toEqual('');
    });

    it('A prop cpf é vazia', () => {
      expect(professor.cpf).toEqual('');
    });

    it('A prop titulacao é vazia', () => {
      expect(professor.titulacao).toEqual('');
    });

    describe('Quando o método "criarForm" é invocado', () => {
      let formGroup: FormGroup;

      beforeEach(() => {
        formGroup = professor.criarForm(formBuilder);
      });

      it('O campo "nome" possui o valor vazio', () => {
        const valor = formGroup.get('nome').value;
        expect(valor).toEqual('');
      });

      it('O campo "nome" é inválido', () =>
        expect(formGroup.get('nome').valid).toBeFalse());

      it('O campo "email" possui o valor vazio', () => {
        const valor = formGroup.get('email').value;
        expect(valor).toEqual('');
      });

      it('O campo "email" é inválido', () =>
        expect(formGroup.get('email').valid).toBeFalse());

      it('O campo "cpf" possui o valor vazio', () => {
        const valor = formGroup.get('cpf').value;
        expect(valor).toEqual('');
      });

      it('O campo "cpf" é inválido', () =>
        expect(formGroup.get('cpf').valid).toBeFalse());

      it('O campo "titulacao" possui o valor vazio', () => {
        const valor = formGroup.get('titulacao').value;
        expect(valor).toEqual('');
      });

      it('O campo "titulacao" é inválido', () =>
        expect(formGroup.get('titulacao').valid).toBeFalse());

      it('O formlário é invalido', () => {
        expect(formGroup.valid).toBeFalse();
      });

      describe('Quando o método "fromForm" é invocado', () => {
        describe('Após preencher o campo "nome"', () => {
          beforeEach(() => formGroup.patchValue({ nome: 'Teste' }));

          it('A prop "nome" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(professor.nome).toEqual('');
          });

          it('A prop "nome" é alterada para o valor "Teste" após chamar o método "fromForm"', () => {
            professor.fromForm(formGroup);
            expect(professor.nome).toEqual('Teste');
          });
        });

        describe('Após preencher o campo "email"', () => {
          beforeEach(() =>
            formGroup.patchValue({ email: 'teste@totvs.com.br' })
          );

          it('A prop "email" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(professor.email).toEqual('');
          });

          it('A prop "email" é alterada para o valor "teste@totvs.com.br" após chamar o método "fromForm"', () => {
            professor.fromForm(formGroup);
            expect(professor.email).toEqual('teste@totvs.com.br');
          });
        });

        describe('Após preencher o campo "cpf"', () => {
          beforeEach(() => formGroup.patchValue({ cpf: '17475054047' }));

          it('A prop "cpf" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(professor.cpf).toEqual('');
          });

          it('A prop "cpf" é alterada para o valor "17475054047" após chamar o método "fromForm"', () => {
            professor.fromForm(formGroup);
            expect(professor.cpf).toEqual('17475054047');
          });
        });

        describe('Após preencher o campo "titulacao"', () => {
          beforeEach(() => formGroup.patchValue({ titulacao: Titulacao.PHD }));

          it('A prop "titulacao" permanece undefined antes de chamar o método "fromForm"', () => {
            expect(professor.titulacao).toEqual('');
          });

          it('A prop "titulacao" é alterada para o valor Titulacao.PHD após chamar o método "fromForm"', () => {
            professor.fromForm(formGroup);
            expect(professor.titulacao).toEqual(Titulacao.PHD);
          });
        });
      });

      describe('Quando o método "subscribeFormChanges" é invocado', () => {
        let subscripion: Subscription;
        beforeEach(
          () => (subscripion = professor.subscribeFormChanges(formGroup))
        );
        afterEach(() => subscripion.unsubscribe());

        it('Após preencher o campo "nome", a prop "nome" é alterada para o valor "Teste" automaticamente', () => {
          formGroup.patchValue({ nome: 'Teste' });
          expect(professor.nome).toEqual('Teste');
        });

        it('Após preencher o campo "email", a prop "email" é alterada para o valor "teste@totvs.com.br" automaticamente', () => {
          formGroup.patchValue({ email: 'teste@totvs.com.br' });
          expect(professor.email).toEqual('teste@totvs.com.br');
        });

        it('Após preencher o campo "cpf", a prop "cpf" é alterada para o valor "17475054047" automaticamente', () => {
          formGroup.patchValue({ cpf: '17475054047' });
          expect(professor.cpf).toEqual('17475054047');
        });

        it('Após preencher o campo "titulacao", a prop "titulacao" é alterada para o valor Titulacao.PHD automaticamente', () => {
          formGroup.patchValue({ titulacao: Titulacao.PHD });
          expect(professor.titulacao).toEqual(Titulacao.PHD);
        });
      });
    });
  });

  describe('Quando instanciada com todos os parametros', () => {
    let professor: Professor;
    beforeEach(() => {
      professor = new Professor(
        'uuid',
        'Teste',
        'teste@totvs.com.br',
        '17475054047',
        Titulacao.PHD
      );
    });

    it('A prop id é "uuid"', () => {
      expect(professor.id).toEqual('uuid');
    });

    it('A prop nome é "Teste"', () => {
      expect(professor.nome).toEqual('Teste');
    });

    it('A prop email é "teste@totvs.com.br"', () => {
      expect(professor.email).toEqual('teste@totvs.com.br');
    });

    it('A prop cpf é "17475054047"', () => {
      expect(professor.cpf).toEqual('17475054047');
    });

    it('A prop formaIngresso é Titulacao.PHD', () => {
      expect(professor.titulacao).toEqual(Titulacao.PHD);
    });

    describe('Quando o método "criarForm" é invocado', () => {
      let formGroup: FormGroup;

      beforeEach(() => {
        formGroup = professor.criarForm(formBuilder);
      });

      it('O campo "nome" possui o valor "Teste"', () => {
        const valor = formGroup.get('nome').value;
        expect(valor).toEqual('Teste');
      });

      it('O campo "nome" é válido', () =>
        expect(formGroup.get('nome').valid).toBeTrue());

      it('O campo "email" possui o valor "teste@totvs.com.br"', () => {
        const valor = formGroup.get('email').value;
        expect(valor).toEqual('teste@totvs.com.br');
      });

      it('O campo "email" é válido', () =>
        expect(formGroup.get('email').valid).toBeTrue());

      it('O campo "cpf" possui o valor "17475054047"', () => {
        const valor = formGroup.get('cpf').value;
        expect(valor).toEqual('17475054047');
      });

      it('O campo "cpf" é válido', () =>
        expect(formGroup.get('cpf').valid).toBeTrue());

      it('O campo "titulacao" possui o valor Titulacao.PHD', () => {
        const valor = formGroup.get('titulacao').value;
        expect(valor).toEqual(Titulacao.PHD);
      });

      it('O campo "titulacao" é válido', () =>
        expect(formGroup.get('titulacao').valid).toBeTrue());

      it('O formlário é valido', () => {
        expect(formGroup.valid).toBeTrue();
      });
    });
  });
});
