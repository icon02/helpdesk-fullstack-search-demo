import {Injectable} from '@angular/core';
import {BaseBackend} from './base-backend';
import {Observable} from 'rxjs';
import {SearchHitList} from '../shared/model/search-hit';

@Injectable({providedIn: 'root'})
export class SearchBackend extends BaseBackend {

  search$(term: string): Observable<SearchHitList> {
    return this.http.get<SearchHitList>(`${this.baseUrl}/bff/search?term=${term}`);
  }
}
