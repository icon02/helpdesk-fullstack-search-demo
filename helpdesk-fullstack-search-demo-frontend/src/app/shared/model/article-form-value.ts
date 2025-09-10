import {TagFormValue} from './tag-form-value';

export interface ArticleFormValue {
  id: number | null;
  title: string;
  body: string;
  language: string;
  tags: TagFormValue[];
}
