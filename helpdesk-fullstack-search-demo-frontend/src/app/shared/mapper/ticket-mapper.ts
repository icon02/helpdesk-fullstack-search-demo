import {Ticket} from '../model/ticket';
import {TicketFormValue} from '../model/ticket-form-value';
import {mapTagFormValueToTag, mapTagToTagFormValue} from './tag-mapper';

export function mapTicketToTicketFormValue(ticket: Ticket): TicketFormValue {
  return {
    id: ticket.id ?? null,
    title: ticket.title,
    description: ticket.description || '',
    language: ticket.language,
    tags: ticket.tags.map(mapTagToTagFormValue)
  }
}

export function mapTicketFormValueToTicket(formValue: TicketFormValue): Ticket {
  return {
    id: formValue.id ?? null,
    title: formValue.title,
    description: formValue.description,
    language: formValue.language,
    tags: formValue.tags.map(tag => mapTagFormValueToTag(tag, formValue.language))
  }
}
