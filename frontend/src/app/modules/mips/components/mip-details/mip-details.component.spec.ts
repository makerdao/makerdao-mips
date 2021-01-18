import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MipDetailsComponent } from './mip-details.component';

describe('MipDetailsComponent', () => {
  let component: MipDetailsComponent;
  let fixture: ComponentFixture<MipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MipDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
