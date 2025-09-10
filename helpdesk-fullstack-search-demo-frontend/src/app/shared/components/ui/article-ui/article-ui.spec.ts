import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleUi } from './article-ui';

describe('ArticleUi', () => {
  let component: ArticleUi;
  let fixture: ComponentFixture<ArticleUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
