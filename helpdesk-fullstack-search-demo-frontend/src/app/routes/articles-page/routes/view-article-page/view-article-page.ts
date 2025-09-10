import {Component, effect, inject, input, numberAttribute, signal} from '@angular/core';
import {ArticleForm} from '../../../../shared/components/forms/article-form/article-form';
import {ArticlesBackend} from '../../../../backend/articles-backend';
import {ArticleUi} from '../../../../shared/components/ui/article-ui/article-ui';
import {Article} from '../../../../shared/model/article';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-view-article-page',
  imports: [
    ArticleForm,
    ArticleUi,
    RouterLink
  ],
  templateUrl: './view-article-page.html',
  styleUrls: ['./view-article-page.css'],
})
export class ViewArticlePage {
  private readonly articleBackend = inject(ArticlesBackend);
  protected readonly activatedRoute = inject(ActivatedRoute);

  $articleId = input.required({ alias: 'articleId', transform: numberAttribute });

  $article = signal<Article | null>(null);

  constructor() {
    effect(() => {
      const articleId = this.$articleId();
      this.articleBackend.getById$(articleId).subscribe((article) => {
        this.$article.set(article);
      })
    });
  }
}
