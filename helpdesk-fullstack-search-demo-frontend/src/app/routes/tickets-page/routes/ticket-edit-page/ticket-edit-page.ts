import {Component, effect, inject, input, numberAttribute, signal, untracked, viewChild} from '@angular/core';
import {TicketFormValue} from '../../../../shared/model/ticket-form-value';
import {TicketBackend} from '../../../../backend/ticket-backend';
import {mapTicketFormValueToTicket, mapTicketToTicketFormValue} from '../../../../shared/mapper/ticket-mapper';
import {TicketForm} from '../../../../shared/components/forms/ticket-form/ticket-form';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-ticket-edit-page',
  imports: [
    TicketForm
  ],
  templateUrl: './ticket-edit-page.html',
  styleUrl: './ticket-edit-page.css'
})
export class TicketEditPage {
  private readonly ticketBackend = inject(TicketBackend);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  $ticketId = input.required({alias: 'ticketId', transform: numberAttribute});

  $form = viewChild(TicketForm);

  $ticketFormValue = signal<TicketFormValue | null>(null);


  constructor() {
    effect(() => {
      const ticketId  = this.$ticketId();

      untracked(() => {
        this.ticketBackend.getById$(ticketId).subscribe(ticket => {
          const ticketFormValue = mapTicketToTicketFormValue(ticket);
          this.$ticketFormValue.set(ticketFormValue);
        })
      })
    });
  }

  submit() {
    const value = this.$form()!.form.getRawValue();
    const ticket = mapTicketFormValueToTicket(value);

    this.ticketBackend.updateTicket$(ticket).subscribe(() => {
      this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    })
  }
}
