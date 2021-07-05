import { TestBed } from '@angular/core/testing';

import { ElementsRefUiService } from './elements-ref-ui.service';

describe('ElementsRefUiService', () => {
  let service: ElementsRefUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementsRefUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
