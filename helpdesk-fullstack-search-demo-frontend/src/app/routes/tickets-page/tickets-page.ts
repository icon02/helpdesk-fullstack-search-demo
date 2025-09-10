import {Component, inject, OnInit, signal} from '@angular/core';
import {TicketBackend} from '../../backend/ticket-backend';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Ticket, TicketPage} from '../../shared/model/ticket';
import {catchError, forkJoin, of} from 'rxjs';

@Component({
  selector: 'app-tickets-page',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './tickets-page.html',
  styleUrl: './tickets-page.css'
})
export class TicketsPage implements OnInit {
  private readonly ticketBackend = inject(TicketBackend);
  readonly activatedRoute = inject(ActivatedRoute);

  private readonly pageSize: number = 20;

  $ticketPages = signal<TicketPage[]>([]);

  ngOnInit() {
    this.loadNextPage();
  }

  loadNextPage() {
    const lastLoadedPage = this.$ticketPages()[this.$ticketPages().length - 1]?.page.number ?? -1
    this.ticketBackend.getTicketPage$(lastLoadedPage + 1, this.pageSize).subscribe(page => {
      this.$ticketPages.update(pages => ([...pages, page]))
    });
  }

  deleteEntry(ticket: Ticket) {
    this.ticketBackend.deleteTicket$(ticket.id!).subscribe(() => this.refresh());
  }

  private refresh() {
    const requests$ = this.$ticketPages().map(page =>
      this.ticketBackend.getTicketPage$(page.page.number, page.page.size).pipe(catchError(() => of(null)))
    );

    forkJoin(requests$).subscribe(pages => {
      this.$ticketPages.set(pages.filter(page => !!page));
    })
  }
}
