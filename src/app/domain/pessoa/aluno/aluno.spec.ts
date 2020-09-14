import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Aluno, FormaIngresso } from './aluno';

describe('Sobre o módulo aluno.ts, classe Aluno', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
    });

    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('Quando instanciado através da função estática "fromJson"', () => {
    let aluno: Aluno;
    beforeEach(
      () =>
        (aluno = Aluno.fromJson({
          id: 'uuid',
          nome: 'Teste',
          email: 'teste@totvs.com.br',
          cpf: '17475054047',
          formaIngresso: 'ENADE',
          matricula: 56,
        }))
    );

    it('A prop id é "uuid"', () => {
      expect(aluno.id).toEqual('uuid');
    });

    it('A prop nome é "Teste"', () => {
      expect(aluno.nome).toEqual('Teste');
    });

    it('A prop email é "teste@totvs.com.br"', () => {
      expect(aluno.email).toEqual('teste@totvs.com.br');
    });

    it('A prop cpf é "17475054047"', () => {
      expect(aluno.cpf).toEqual('17475054047');
    });

    it('A prop matricula é 56', () => {
      expect(aluno.matricula).toEqual(56);
    });

    it('A prop formaIngresso é FormaIngresso.ENADE', () => {
      expect(aluno.formaIngresso).toEqual(FormaIngresso.ENADE);
    });
  });

  describe('Quando instanciada sem parametros', () => {
    let aluno: Aluno;

    beforeEach(() => {
      aluno = new Aluno();
    });

    it('A prop id é nula', () => {
      expect(aluno.id).toBeNull();
    });

    it('A prop nome é vazia', () => {
      expect(aluno.nome).toEqual('');
    });

    it('A prop email é vazia', () => {
      expect(aluno.email).toEqual('');
    });

    it('A prop cpf é vazia', () => {
      expect(aluno.cpf).toEqual('');
    });

    it('A prop matricula é undefined', () => {
      expect(aluno.matricula).toBeUndefined();
    });

    it('A prop formaIngresso é vazia', () => {
      expect(aluno.formaIngresso).toEqual('');
    });

    describe('Quando o método "criarForm" é invocado', () => {
      let formGroup: FormGroup;

      beforeEach(() => {
        formGroup = aluno.criarForm(formBuilder);
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

      it('O campo "matricula" possui o valor vazio', () => {
        const valor = formGroup.get('matricula').value;
        expect(valor).toEqual('');
      });

      it('O campo "matricula" é válido', () =>
        expect(formGroup.get('matricula').valid).toBeFalse());

      it('O campo "formaIngresso" possui o valor vazio', () => {
        const valor = formGroup.get('formaIngresso').value;
        expect(valor).toEqual('');
      });

      it('O campo "formaIngresso" é inválido', () =>
        expect(formGroup.get('formaIngresso').valid).toBeFalse());

      it('O formlário é invalido', () => {
        expect(formGroup.valid).toBeFalse();
      });

      describe('Quando o método "fromForm" é invocado', () => {
        describe('Após preencher o campo "nome"', () => {
          beforeEach(() => formGroup.patchValue({ nome: 'Teste' }));

          it('A prop "nome" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(aluno.nome).toEqual('');
          });

          it('A prop "nome" é alterada para o valor "Teste" após chamar o método "fromForm"', () => {
            aluno.fromForm(formGroup);
            expect(aluno.nome).toEqual('Teste');
          });
        });

        describe('Após preencher o campo "email"', () => {
          beforeEach(() =>
            formGroup.patchValue({ email: 'teste@totvs.com.br' })
          );

          it('A prop "email" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(aluno.email).toEqual('');
          });

          it('A prop "email" é alterada para o valor "teste@totvs.com.br" após chamar o método "fromForm"', () => {
            aluno.fromForm(formGroup);
            expect(aluno.email).toEqual('teste@totvs.com.br');
          });
        });

        describe('Após preencher o campo "cpf"', () => {
          beforeEach(() => formGroup.patchValue({ cpf: '17475054047' }));

          it('A prop "cpf" permanece vazia antes de chamar o método "fromForm"', () => {
            expect(aluno.cpf).toEqual('');
          });

          it('A prop "cpf" é alterada para o valor "17475054047" após chamar o método "fromForm"', () => {
            aluno.fromForm(formGroup);
            expect(aluno.cpf).toEqual('17475054047');
          });
        });

        describe('Após preencher o campo "matricula"', () => {
          beforeEach(() => formGroup.patchValue({ matricula: '56' }));

          it('A prop "matricula" permanece undefined antes de chamar o método "fromForm"', () => {
            expect(aluno.matricula).toBeUndefined();
          });

          it('A prop "matricula" é alterada para o valor 56 após chamar o método "fromForm"', () => {
            aluno.fromForm(formGroup);
            expect(aluno.matricula).toEqual(56);
          });
        });

        describe('Após preencher o campo "formaIngresso"', () => {
          beforeEach(() =>
            formGroup.patchValue({ formaIngresso: FormaIngresso.ENADE })
          );

          it('A prop "formaIngresso" permanece undefined antes de chamar o método "fromForm"', () => {
            expect(aluno.formaIngresso).toEqual('');
          });

          it('A prop "formaIngresso" é alterada para o valor FormaIngresso.ENADE após chamar o método "fromForm"', () => {
            aluno.fromForm(formGroup);
            expect(aluno.formaIngresso).toEqual(FormaIngresso.ENADE);
          });
        });
      });

      describe('Quando o método "subscribeFormChanges" é invocado', () => {
        let subscripion: Subscription;
        beforeEach(() => (subscripion = aluno.subscribeFormChanges(formGroup)));
        afterEach(() => subscripion.unsubscribe());

        it('Após preencher o campo "nome", a prop "nome" é alterada para o valor "Teste" automaticamente', () => {
          formGroup.patchValue({ nome: 'Teste' });
          expect(aluno.nome).toEqual('Teste');
        });

        it('Após preencher o campo "email", a prop "email" é alterada para o valor "teste@totvs.com.br" automaticamente', () => {
          formGroup.patchValue({ email: 'teste@totvs.com.br' });
          expect(aluno.email).toEqual('teste@totvs.com.br');
        });

        it('Após preencher o campo "cpf", a prop "cpf" é alterada para o valor "17475054047" automaticamente', () => {
          formGroup.patchValue({ cpf: '17475054047' });
          expect(aluno.cpf).toEqual('17475054047');
        });

        it('Após preencher o campo "matricula", a prop "matricula" é alterada para o valor 56 automaticamente', () => {
          formGroup.patchValue({ matricula: '56' });
          expect(aluno.matricula).toEqual(56);
        });

        it('Após preencher o campo "formaIngresso", a prop "formaIngresso" é alterada para o valor FormaIngresso.ENADE automaticamente', () => {
          formGroup.patchValue({ formaIngresso: FormaIngresso.ENADE });
          expect(aluno.formaIngresso).toEqual(FormaIngresso.ENADE);
        });
      });
    });
  });

  describe('Quando instanciada com todos os parametros', () => {
    let aluno: Aluno;
    beforeEach(() => {
      aluno = new Aluno(
        'uuid',
        'Teste',
        'teste@totvs.com.br',
        '17475054047',
        FormaIngresso.ENADE,
        56
      );
    });

    it('A prop id é "uuid"', () => {
      expect(aluno.id).toEqual('uuid');
    });

    it('A prop nome é "Teste"', () => {
      expect(aluno.nome).toEqual('Teste');
    });

    it('A prop email é "teste@totvs.com.br"', () => {
      expect(aluno.email).toEqual('teste@totvs.com.br');
    });

    it('A prop cpf é "17475054047"', () => {
      expect(aluno.cpf).toEqual('17475054047');
    });

    it('A prop matricula é 56', () => {
      expect(aluno.matricula).toEqual(56);
    });

    it('A prop formaIngresso é FormaIngresso.ENADE', () => {
      expect(aluno.formaIngresso).toEqual(FormaIngresso.ENADE);
    });

    describe('Quando o método "criarForm" é invocado', () => {
      let formGroup: FormGroup;

      beforeEach(() => {
        formGroup = aluno.criarForm(formBuilder);
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

      it('O campo "matricula" possui o valor 56', () => {
        const valor = formGroup.get('matricula').value;
        expect(valor).toEqual(56);
      });

      it('O campo "matricula" é válido', () =>
        expect(formGroup.get('matricula').valid).toBeTrue());

      it('O campo "formaIngresso" possui o valor FormaIngresso.ENADE', () => {
        const valor = formGroup.get('formaIngresso').value;
        expect(valor).toEqual(FormaIngresso.ENADE);
      });

      it('O campo "formaIngresso" é válido', () =>
        expect(formGroup.get('formaIngresso').valid).toBeTrue());

      it('O formlário é valido', () => {
        expect(formGroup.valid).toBeTrue();
      });
    });
  });
});
