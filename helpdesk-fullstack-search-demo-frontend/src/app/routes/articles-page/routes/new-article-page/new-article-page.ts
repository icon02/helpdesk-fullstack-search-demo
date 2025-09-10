import {Component, inject, viewChild} from '@angular/core';
import {ArticleForm} from '../../../../shared/components/forms/article-form/article-form';
import {ArticlesBackend} from '../../../../backend/articles-backend';
import {mapArticleFormValueToArticle, mapArticleToArticleFormValue} from '../../../../shared/mapper/article-mapper';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-new-article-page',
  imports: [
    ArticleForm
  ],
  templateUrl: './new-article-page.html',
  styleUrl: './new-article-page.css'
})
export class NewArticlePage {
  private readonly articleBackend = inject(ArticlesBackend);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  $articleForm = viewChild(ArticleForm);

  submit() {
    const form = this.$articleForm()!.form;
    if(form.valid) {
      const createArticle = mapArticleFormValueToArticle(form.getRawValue());

      this.articleBackend.createArticle$(createArticle).subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
      })
    }
  }
}
