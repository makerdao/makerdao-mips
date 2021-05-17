import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import FilterData from '../components/filter/filter.data';


@Injectable({
  providedIn: 'root'
})
export class MipsService {

  filter: FilterData;
  mipsData: any[];
  total = 1;

  private activateSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public activateSearch$: Observable<boolean> = this.activateSearch.asObservable();

  constructor(
    private http: HttpClient,
  ) {
   this.clearFilter();
  }

  updateActiveSearch(data: boolean): void {
    this.activateSearch.next(data);
  }

  searchMips(limit: number, page: number, order: string, search: string, filter?: any, select?: string): Observable<any> {
    let params = new HttpParams({fromObject: {limit: limit.toString(), page: page.toString()}});

    if (select !== undefined && select != null && select !== '') {
      params = params.append('select', select);
    }

    if (order !== undefined && order != null && order !== '') {
      params = params.append('order', order);
    }
    if (search !== undefined && search != null && search !== '') {
      params = params.append('search', search);
    }
    let urlFilter = '';
    let enter = false;
    if (filter !== undefined && filter != null) {
      Object.keys(filter).forEach((key) => {
        if (key === 'inarray' && filter[key].length > 0) {
          const character = !enter ? '?' : '&';
          enter = true;
          urlFilter += `${character}filter[${key}][field]=${filter[key][0]['field']}`;

          filter[key].forEach((final) => {
            const character = !enter ? '?' : '&';
            enter = true;
            urlFilter += `${character}filter[${key}][value]=${final.value}`;
          });
        } else {
          Object.keys(filter[key]).forEach((subkey) => {
            Object.keys(filter[key][subkey]).forEach((final) => {
              const character = !enter ? '?' : '&';
              enter = true;
              urlFilter += `${character}filter[${key}][${[final]}]=${filter[key][subkey][final]}`;
            });
          });
        }
      });

    }
    return this.http.get(`${environment.apiUrl}/mips/findall${urlFilter}`, {params} );
  }

  getMip(name?: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mips/findone?mipName=${name}`);
  }

  getMipByFilename(filename?: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mips/findone-by?field=filename&value=${filename}`);
  }

  getMipBy(field: string, value: string): Observable<any> {
    let params: HttpParams = new HttpParams({
      fromObject: {
        field: field,
        value: value
      }
    });

    return this.http.get(`${environment.apiUrl}/mips/findone-by`, {params: params});
  }

  sendFeedBack(subject: string, description: string): Observable<any> {
    return this.http.post(`${environment.feedBackFormUrl}`, { subject, description });
  }

  getFilter(): FilterData {
    return this.filter;
  }

  setFilter(filter: FilterData): void {
    this.filter = filter;
  }

  getMipsData(): any[] {
    return this.mipsData;
  }

  setMipsData(data: any[]): void {
    this.mipsData = data;
  }

  getTotal(): number {
    return this.total;
  }

  setTotal(value: number): void {
    this.total = value;
  }

  clearFilter(): void {
    this.filter = { status: '', type: '', posStatus: -1, posType: -1, arrayStatus: [0, 0, 0, 0, 0, 0]};
  }

  setFilterArrayStatus(index: number, value: number) {
    this.filter.arrayStatus[index] = value;
  }
}
