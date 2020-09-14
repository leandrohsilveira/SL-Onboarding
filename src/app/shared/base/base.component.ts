import { OnDestroy, OnInit } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import { Subject } from "rxjs/Subject";

export abstract class BaseComponent implements OnInit, OnDestroy {

  protected mounted = false;
  private mountSubject = new Subject();

  protected get mounted$() {
    return this.mountSubject.asObservable();
  }
  
  ngOnInit() {
    this.mounted = true;
    this.mountSubject.next(true);
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
