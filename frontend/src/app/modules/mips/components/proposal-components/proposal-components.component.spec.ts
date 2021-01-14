import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalComponentsComponent } from './proposal-components.component';

describe('ProposalComponentsComponent', () => {
  let component: ProposalComponentsComponent;
  let fixture: ComponentFixture<ProposalComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
