import {Tag} from './tag';
import {User} from './user';
import {PagedEntityWrapper} from './page';

export interface Ticket {
  id: number | null;
  title: string;
  description?: string;
  tags: Tag[];
  language: string;
  updatedAt?: Date;
  updatedBy?: User;
}

export type TicketPage = PagedEntityWrapper<Ticket, "ticketList">;
