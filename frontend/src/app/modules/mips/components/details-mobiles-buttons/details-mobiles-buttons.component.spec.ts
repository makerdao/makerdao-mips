import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsMobilesButtonsComponent } from './details-mobiles-buttons.component';

describe('DetailsMobilesButtonsComponent', () => {
  let component: DetailsMobilesButtonsComponent;
  let fixture: ComponentFixture<DetailsMobilesButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsMobilesButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsMobilesButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
