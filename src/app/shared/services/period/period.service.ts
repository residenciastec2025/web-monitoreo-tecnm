import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { period } from '../../interfaces/period.interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  private http = inject(HttpClient);

  registerPeriod(form : any){
    const options = { withCredentials : true };
    return this.http.post(`${environment.api}/period/period-register`,form, options);
  }

  getPeriods(page?: number, pageSize?: number) : Observable<period>{
    let params = new HttpParams();
    if (page) { params = params.set('page', page.toString()); }
    if (pageSize) { params = params.set('pageSize', pageSize.toString()); }
    const options = {
      params: params,
      withCredentials: true
    };
    return this.http.get<period>(`${environment.api}/period/period-careers`, options);
  }

  getPeriodsDescriptions() : Observable<any>{
    const options = { withCredentials : true };
    return this.http.get<any>(`${environment.api}/period/period-descriptions`, options);
  }

  exportPeriods(){
    return this.http.get(`${environment.api}/period/period-export/pdf`, {responseType : 'blob', withCredentials : true});
  }

  deletePeriod(id : string): Observable<any>{
    const options = { withCredentials : true };
    return this.http.delete<any>(`${environment.api}/period/period-delete/${id}`, options);
  }

}