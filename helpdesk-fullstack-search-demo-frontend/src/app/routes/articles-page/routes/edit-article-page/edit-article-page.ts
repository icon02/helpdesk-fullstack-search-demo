import {Component, effect, inject, input, numberAttribute, signal, viewChild} from '@angular/core';
import {ArticleForm} from '../../../../shared/components/forms/article-form/article-form';
import {ArticleFormValue} from '../../../../shared/model/article-form-value';
import {ArticlesBackend} from '../../../../backend/articles-backend';
import {mapArticleFormValueToArticle, mapArticleToArticleFormValue} from '../../../../shared/mapper/article-mapper';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-article-page',
  imports: [
    ArticleForm
  ],
  templateUrl: './edit-article-page.html',
  styleUrl: './edit-article-page.css'
})
export class EditArticlePage {
  private readonly articleBackend = inject(ArticlesBackend);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  $articleForm = viewChild(ArticleForm);

  $articleId = input.required({alias: 'articleId', transform: numberAttribute});

  $articleFormValue = signal<ArticleFormValue | null>(null);

  constructor() {
    effect(() => {
      const id = this.$articleId();

      this.articleBackend.getById$(id).subscribe(article => {
        const formValue = mapArticleToArticleFormValue(article);
        this.$articleFormValue.set(formValue);
      })
    });
  }

  submit() {
    const form = this.$articleForm()!.form;

    if (form.valid) {
      const updateArticle = mapArticleFormValueToArticle(form.getRawValue());

      this.articleBackend.updateArticle$(updateArticle).subscribe(() => {
        this.router.navigate(['..'], {relativeTo: this.activatedRoute})
      })
    }

  }
}
