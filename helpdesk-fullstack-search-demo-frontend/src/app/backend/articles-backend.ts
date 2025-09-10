import {inject, Injectable} from '@angular/core';
import {BaseBackend} from './base-backend';
import {Observable} from 'rxjs';
import {Article, ArticlePage} from '../shared/model/article';
import {AuthService} from '../service/auth-service';

@Injectable({ providedIn: 'root' })
export class ArticlesBackend extends BaseBackend {
  private readonly authService = inject(AuthService);

  getArticlesPage$(page: number, size: number): Observable<ArticlePage> {
    return this.http.get<ArticlePage>(`${this.baseUrl}/articles?page=${page}&size=${size}`);
  }

  getById$(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/articles/${id}`);
  }

  createArticle$(article: Article): Observable<Article> {
    const user = this.authService.$user()!;
    return this.http.post<Article>(`${this.baseUrl}/articles`, {
      ...article,
      updatedBy: user
    })
  }

  updateArticle$(article: Article): Observable<Article> {
    const user = this.authService.$user()!;
    return this.http.put<Article>(`${this.baseUrl}/articles`, {
      ...article,
      updatedBy: user
    })
  }

  deleteArticle$(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/articles/${id}`);
  }
}
