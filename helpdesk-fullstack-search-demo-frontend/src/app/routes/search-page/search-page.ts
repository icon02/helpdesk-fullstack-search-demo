import {Component, effect, inject, input, signal, untracked} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {SearchBackend} from '../../backend/search-backend';
import {SearchHitList} from '../../shared/model/search-hit';
import {SearchHitUi} from '../../shared/components/ui/search-hit-ui/search-hit-ui';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-search-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SearchHitUi
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage {
  private readonly searchBackend = inject(SearchBackend);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  $term = input<string | null | undefined>(null, { alias: 'term' });

  searchInput = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });

  $searchResult = signal<SearchHitList>([]);

  constructor() {
    effect(() => {
      const term = this.$term();

      untracked(() => {
        this.searchInput.setValue(term ?? '');
        if(this.searchInput.valid) {
          this.searchBackend.search$(this.searchInput.value).subscribe(hits => {
            this.$searchResult.set(hits);
          })
        }
      })
    });
  }

  submit() {
    console.log('submit')
    if(this.searchInput.valid) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          term: this.searchInput.value
        }
      })

    }
  }
}
