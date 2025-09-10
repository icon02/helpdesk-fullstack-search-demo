import {Component, input} from '@angular/core';
import {SearchHit} from '../../../model/search-hit';
import {RouterLink} from '@angular/router';
import {LanguageTagUi} from '../language-tag-ui/language-tag-ui';

@Component({
  selector: 'app-search-hit-ui',
  imports: [
    RouterLink,
    LanguageTagUi
  ],
  templateUrl: './search-hit-ui.html',
  styleUrl: './search-hit-ui.css'
})
export class SearchHitUi {
  $hit = input.required<SearchHit>({ alias: 'hit' });
}
