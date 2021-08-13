import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMipsetModeComponent } from './list-mipset-mode.component';

describe('ListMipsetModeComponent', () => {
  let component: ListMipsetModeComponent;
  let fixture: ComponentFixture<ListMipsetModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMipsetModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMipsetModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
