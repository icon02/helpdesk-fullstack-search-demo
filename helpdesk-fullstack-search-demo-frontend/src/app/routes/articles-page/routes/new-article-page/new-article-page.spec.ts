import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArticlePage } from './new-article-page';

describe('NewArticlePage', () => {
  let component: NewArticlePage;
  let fixture: ComponentFixture<NewArticlePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewArticlePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewArticlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
