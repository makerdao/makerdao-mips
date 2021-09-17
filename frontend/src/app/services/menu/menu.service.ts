import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IVarsYaml } from 'src/app/data-types/vars-yaml';
import { environment } from '../../../environments/environment';
const YAML = require('yaml');
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
    return this.getMenuFile();
  }

  getMenuFile() {
    let g = (observer) => {
      this.http.get(environment.menuURL, { responseType: 'text' }).subscribe(
        async (data) => {
          try {
            let varsYAML;
            try {
              varsYAML = await this.getVarsYAML();
            } catch (error) {
              console.log(error);
            }

            let newData = data;
            if (varsYAML) {
              newData = this.parseVarsYAML(varsYAML, data);
            }

            observer.next(YAML.parse(newData));
          } catch (error) {
            console.log(error);
          }
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

  getMenuLang(): Observable<any> {
    return this.http.get('../../assets/data/menuLang.json');
  }

  async getAuxiliarMenuJson() {
    return this.http.get(environment.menuURLAuxiliar).toPromise();
  }

  getVarsYAML(): Promise<any> {
    return this.http
      .get(environment.varsURL, { responseType: 'text' })
      .toPromise();
  }

  parseVarsYAML(dataVars: string, dataMenu: string): string {
    let varObj: IVarsYaml = YAML.parse(dataVars);
    let newDataMenu: string = dataMenu;

    for (const key in varObj.strings) {
      if (Object.prototype.hasOwnProperty.call(varObj.strings, key)) {
        const element = varObj.strings[key];
        newDataMenu = newDataMenu.replace('$' + key, element);
      }
    }

    return newDataMenu;
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
