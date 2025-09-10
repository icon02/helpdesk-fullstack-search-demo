import {BaseBackend} from './base-backend';
import {map, Observable} from 'rxjs';
import {User} from '../shared/model/user';
import {Injectable} from '@angular/core';
import {PagedEntityWrapper} from '../shared/model/page';

@Injectable({ providedIn: 'root' })
export class UserBackend extends BaseBackend {
  getByEmail$(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${email}`);
  }

  getAllUserEmails$(): Observable<string[]> {
    return this.http.get<PagedEntityWrapper<string, "stringList">>(`${this.baseUrl}/users/email-options`).pipe(
      map(res => res._embedded.stringList)
    )
  }
}
