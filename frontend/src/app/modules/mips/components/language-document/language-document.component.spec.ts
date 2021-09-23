import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageDocumentComponent } from './language-document.component';

describe('LanguageDocumentComponent', () => {
  let component: LanguageDocumentComponent;
  let fixture: ComponentFixture<LanguageDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
