import {inject, Injectable} from '@angular/core';
import {BaseBackend} from './base-backend';
import {Observable} from 'rxjs';
import {Ticket, TicketPage} from '../shared/model/ticket';
import {AuthService} from '../service/auth-service';

@Injectable({ providedIn: 'root' })
export class TicketBackend extends BaseBackend {
  private readonly authService = inject(AuthService);

  getTicketPage$(page: number, size: number): Observable<TicketPage> {
    return this.http.get<TicketPage>(`${this.baseUrl}/tickets?page=${page}&size=${size}`);
  }

  getById$(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/tickets/${id}`);
  }

  createTicket$(ticket: Ticket): Observable<Ticket> {
    const user = this.authService.$user()!;
    return this.http.post<Ticket>(`${this.baseUrl}/tickets`, {
      ...ticket,
      updatedBy: user
    });
  }

  updateTicket$(ticket: Ticket): Observable<Ticket> {
    const user = this.authService.$user()!;
    return this.http.put<Ticket>(`${this.baseUrl}/tickets`, {
      ...ticket,
      updatedBy: user
    });
  }

  deleteTicket$(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tickets/${id}`);
  }
}
