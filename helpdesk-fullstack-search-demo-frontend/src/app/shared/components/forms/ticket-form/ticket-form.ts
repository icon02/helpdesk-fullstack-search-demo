import {booleanAttribute, Component, effect, input, untracked} from '@angular/core';
import {FormLanguageWrapper} from '../form-language-wrapper/form-language-wrapper';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TicketFormValue} from '../../../model/ticket-form-value';
import {TagFormValue} from '../../../model/tag-form-value';
import {TagsForm} from '../tags-form/tags-form';

@Component({
  selector: 'app-ticket-form',
  imports: [
    FormLanguageWrapper,
    ReactiveFormsModule,
    TagsForm
  ],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketForm {

  $readonly = input(false, { alias: 'readonly', transform: booleanAttribute });

  $value = input<TicketFormValue | null>(null, { alias: 'value' });

  idCtrl = new FormControl<number | null>(null);
  languageCtrl = new FormControl<string>('de-AT', { validators: Validators.required, nonNullable: true });
  titleCtrl =new FormControl('', { validators: [Validators.required], nonNullable: true});
  descriptionCtrl = new FormControl('', { validators: [Validators.required], nonNullable: true });
  tagsCtrl = new FormControl<TagFormValue[]>([], { nonNullable: true});
  form = new FormGroup({
    id: this.idCtrl,
    language: this.languageCtrl,
    title: this.titleCtrl,
    description: this.descriptionCtrl,
    tags: this.tagsCtrl,
  });

  constructor() {
    effect(() => {
      const valInput = this.$value();

      untracked(() => {
        if(valInput) {
          this.form.setValue(valInput);
        }
      })
    });
  }
}
