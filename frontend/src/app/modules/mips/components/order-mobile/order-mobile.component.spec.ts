import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMobileComponent } from './order-mobile.component';

describe('OrderMobileComponent', () => {
  let component: OrderMobileComponent;
  let fixture: ComponentFixture<OrderMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
