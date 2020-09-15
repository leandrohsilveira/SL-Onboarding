import { FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs';

export type Id = string | null;

export abstract class Entidade {
  constructor(public id: Id) {}

  protected abstract onChanges(changes: any): void;

  public fromForm(form: FormGroup): void {
    this.onChanges(form.getRawValue());
  }

  public subscribeFormChanges(
    form: FormGroup,
    shouldContinue: MonoTypeOperatorFunction<any> = takeWhile(() => true),
    onChange?: (value: this) => void
  ) {
    return form.valueChanges.pipe(shouldContinue).subscribe((changes) => {
      this.onChanges(changes);
      if (onChange) onChange(this);
    });
  }
}
