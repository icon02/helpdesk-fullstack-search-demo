import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageTagUi } from './language-tag-ui';

describe('LanguageTagUi', () => {
  let component: LanguageTagUi;
  let fixture: ComponentFixture<LanguageTagUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageTagUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageTagUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
