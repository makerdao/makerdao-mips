import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdCheckboxMobileComponent } from './md-checkbox-mobile.component';

describe('MdCheckboxMobileComponent', () => {
  let component: MdCheckboxMobileComponent;
  let fixture: ComponentFixture<MdCheckboxMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdCheckboxMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdCheckboxMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
