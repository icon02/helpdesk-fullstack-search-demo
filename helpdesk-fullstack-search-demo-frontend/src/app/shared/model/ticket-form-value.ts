import {TagFormValue} from './tag-form-value';

export interface TicketFormValue {
  id: number | null;
  title: string;
  description: string;
  language: string;
  tags: TagFormValue[]
}
