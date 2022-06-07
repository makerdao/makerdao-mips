import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LangService } from 'src/app/services/lang/lang.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SmartSearchService {
  constructor(private http: HttpClient, private langService: LangService) {}

  getOptions(field: string, value: string): Observable<any> {
    let params: HttpParams = new HttpParams({
      fromObject: {
        field: field,
        value: value,
      },
    });

    return this.http.get(`${environment.apiUrl}/mips/smart-search`, {
      params: params,
      headers: { 'ignore-lang': 'true' }
    });
  }

  getTags() {
    const getTagsForLang = (lang: string) => {
      return this.http.get<{ tag: string }[]>(`${environment.apiUrl}/mips/smart-search`, {
        params: { field: 'tags', value: '', lang },
        headers: { 'ignore-lang': 'true' }
      });
    };

    return getTagsForLang(this.langService.lang).pipe(
      switchMap(tags => {
        if (!tags?.length) {
          return getTagsForLang('en');
        }
        return of(tags);
      })
    )
  }
}
