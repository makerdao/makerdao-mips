import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionAutocompleteComponent } from './option-autocomplete.component';

describe('OptionAutocompleteComponent', () => {
  let component: OptionAutocompleteComponent;
  let fixture: ComponentFixture<OptionAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
