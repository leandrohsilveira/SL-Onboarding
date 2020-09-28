import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { isValid as isCpfValid } from '@fnando/cpf';
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

export type NotTakenService = (value: string) => Observable<boolean>;

export class CustomValidators {
  public static cpf(control: AbstractControl): { cpf: boolean } | null {
    const value: string = control.value;
    if (value?.length === 11 && !isCpfValid(value)) return { cpf: true };
    return null;
  }

  public static email(control: AbstractControl): { email: boolean } | null {
    if (control.value && !/^.*@.*$/.test(control.value)) {
      return {
        email: true,
      };
    }
    return null;
  }

  public static number(control: AbstractControl): { number: boolean } | null {
    if (
      control.value &&
      (typeof control.value !== 'number' || Number.isNaN(control.value))
    )
      return { number: true };
    return null;
  }

  public static notTakenValidator(
    service: NotTakenService,
    key: string,
    time = 200
  ): AsyncValidatorFn {
    return ({ value }: AbstractControl) =>
      service(value).pipe(
        distinctUntilChanged(),
        debounceTime(time),
        map((notTaken) => (notTaken ? null : { [key]: true }))
      );
  }
}
