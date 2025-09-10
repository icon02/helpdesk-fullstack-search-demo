import { Routes } from '@angular/router';
import {isLoggedInGuardFn} from './shared/guards/is-logged-in-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./routes/login-page/login-page').then(m => m.LoginPage),
  },
  {
    path: '',
    canActivate: [isLoggedInGuardFn],
    children: [
      {
        path: 'search',
        loadComponent: () => import('./routes/search-page/search-page').then(m => m.SearchPage),
      },
      {
        path: 'tickets',
        loadChildren: () => import('./routes/tickets-page/tickets.routes').then(m => m.ticketRoutes)
      },
      {
        path: 'articles',
        loadChildren: () => import('./routes/articles-page/articles-routes').then(m => m.articlesRoutes),
      },
      {
        path: '',
        loadComponent: () => import('./routes/home-page/home-page').then(m => m.HomePage),
      }
    ]
  }
];
