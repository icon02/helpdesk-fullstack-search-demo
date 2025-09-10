import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketUi } from './ticket-ui';

describe('TicketUi', () => {
  let component: TicketUi;
  let fixture: ComponentFixture<TicketUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
