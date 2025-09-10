import {Component, inject, viewChild} from '@angular/core';
import {TicketForm} from '../../../../shared/components/forms/ticket-form/ticket-form';
import {ActivatedRoute, Router} from '@angular/router';
import {TicketBackend} from '../../../../backend/ticket-backend';
import {mapTicketFormValueToTicket} from '../../../../shared/mapper/ticket-mapper';

@Component({
  selector: 'app-new-ticket-page',
  imports: [
    TicketForm
  ],
  templateUrl: './new-ticket-page.html',
  styleUrl: './new-ticket-page.css'
})
export class NewTicketPage {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly ticketBackend = inject(TicketBackend);

  $ticketForm = viewChild(TicketForm);

  submit() {
    const ticketForm = this.$ticketForm();

    if(ticketForm && ticketForm.form.valid) {
      // create
      const createTicket = mapTicketFormValueToTicket(ticketForm.form.getRawValue())
      // redirect
      this.ticketBackend.createTicket$(createTicket).subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute })
      })
    }
  }
}
