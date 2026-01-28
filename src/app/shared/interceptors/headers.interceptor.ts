import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookiesService } from '../../auth/services/cookies/cookies.service';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const cookie = inject(CookiesService);
  const token = cookie.getCookie('session');

  const auth = req.clone({
    setHeaders : {
      Authorization : `Bearer ${token}`
    }
  });

  return next(auth);
};
