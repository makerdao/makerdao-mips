import { TestBed } from '@angular/core/testing';

import { QueryParamsListService } from './query-params-list.service';

describe('QueryParamsListService', () => {
  let service: QueryParamsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryParamsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
