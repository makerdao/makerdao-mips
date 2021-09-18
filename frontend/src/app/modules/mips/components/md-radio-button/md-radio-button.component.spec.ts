import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdRadioButtonComponent } from './md-radio-button.component';

describe('MdRadioButtonComponent', () => {
  let component: MdRadioButtonComponent;
  let fixture: ComponentFixture<MdRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdRadioButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
