import { FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs';
import { AbstractEvent } from 'app/shared/event/event.service';

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

export type EntidadeEventType = 'cadastrado' | 'atualizado' | 'removido';

export type EntidadeEventSource = 'client' | 'server';

export class EntidadeEvent<E extends Entidade> extends AbstractEvent<
  EntidadeEventType
> {
  constructor(
    public entidade: E,
    public source: EntidadeEventSource,
    type: EntidadeEventType
  ) {
    super(type);
  }
}
