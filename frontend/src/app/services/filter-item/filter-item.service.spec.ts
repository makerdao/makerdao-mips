import { TestBed } from '@angular/core/testing';

import { FilterItemService } from './filter-item.service';

describe('FilterItemService', () => {
  let service: FilterItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
