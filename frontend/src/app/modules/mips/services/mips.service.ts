import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import FilterData from '../components/filter/filter.data';
import { Language } from 'src/app/data-types/languages';

@Injectable({
  providedIn: 'root',
})
export class MipsService {
  filter: FilterData;
  mipsData: any[];
  total = 1;
  includeSubproposals: boolean = false;

  constructor(private http: HttpClient) {
    this.clearFilter();
  }

  searchMips(
    limit: number,
    page: number,
    order: string,
    search: string,
    filter?: any,
    select?: string
  ): Observable<any> {
    let params = new HttpParams({
      fromObject: { limit: limit.toString(), page: page.toString() },
    });

    if (select !== undefined && select != null && select !== '') {
      params = params.append('select', select);
    }

    if (order !== undefined && order != null && order !== '') {
      const patt = /\b-?mip\b|\b-?mip\s|\s-?mip\s|\s-?mip\b/;
 
      if (!patt.test(order)) {
        order += ' mipCodeNumber';
      }

      order += ' _id';
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
              urlFilter += `${character}filter[${key}][${[final]}]=${
                filter[key][subkey][final]
              }`;
            });
          });
        }
      });
    }
    return this.http.get(`${environment.apiUrl}/mips/findall${urlFilter}`, {
      params,
    });
  }

  getMip(name?: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mips/findone?mipName=${name}`);
  }

  getMipWithLanguage(name: string, lang: Language): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/mips/findone?mipName=${name}&lang=${lang}`
    );
  }

  getMipByFilename(filename?: string, field?: string): Observable<any> {
   
    return this.http.get(
      `${environment.apiUrl}/mips/findone-by?field=${field}&value=${filename}`
    );

  }

  getMipBy(field: string, value: string): Observable<any> {
    let params: HttpParams = new HttpParams({
      fromObject: {
        field: field,
        value: value,
      },
    });

    return this.http.get(`${environment.apiUrl}/mips/findone-by`, {
      params: params,
    });
  }

  sendFeedBack(subject: string, description: string): Observable<any> {
    return this.http.post(`${environment.feedBackFormUrl}`, {
      subject,
      description,
    });
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
    this.filter = {
      status: '',
      type: '',
      posStatus: -1,
      posType: -1,
      arrayStatus: [0, 0, 0, 0, 0, 0],
    };
  }

  setFilterArrayStatus(index: number, value: number) {
    this.filter.arrayStatus[index] = value;
  }
}
