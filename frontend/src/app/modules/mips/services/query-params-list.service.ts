import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import QueryParams from '../types/query-params';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsListService {
  private _queryParams: QueryParams = {
    status: [],
    search: '',
    subproposalsMode: false
  };

  private qParams: BehaviorSubject<QueryParams> = new BehaviorSubject<QueryParams>({
    status: [],
    search: ''
  });
  public qParams$: Observable<QueryParams> = this.qParams.asObservable();

  constructor() { }

  get queryParams() {
    return this._queryParams;
  }

  set queryParams(value: QueryParams) {
    this._queryParams = value;
    this.qParams.next(this._queryParams);
  }

  clearStatus() {
    this._queryParams.status = [];
    this.qParams.next(this._queryParams);
  }

  setSearch(value: string) {
    this._queryParams.search = value;
    this.qParams.next(this._queryParams);
  }
}


