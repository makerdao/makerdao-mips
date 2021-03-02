import { TestBed } from '@angular/core/testing';

import { FooterVisibleService } from './footer-visible.service';

describe('FooterVisibleService', () => {
  let service: FooterVisibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooterVisibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
