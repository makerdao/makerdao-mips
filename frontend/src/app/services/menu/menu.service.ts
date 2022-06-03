import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IVarsYaml } from 'src/app/data-types/vars-yaml';
import { environment } from '../../../environments/environment';
const YAML = require('yaml');
import Menu from '../../data-types/menu';
import { LangService } from '../lang/lang.service';
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
  transitionTime = 0.3;
  private clicked: BehaviorSubject<Menu> = new BehaviorSubject<Menu>(null);
  public clicked$: Observable<Menu> = this.clicked.asObservable();
  varsURL = environment.varsURL;

  constructor(private http: HttpClient, private langService: LangService) {}

  getMenu(): Observable<any> {
    return this.getMenuFile();
  }

  getMenuFile(): Observable<any>{
    const g = (observer) => {
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
            const parsedData = YAML.parse(newData);
            const views = parsedData.data.find(({ id }) => id === 'views');
            const units = views?.children.find(({ id }) => id === 'coreunits');

            units?.children.forEach(ch => {
              if (ch.href.includes('customViewName')) {
                ch.href += '&shouldBeExpandedMultiQuery=true'
              }
            });
            units?.children.forEach(ch => {
              ch.href += '&hideParents=false'
            });

            observer.next(parsedData);
          } catch (error) {
            console.log(error);
          }
        },
        async () => {
          try {
            const auxiliaryData = await this.getAuxiliaryMenuJson();
            observer.next(auxiliaryData);
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

  async getAuxiliaryMenuJson(): Promise<any> {
    return this.http.get(environment.menuURLAuxiliar).toPromise();
  }

  getVarsYAML(): Promise<any> {
    let varsURL = this.varsURL;

    if (this.langService.lang !== 'en') {
      varsURL = this.varsURL.replace(
        'meta',
        `I18N/${this.langService.lang.toUpperCase()}/meta`
      );
    }

    return this.http.get(varsURL, { responseType: 'text' }).toPromise();
  }

  parseVarsYAML(dataVars: string, dataMenu: string): string {
    const varObj: IVarsYaml = YAML.parse(dataVars);
    let newDataMenu: string = dataMenu;

    for (const key in varObj.strings) {
      if (Object.prototype.hasOwnProperty.call(varObj.strings, key)) {
        const element = varObj.strings[key];
        const pattern = new RegExp(`\\$${key}`, 'g');
        newDataMenu = newDataMenu.replace(pattern, element);
      }
    }

    return newDataMenu;
  }

  setOpenedIndexChild(value: number): void {
    this.openedIndexChild.next(value);
  }

  setsXClicked(value: number): void {
    this.posXClicked.next(value);
  }

  setClicked(value: Menu): void {
    this.clicked.next(value);
  }
}
