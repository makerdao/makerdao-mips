import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubsetComponent } from './list-subset.component';

describe('ListSubsetComponent', () => {
  let component: ListSubsetComponent;
  let fixture: ComponentFixture<ListSubsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSubsetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
