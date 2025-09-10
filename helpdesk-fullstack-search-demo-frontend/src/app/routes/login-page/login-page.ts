import {AfterViewInit, Component, effect, inject, input, signal, untracked} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {UserBackend} from '../../backend/user-backend';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements AfterViewInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  $redirectTo = input<string>('/', {alias: 'redirectTo'});

  $emails = toSignal(
    inject(UserBackend).getAllUserEmails$()
  );

  private $isViewInitialized = signal<boolean>(false);
  private redirectUrl = this.router.lastSuccessfulNavigation?.extras?.state?.['redirectUrl'] || '/';


  form = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required])
  });

  constructor() {
    effect(() => {
      const user = this.authService.$user();
      const isViewInitialized = this.$isViewInitialized();

      untracked(() => {
        if (user && isViewInitialized) {
          this.router.navigate([this.redirectUrl]);
        }
      })
    });

    effect(() => {
      console.log('redirectTo', this.$redirectTo());
    });
  }

  ngAfterViewInit() {
    this.$isViewInitialized.set(true);
    if (history?.state?.redirectTo) {
      this.redirectUrl = history.state.redirectTo;
    }
  }

  submit() {
    if (this.form.valid && this.form.value.email) {
      this.authService.login(this.form.value.email);
    }
  }
}
