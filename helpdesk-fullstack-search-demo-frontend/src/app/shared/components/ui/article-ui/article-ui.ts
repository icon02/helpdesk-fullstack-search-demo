import {Component, computed, inject, input} from '@angular/core';
import {Article} from '../../../model/article';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-article-ui',
  imports: [
    RouterLink
  ],
  templateUrl: './article-ui.html',
  styleUrl: './article-ui.css'
})
export class ArticleUi {
  $article = input.required<Article>({ alias: 'article' });

  protected $bodyParagraphs = computed(() => {
    const body = this.$article().body;
    if(!body) {
      return [];
    } else {
      return body.split('\n').map((line) => line.trim());
    }
  })
}
