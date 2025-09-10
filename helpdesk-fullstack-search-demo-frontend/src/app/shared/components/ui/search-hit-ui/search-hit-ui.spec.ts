import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHitUi } from './search-hit-ui';

describe('SearchHitUi', () => {
  let component: SearchHitUi;
  let fixture: ComponentFixture<SearchHitUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchHitUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchHitUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
