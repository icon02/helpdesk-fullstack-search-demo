import {Article} from '../model/article';
import {ArticleFormValue} from '../model/article-form-value';
import {mapTagFormValueToTag, mapTagToTagFormValue} from './tag-mapper';

export function mapArticleToArticleFormValue(article: Article): ArticleFormValue {
  return {
    id: article.id ?? null,
    title: article.title,
    body: article.body || '',
    tags: article.tags.map(mapTagToTagFormValue),
    language: article.language
  }
}

export function mapArticleFormValueToArticle(formValue: ArticleFormValue): Article {
  return {
    id: formValue.id ?? null,
    title: formValue.title,
    body: formValue.body,
    tags: formValue.tags.map((tag) => mapTagFormValueToTag(tag, formValue.language)),
    language: formValue.language
  }
}
