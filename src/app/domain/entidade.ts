import { FormBuilder, FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';

export type Id = string | null;

export abstract class Entidade {
  constructor(public id: Id) {}

  protected abstract getFormControls(): { [key: string]: any };

  protected abstract onChanges(changes: any): void;

  public criarForm(builder: FormBuilder) {
    return builder.group(this.getFormControls());
  }

  public fromForm(form: FormGroup): void {
    this.onChanges(form.getRawValue());
  }

  public subscribeFormChanges(form: FormGroup, shouldContinue = () => true) {
    return form.valueChanges
      .pipe(takeWhile(shouldContinue))
      .subscribe((changes) => this.onChanges(changes));
  }
}
