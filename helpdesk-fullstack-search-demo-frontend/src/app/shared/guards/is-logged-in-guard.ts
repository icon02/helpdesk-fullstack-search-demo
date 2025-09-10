import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../service/auth-service';

export const isLoggedInGuardFn: CanActivateFn = (_, routerState) => {

  if(inject(AuthService).$user()) {
    return true;
  } else {
    const router = inject(Router)
    return router.navigate(['/login'], {
      state: {
        redirectTo: routerState.url,
      }
    })
  }
}
