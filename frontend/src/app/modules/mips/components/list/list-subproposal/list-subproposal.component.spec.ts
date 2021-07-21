import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubproposalComponent } from './list-subproposal.component';

describe('ListSubproposalComponent', () => {
  let component: ListSubproposalComponent;
  let fixture: ComponentFixture<ListSubproposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSubproposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubproposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
