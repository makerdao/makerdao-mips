import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import FilterData from '../components/filter/filter.data';


@Injectable({
  providedIn: 'root'
})
export class MipsService {

  filter: FilterData;

  constructor(
    private http: HttpClient,
  ) {
   this.filter = { title: '', status: '', type: '', posStatus: -1, posType: -1};
  }

  searchMips(limit: number, page: number, order: string, search: string, filter?: any): Observable<any> {
    let params = new HttpParams({fromObject: {limit: limit.toString(), page: page.toString()}});
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
        Object.keys(filter[key]).forEach((subkey) => {
          Object.keys(filter[key][subkey]).forEach((final) => {
            const character = !enter ? '?' : '&';
            enter = true;
            urlFilter += `${character}filter[${key}][${[final]}]=${filter[key][subkey][final]}`;
          });
        });
      });

    }
    return this.http.get(`${environment.apiUrl}/mips/findall${urlFilter}`, {params} );
  }

  getMip(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mips/findone/${id}`);
  }

  getPullRequestHistory(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mips/pullrequests`);
  }

  getFilter(): FilterData {
    return this.filter;
  }

  setFilter(filter: FilterData): void {
    this.filter = filter;
  }

}
