import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubproposalsComponent } from './subproposals.component';

describe('SubproposalsComponent', () => {
  let component: SubproposalsComponent;
  let fixture: ComponentFixture<SubproposalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubproposalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubproposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
