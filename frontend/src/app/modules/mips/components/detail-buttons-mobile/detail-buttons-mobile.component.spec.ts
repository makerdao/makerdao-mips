import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailButtonsMobileComponent } from './detail-buttons-mobile.component';

describe('DetailButtonsMobileComponent', () => {
  let component: DetailButtonsMobileComponent;
  let fixture: ComponentFixture<DetailButtonsMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailButtonsMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailButtonsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
