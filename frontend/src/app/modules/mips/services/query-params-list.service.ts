import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import QueryParams from '../types/query-params';
import { MipsService } from './mips.service';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsListService {
  private _queryParams: QueryParams = {
    status: [],
    search: ''
  };

  private qParams: BehaviorSubject<QueryParams> = new BehaviorSubject<QueryParams>({
    status: [],
    search: ''
  });
  public qParams$: Observable<QueryParams> = this.qParams.asObservable();

  constructor(private mipsService: MipsService) { }

  set queryParams(value: QueryParams) {
    this._queryParams = value;
    this.qParams.next(this._queryParams);
  }

  clearStatus() {
    this._queryParams.status = [];
    this.qParams.next(this._queryParams);
  }

  updateFiltersFromQueryParams() {
    if (this._queryParams.status) {
      this._queryParams.status.forEach(value => {
        switch (value) {
          case 'Accepted':
            this.mipsService.setFilterArrayStatus(0, 1);
            break;
          case 'Rejected':
            this.mipsService.setFilterArrayStatus(1, 1);
            break;
          case 'Archive':
            this.mipsService.setFilterArrayStatus(2, 1);
            break;
          case 'RFC':
            this.mipsService.setFilterArrayStatus(3, 1);
            break;
          case 'Obsolete':
            this.mipsService.setFilterArrayStatus(4, 1);
            break;
          case 'Formal Submission':
            this.mipsService.setFilterArrayStatus(5, 1);
            break;
          default:
            break;
        }
      })
    }
  }

  setSearch(value: string) {
    this._queryParams.search = value;
    this.qParams.next(this._queryParams);
  }
}


