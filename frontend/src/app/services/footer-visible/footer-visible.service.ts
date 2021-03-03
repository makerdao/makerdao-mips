import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FooterVisibleService {
  private isFooterVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isFooterVisible$: Observable<boolean> = this.isFooterVisible.asObservable();

  constructor() { }

  setFooterVisibility(value: boolean) {
    this.isFooterVisible.next(value);
  }
}
