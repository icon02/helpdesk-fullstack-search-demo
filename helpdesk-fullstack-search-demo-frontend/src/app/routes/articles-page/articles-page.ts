import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ArticlesBackend} from '../../backend/articles-backend';
import {Article, ArticlePage} from '../../shared/model/article';
import {DatePipe} from '@angular/common';
import {catchError, forkJoin, of} from 'rxjs';

@Component({
  selector: 'app-articles-page',
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './articles-page.html',
  styleUrl: './articles-page.css'
})
export class ArticlesPage implements OnInit {
  private readonly articleBackend = inject(ArticlesBackend);
  readonly activatedRoute = inject(ActivatedRoute);

  private readonly pageSize = 10;

  $articlePages = signal<ArticlePage[]>([]);

  ngOnInit() {
    this.loadNextPage();
  }

  loadNextPage() {
    const lastLoadedPage = this.$articlePages()[this.$articlePages().length - 1]?.page.number ?? -1;
    this.articleBackend.getArticlesPage$(lastLoadedPage + 1, this.pageSize).subscribe(page => {
      this.$articlePages.update(pages => ([...pages, page]))
    });
  }

  deleteEntry(article: Article) {
    this.articleBackend.deleteArticle$(article.id!).subscribe(() => this.refresh());
  }

  private refresh() {
    const currentPages = this.$articlePages();
    const requests$ = currentPages.map(page => {
      return this.articleBackend.getArticlesPage$(page.page.number, page.page.size).pipe(catchError(() => of(null)))
    });

    forkJoin(requests$).subscribe(pages => {
      this.$articlePages.set(pages.filter(page => !!page));
    })
  }
}
