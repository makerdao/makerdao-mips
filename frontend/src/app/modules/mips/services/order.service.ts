import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../types/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _order: Order;
  get order() {
    return this._order;
  }
  set order(value: Order) {
    this._order = { ...value };
  }
  public orderObs = new BehaviorSubject<Order>(null);
  public orderObs$ = this.orderObs.asObservable();

  constructor() {}
}
