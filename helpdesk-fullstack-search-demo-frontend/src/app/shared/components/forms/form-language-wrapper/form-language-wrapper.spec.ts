import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLanguageWrapper } from './form-language-wrapper';

describe('FormLanguageWrapper', () => {
  let component: FormLanguageWrapper;
  let fixture: ComponentFixture<FormLanguageWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLanguageWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLanguageWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
