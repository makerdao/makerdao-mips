import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MipsPaginationComponent } from './mips-pagination.component';

describe('MipsPaginationComponent', () => {
  let component: MipsPaginationComponent;
  let fixture: ComponentFixture<MipsPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MipsPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MipsPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
