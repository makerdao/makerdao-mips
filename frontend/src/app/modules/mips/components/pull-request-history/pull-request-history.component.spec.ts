import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullRequestHistoryComponent } from './pull-request-history.component';

describe('PullRequestHistoryComponent', () => {
  let component: PullRequestHistoryComponent;
  let fixture: ComponentFixture<PullRequestHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullRequestHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullRequestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
