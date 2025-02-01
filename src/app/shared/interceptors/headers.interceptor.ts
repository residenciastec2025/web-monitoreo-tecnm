import { HttpInterceptorFn } from '@angular/common/http';
import { CookiesService } from '../../auth/services/cookies/cookies.service';
import { inject } from '@angular/core';

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