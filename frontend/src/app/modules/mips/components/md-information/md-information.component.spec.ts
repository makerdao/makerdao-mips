import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdInformationComponent } from './md-information.component';

describe('MdInformationComponent', () => {
  let component: MdInformationComponent;
  let fixture: ComponentFixture<MdInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
