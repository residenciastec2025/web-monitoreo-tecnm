import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { admin } from '../../../shared/interfaces/admin.interfaces';
import { teacher } from '../../../shared/interfaces/teacher.interfaces';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cookies = inject(CookieService);
  private router = inject(Router);

  login(body : any){
    const options = { withCredentials : true };
    return this.http.post(`${environment.api}/auth/login`, body, options);
  }

  createAdminAccount(admin : any){
    const options = { withCredentials: true };
    return this.http.post(`${environment.api}/admin/create-account`, admin, options);
  }

  createTeacherAccount(teacher : any){
    const options = { withCredentials: true };
    return this.http.post(`${environment.api}/teacher/create-account`, teacher, options);
  }

  // userLogged() : Observable<boolean>{
  //   const options = { withCredentials: true };
  //   return this.http.get<{success: boolean, message : string}>(`${environment.api}/auth/is-logged`, options)
  //   .pipe(map(response => response.success));
  // }

  // Verificar si el usuario ha iniciado sesion
  isAuthenticated() : Observable<boolean>{
      const options = { withCredentials : true };
      return this.http.get<{ success : boolean }>(`${environment.api}/auth/is-logged`, options).pipe(
      map( response => response.success ),
      catchError(() => of (false))
      );
  }

  userAccount() : Observable<string>{
    const options = { withCredentials: true };
    return this.http.get<{account : string}>(`${environment.api}/auth/account-type`, options)
    .pipe(map(response => response.account));
  }

  userInfo() : Observable<admin | teacher>{
    const options = { withCredentials: true };
    return this.http.get<admin | teacher>(`${environment.api}/auth/info`, options);
  }

  requestCodeSession(body : any){
    const options = { withCredentials: true };
    return this.http.post(`${environment.api}/auth/access-code/generate`, body, options);
  }

  validateCodeSession(body : any){
    const options = { withCredentials: true };
    return this.http.post(`${environment.api}/auth/access-code/validate`, body, options);
  }

  async logOut(){
    this.http.post(`${environment.api}/auth/logout`, {}, { withCredentials: true })
    .subscribe(() => {
      this.router.navigate(['/iniciar-sesion']).then(() => {
        window.location.reload();
      });
    });
  }
}