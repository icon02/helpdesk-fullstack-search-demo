import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEditPage } from './ticket-edit-page';

describe('TicketEditPage', () => {
  let component: TicketEditPage;
  let fixture: ComponentFixture<TicketEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
