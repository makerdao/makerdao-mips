import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../types/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  public order = new BehaviorSubject<Order>(null);
  public oreder$ = this.order.asObservable();

  constructor() {}
}
