import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscDesComponent } from './asc-des.component';

describe('AscDesComponent', () => {
  let component: AscDesComponent;
  let fixture: ComponentFixture<AscDesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AscDesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscDesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
