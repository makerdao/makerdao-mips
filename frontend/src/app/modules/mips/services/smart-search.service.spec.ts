import { TestBed } from '@angular/core/testing';

import { SmartSearchService } from './smart-search.service';

describe('SmartSearchService', () => {
  let service: SmartSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
