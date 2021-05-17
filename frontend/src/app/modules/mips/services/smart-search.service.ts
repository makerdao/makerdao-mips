import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SmartSearchService {
  constructor(private http: HttpClient) {}

  getOptions(field: string, value: string): Observable<any> {
    let params: HttpParams = new HttpParams({
      fromObject: {
        field: field,
        value: value,
      },
    });

    return this.http.get(`${environment.apiUrl}/mips/smart-search`, {
      params: params,
    });
  }
}
