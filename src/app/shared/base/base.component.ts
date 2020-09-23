import { OnDestroy, OnInit, Component } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { BehaviorSubject, Observable, MonoTypeOperatorFunction } from 'rxjs';

@Component({ template: '' })
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected mounted = true;
  private mountSubject = new BehaviorSubject(true);

  protected get mounted$(): Observable<boolean> {
    return this.mountSubject.asObservable();
  }

  ngOnInit(): void {
    this.takeWhileMounted = this.takeWhileMounted.bind(this);
  }

  ngOnDestroy(): void {
    this.mounted = false;
    this.mountSubject.next(false);
    this.mountSubject.complete();
  }

  protected takeWhileMounted<T = any>(): MonoTypeOperatorFunction<T> {
    return takeWhile<T>(() => this.mounted);
  }
}
