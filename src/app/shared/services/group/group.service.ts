import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private http  = inject(HttpClient);

  registerGroup(form : any){
    const options = { withCredentials : true };
    return this.http.post(`${environment.api}/group/create-group`, form, options);
  }

  getMyGroups(searchTerm?: string, page?: number, pageSize?: number): Observable<any> {
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
    return this.http.get(`${environment.api}/group/all-groups-teacher`, options);
  }

  getMyGroupHistory(searchTerm?: string, page?: number, pageSize?: number): Observable<any> {
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
    return this.http.get(`${environment.api}/group/teacher-group-history`, options);
  }

  getInfoGroup(id : string) : Observable<any>{
    const options = { withCredentials : true };
    return this.http.get<any>(`${environment.api}/group/info-group/${id}`, options);
  }

  getInfoUnitsGroup(id : string) : Observable<any>{
    const options = { withCredentials : true };
    return this.http.get<any>(`${environment.api}/group/info-group-units/${id}`, options);
  }

  closeGroup(id : string) : Observable<any>{
    const options = { withCredentials : true };
    const body = '';
    return this.http.patch<any>(`${environment.api}/group/close-group/${id}`, body, options);
  }
  
  generateStatistics(form : FormData, id : string){
    return this.http.post(`${environment.api}/group/generate-report/${id}`, form, {responseType : 'blob'});
  }

  exportGroupsByTeacher(){
    return this.http.get(`${environment.api}/group/export-groups-by-teacher`, {responseType : 'blob', withCredentials : true});
  }

}