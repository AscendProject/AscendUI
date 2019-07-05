import { Injectable } from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

interface IBroadcastEvent {
  key: any;
  data?: any;
}

@Injectable()
export class BroadcastService {

  public newEventBus: Subject<IBroadcastEvent>;

  constructor() {
    this.newEventBus = new Subject<IBroadcastEvent>();
  }

  public broadcast(key: any, data?: any) {
    this.newEventBus.next({ key, data });
  }

  public on<T>(key: any): Observable<T> {
    return this.newEventBus.asObservable()
      .filter((event) => event.key === key)
      .map((event) => event.data as T);
  }

}
