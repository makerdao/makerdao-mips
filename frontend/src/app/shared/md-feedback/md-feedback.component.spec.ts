import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdFeedbackComponent } from './md-feedback.component';

describe('MdFeedbackComponent', () => {
  let component: MdFeedbackComponent;
  let fixture: ComponentFixture<MdFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
