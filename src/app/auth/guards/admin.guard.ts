import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';

export const teacherGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Observable<boolean>((observer) => {
    authService.userAccount().subscribe((userType) => {
      if (userType !== 'Administrador') {
        router.navigate(['/auth/login']);
        observer.next(false);
      } else {
        observer.next(true);
      }
      observer.complete();
    });
  });
};