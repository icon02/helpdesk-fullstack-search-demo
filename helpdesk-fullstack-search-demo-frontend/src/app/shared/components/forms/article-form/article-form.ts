import {booleanAttribute, Component, Input, input} from '@angular/core';
import {FormLanguageWrapper} from "../form-language-wrapper/form-language-wrapper";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TagFormValue} from '../../../model/tag-form-value';
import {TagsForm} from '../tags-form/tags-form';
import {ArticleFormValue} from '../../../model/article-form-value';

@Component({
  selector: 'app-article-form',
  imports: [
    FormLanguageWrapper,
    ReactiveFormsModule,
    TagsForm
  ],
  templateUrl: './article-form.html',
  styleUrl: './article-form.css'
})
export class ArticleForm {
  $readonly = input(false, {alias: 'readonly', transform: booleanAttribute});

  @Input()
  set value(value: ArticleFormValue | null | undefined) {
    if(value) {
      this.form.setValue(value);
    }
  }

  idCtrl = new FormControl<number | null>(null);
  titleCtrl = new FormControl<string>('', {nonNullable: true, validators: [Validators.required]});
  languageCtrl = new FormControl<string>('en-GB', {nonNullable: true});
  bodyCtrl = new FormControl<string>('', {nonNullable: true});
  tagsCtrl = new FormControl<TagFormValue[]>([], {nonNullable: true});
  form = new FormGroup({
    id: this.idCtrl,
    title: this.titleCtrl,
    language: this.languageCtrl,
    body: this.bodyCtrl,
    tags: this.tagsCtrl,
  });
}
