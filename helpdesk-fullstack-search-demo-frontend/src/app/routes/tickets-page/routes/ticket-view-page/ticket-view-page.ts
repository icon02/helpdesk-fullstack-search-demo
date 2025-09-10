import {Component, effect, inject, input, numberAttribute, signal} from '@angular/core';
import {TicketBackend} from '../../../../backend/ticket-backend';
import {Ticket} from '../../../../shared/model/ticket';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TicketUi} from '../../../../shared/components/ui/ticket-ui/ticket-ui';

@Component({
  selector: 'app-ticket-view-page',
  imports: [
    TicketUi,
    RouterLink,
  ],
  templateUrl: './ticket-view-page.html',
  styleUrl: './ticket-view-page.css'
})
export class TicketViewPage {
  private readonly ticketBackend = inject(TicketBackend);
  protected readonly activatedRoute = inject(ActivatedRoute);

  $ticketId = input.required({ alias: 'ticketId', transform: numberAttribute });
  $ticket = signal<Ticket | undefined>(undefined);

  constructor() {
    effect(() => {
      const ticketId = this.$ticketId();

      this.ticketBackend.getById$(ticketId).subscribe(ticket => this.$ticket.set(ticket))
    });
  }
}
