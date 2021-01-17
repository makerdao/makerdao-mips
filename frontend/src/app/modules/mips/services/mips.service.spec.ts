import { TestBed } from '@angular/core/testing';

import { MipsService } from './mips.service';

describe('MipsService', () => {
  let service: MipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
