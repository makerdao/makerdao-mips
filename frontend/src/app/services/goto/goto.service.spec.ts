import { TestBed } from '@angular/core/testing';

import { GotoService } from './goto.service';

describe('GotoService', () => {
  let service: GotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
