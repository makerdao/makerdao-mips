import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMultipleQueriesComponent } from './list-multiple-queries.component';

describe('ListMultipleQueriesComponent', () => {
  let component: ListMultipleQueriesComponent;
  let fixture: ComponentFixture<ListMultipleQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMultipleQueriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMultipleQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
