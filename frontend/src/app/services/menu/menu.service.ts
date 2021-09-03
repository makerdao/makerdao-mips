import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
const YAML = require('yaml');
import Menu from '../../data-types/menu';
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private openedIndexChild: BehaviorSubject<number> = new BehaviorSubject<number>(
    -1
  );
  public openedIndexChild$: Observable<number> = this.openedIndexChild.asObservable();
  private posXClicked: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  public posXClicked$: Observable<number> = this.posXClicked.asObservable();
  transitionTime: number = 0.3;
  private clicked: BehaviorSubject<Menu> = new BehaviorSubject<Menu>(null);
  public clicked$: Observable<Menu> = this.clicked.asObservable();

  constructor(private http: HttpClient) {}

  getMenu(): Observable<any> {
    return this.getMenuFile();
  }

  getMenuFile() {
    let g = (observer) => {
      this.http
        .get(environment.menuURL, { responseType: 'text' })
        .pipe(
          map((data) => {
            return YAML.parse(data);
          })
        )
        .subscribe(
          (data) => {
            observer.next(data);
          },
          async (error) => {
            try {
              let auxiliarData = await this.getAuxiliarMenuJson();
              observer.next(auxiliarData);
            } catch (err) {
              console.log(err);
            }
          }
        );
    };

    return new Observable(g);
  }

  async getAuxiliarMenuJson() {
    return this.http.get(environment.menuURLAuxiliar).toPromise();
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
