import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Observable<boolean>((observer) => {
    authService.isAuthenticated().subscribe((isAuth) => {
      if (!isAuth) {
        router.navigate(['/acceso/iniciar-sesion']).then(() => { window.location.reload() }); 
      }
      observer.next(isAuth);
      observer.complete();
    });
  });
};