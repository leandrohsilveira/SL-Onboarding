import { OnDestroy, OnInit, Component } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({ template: '' })
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected mounted = true;
  private mountSubject = new BehaviorSubject(true);

  protected get mounted$() {
    return this.mountSubject.asObservable();
  }

  ngOnInit() {
    this.takeWhileMounted = this.takeWhileMounted.bind(this);
  }

  ngOnDestroy() {
    this.mounted = false;
    this.mountSubject.next(false);
    this.mountSubject.complete();
  }

  protected takeWhileMounted() {
    return takeWhile<any>(() => this.mounted);
  }
}
