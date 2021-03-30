import { Injectable } from '@angular/core';
import QueryParams from '../types/query-params';
import { MipsService } from './mips.service';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsListService {
  private _queryParams: QueryParams = {
    status: []
  };

  constructor(private mipsService: MipsService) { }

  get queryParams() {
    return this._queryParams;
  }

  set queryParams(value: QueryParams) {
    this._queryParams = value;
  }

  addStatus(value: string) {
    let index = this._queryParams.status.findIndex(item => item === value);

    if (index === -1) {
      this._queryParams.status.push(value);
    }
  }

  substractStatus(value: string) {
    let index = this._queryParams.status.findIndex(item => item === value);

    if (index !== -1) {
      this._queryParams.status.splice(index, 0);
    }
  }

  clearStatus() {
    this._queryParams.status = [];
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
}


