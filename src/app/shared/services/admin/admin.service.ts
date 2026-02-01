import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http  = inject(HttpClient);

  // Obtener la informacion de los administradores
  getAdminsInfo(searchTerm?: string, page?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    if (page) {
      params = params.set('page', page.toString());
    }
    if (pageSize) {
      params = params.set('pageSize', pageSize.toString());
    }
    const options = {
      params: params,
      withCredentials: true
    };
    // peticion http
    return this.http.get(`${environment.api}/admin/list-all-admins`, options);
  }

  // Eliminar una cuenta de administrador mediante ID
  deleteAdminAccount(id : string) : Observable<any>{
    const options = { withCredentials : true };
    return this.http.delete<any>(`${environment.api}/admin/delete-admin-account/${id}`, options);
  }

  // Exportar administradores en PDF
  exportAdmins(){
    // peticion http
    return this.http.get(`${environment.api}/admin/export-admins`, {responseType : 'blob', withCredentials : true});
  }

}
