import { ComponentRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterItemService {
  newItem: Subject<any> = new Subject<any>();
  newItemRef: Subject<ComponentRef<any>> = new Subject<ComponentRef<any>>();

  constructor() { }

  add(data: any) {
    this.newItem.next(data);
  }
}
