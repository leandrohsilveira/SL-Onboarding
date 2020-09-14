import { AbstractControl } from '@angular/forms';
import { isValid as isCpfValid } from '@fnando/cpf';

export class CustomValidators {
  public static cpf(control: AbstractControl) {
    const value: string = control.value;
    if (value?.length === 11 && !isCpfValid(value)) return { cpf: true };
    return null;
  }

  public static email(control: AbstractControl) {
    if (control.value && !/^.*@.*$/.test(control.value)) {
      return {
        email: true,
      };
    }
    return null;
  }

  public static number(control: AbstractControl) {
    if (
      control.value &&
      (typeof control.value !== 'number' || Number.isNaN(control.value))
    )
      return { number: true };
    return null;
  }
}
