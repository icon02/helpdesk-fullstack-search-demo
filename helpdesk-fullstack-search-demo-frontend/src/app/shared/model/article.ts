import {User} from './user';
import {Tag} from './tag';
import {PagedEntityWrapper} from './page';

export interface Article {
  id: number | null;
  title: string;
  body?: string;
  updatedAt?: Date;
  updatedBy?: User;
  language: string;
  tags: Tag[];
}

export type ArticlePage = PagedEntityWrapper<Article, "articleList">;
