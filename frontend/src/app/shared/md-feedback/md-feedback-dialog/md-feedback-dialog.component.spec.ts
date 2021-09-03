import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdFeedbackDialogComponent } from './md-feedback-dialog.component';

describe('MdFeedbackDialogComponent', () => {
  let component: MdFeedbackDialogComponent;
  let fixture: ComponentFixture<MdFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdFeedbackDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
