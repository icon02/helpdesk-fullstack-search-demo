import {inject, Injectable, Signal, signal} from '@angular/core';
import {User} from '../shared/model/user';
import {UserBackend} from '../backend/user-backend';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userBackend = inject(UserBackend);
  private readonly authServiceStorageKey = 'v1__authService.user';

  private $authenticatedUser = signal<User | null>(null);

  constructor() {
    const item = localStorage.getItem(this.authServiceStorageKey);
    if(item) {
      const user = JSON.parse(item);
      this.$authenticatedUser.set(user);
    }
  }

  login(email: string) {
    this.userBackend.getByEmail$(email).subscribe(user => {
      this.$authenticatedUser.set(user);
      localStorage.setItem(this.authServiceStorageKey, JSON.stringify(user));
    });
  }

  get $user(): Signal<User | null> {
    return this.$authenticatedUser;
  }


}
