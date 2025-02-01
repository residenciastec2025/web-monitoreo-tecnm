import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { subject, subjects } from '../../interfaces/subject.interface';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private http = inject(HttpClient);

  uploadSubjects(form : FormData){
    const options = { withCredentials : true };
    return this.http.post(`${environment.api}/subjects/upload-subjects`, form, options);
  }

  getSubjectsByCareer( searchTerm ?: string) : Observable<subjects>{
    let params = new HttpParams();
    if (searchTerm) { params = params.set('search', searchTerm); }
    const options = {
      params: params,
      withCredentials: true
    };
    return this.http.get<subjects>(`${environment.api}/subjects/subjects-by-career`, options);
  }

  getSubjectsKey() : Observable<any>{
    const options = { withCredentials : true };
    return this.http.get<any>(`${environment.api}/subjects/subjects-keys-career`, options);
  }

  getAllSubjectsCareers(period : string) : Observable<subject>{
    const options = { withCredentials : true };
    return this.http.get<subject>(`${environment.api}/subjects/subjects-by-careers-and-period/${period}`, options);
  }
  
}