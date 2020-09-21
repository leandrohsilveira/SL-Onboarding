import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class AbstractEvent<T = string> {
  constructor(public type: T) {}
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor() {
    this.bus$ = this.subject.asObservable();
  }

  private subject = new Subject<AbstractEvent<any>>();

  bus$: Observable<AbstractEvent>;

  publish<E extends AbstractEvent<T>, T = string>(event: E) {
    this.subject.next(event);
  }
}
