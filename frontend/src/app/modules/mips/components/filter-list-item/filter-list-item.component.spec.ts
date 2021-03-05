import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterListItemComponent } from './filter-list-item.component';

describe('FilterListItemComponent', () => {
  let component: FilterListItemComponent;
  let fixture: ComponentFixture<FilterListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
