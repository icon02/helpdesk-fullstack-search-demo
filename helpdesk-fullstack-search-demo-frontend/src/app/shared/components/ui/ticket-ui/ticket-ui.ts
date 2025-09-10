import { Component, input } from '@angular/core';
import {Ticket} from '../../../model/ticket';

@Component({
  selector: 'app-ticket-ui',
  imports: [],
  templateUrl: './ticket-ui.html',
  styleUrl: './ticket-ui.css'
})
export class TicketUi {
  $ticket = input.required<Ticket>({ alias: 'ticket' });
}
