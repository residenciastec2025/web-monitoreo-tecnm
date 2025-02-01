import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanMatchFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const cookies = inject(CookieService);

  const sessionCookie = cookies.get('session');

  if(!sessionCookie){
    router.navigate(['/iniciar-sesion']);
    return false;
  }

  return auth.userLogged().pipe(
    map(isLogged => {
      if (isLogged === true) {
        return true;
      } else {
        cookies.delete('session');
        router.navigate(['/iniciar-sesion']).then(() => {window.location.reload()});
        return false;
      }
    }),
    catchError(error => {
      console.error('Error al verificar si el usuario está autenticado:', error);
      return of(false);
    })
  );

}