import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth/auth.service';

export const teacherGuard: CanActivateFn = (route, state) => {
  
  const auth = inject(AuthService);
  const router = inject(Router);
  const cookies = inject(CookieService);

  return auth.userAccount().pipe(
    map(userType => {
      if(userType === 'Docente'){
        return true;
      }else{
        cookies.delete('session');
        setTimeout(() => {
          window.location.reload();
          router.navigate(['/iniciar-sesion']).then(() => {
            window.location.reload();
          });
        }, 1);
        return false;
      }
    })
  );

};