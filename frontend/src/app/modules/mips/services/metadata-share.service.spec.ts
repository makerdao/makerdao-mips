import { TestBed } from '@angular/core/testing';

import { MetadataShareService } from './metadata-share.service';

describe('MetadataShareService', () => {
  let service: MetadataShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
