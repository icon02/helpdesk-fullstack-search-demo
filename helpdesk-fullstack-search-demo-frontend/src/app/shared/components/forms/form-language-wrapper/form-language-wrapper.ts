import {booleanAttribute, Component, input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-form-language-wrapper',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './form-language-wrapper.html',
  styleUrl: './form-language-wrapper.css'
})
export class FormLanguageWrapper {

  $rootFormGroup = input.required<FormGroup>({ alias: 'rootFormGroup' });
  $languageControl = input.required<FormControl<string | null>>({ alias: 'languageControl' });
  $readonly = input(false, { alias: 'readonly', transform: booleanAttribute });

}
