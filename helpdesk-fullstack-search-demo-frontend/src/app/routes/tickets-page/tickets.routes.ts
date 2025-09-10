import {Routes} from '@angular/router';

export const ticketRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new',
        loadComponent: () => import('./routes/new-ticket-page/new-ticket-page').then(m => m.NewTicketPage)
      },
      {
        path: ':ticketId/edit',
        loadComponent: () => import('./routes/ticket-edit-page/ticket-edit-page').then(m => m.TicketEditPage)
      },
      {
        path: ':ticketId',
        loadComponent: () => import('./routes/ticket-view-page/ticket-view-page').then(m => m.TicketViewPage)
      },
      {
        path: '',
        loadComponent: () => import('./tickets-page').then(m => m.TicketsPage)
      }
    ]
  }
]
