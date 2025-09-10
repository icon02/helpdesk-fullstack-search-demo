import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketViewPage } from './ticket-view-page';

describe('TicketViewPage', () => {
  let component: TicketViewPage;
  let fixture: ComponentFixture<TicketViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
