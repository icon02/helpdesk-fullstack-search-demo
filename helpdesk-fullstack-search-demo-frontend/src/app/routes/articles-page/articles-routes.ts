import {Routes} from '@angular/router';

export const articlesRoutes: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./routes/new-article-page/new-article-page').then(m => m.NewArticlePage),
  },
  {
    path: ':articleId/edit',
    loadComponent: () => import('./routes/edit-article-page/edit-article-page').then(m => m.EditArticlePage),
  },
  {
    path: ':articleId',
    loadComponent: () => import('./routes/view-article-page/view-article-page').then(m => m.ViewArticlePage)
  },
  {
    path: '',
    loadComponent: () => import('./articles-page').then(m => m.ArticlesPage),
  }
]
