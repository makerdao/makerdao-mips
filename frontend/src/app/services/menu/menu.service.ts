import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import Menu from '../../data-types/menu';
@Injectable({
  providedIn: 'root',
})
export class MenuService {
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
  private clicked: BehaviorSubject<Menu> = new BehaviorSubject<Menu>(null);
  public clicked$: Observable<Menu> = this.clicked.asObservable();

  constructor(private http: HttpClient) {}

  getMenu(): Observable<any> {
    return this.http.get(environment.menuURL);
  }

  setOpenedIndexChild(value: number) {
    this.openedIndexChild.next(value);
  }

  setposXClicked(value: number) {
    this.posXClicked.next(value);
  }

  setClicked(value: Menu) {
    this.clicked.next(value);
  }
}
