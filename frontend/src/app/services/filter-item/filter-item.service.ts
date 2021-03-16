import { ComponentRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterItemService {
  newItem: Subject<any> = new Subject<any>();
  itemToRemove: Subject<any> = new Subject<any>();

  constructor() { }

  add(data: any) {
    this.newItem.next(data);
  }

  remove(id: string) {
    this.itemToRemove.next(id);
  }
}
