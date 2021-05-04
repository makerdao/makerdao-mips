import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  url: string = 'assets/data/menu.json';
  private openedIndexChild: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(-1);
  public openedIndexChild$: Observable<
    number
  > = this.openedIndexChild.asObservable();
  private posXClicked: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  public posXClicked$: Observable<number> = this.posXClicked.asObservable();
  transitionTime: number = 0.3;

  constructor(private http: HttpClient) {}

  getMenu() {
    return this.http.get(this.url);
  }

  setOpenedIndexChild(value: number) {
    this.openedIndexChild.next(value);
  }

  setposXClicked(value: number) {
    this.posXClicked.next(value);
  }
}
