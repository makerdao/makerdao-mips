import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdCheckboxComponent } from './md-checkbox.component';

describe('MdCheckboxComponent', () => {
  let component: MdCheckboxComponent;
  let fixture: ComponentFixture<MdCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
