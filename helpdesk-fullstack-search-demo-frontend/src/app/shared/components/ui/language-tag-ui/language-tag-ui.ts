import {Component, input} from '@angular/core';

@Component({
  selector: 'app-language-tag-ui',
  imports: [],
  templateUrl: './language-tag-ui.html',
  styleUrl: './language-tag-ui.css'
})
export class LanguageTagUi {
  $tagValue = input.required<string>({ alias: 'tagValue' })
}
