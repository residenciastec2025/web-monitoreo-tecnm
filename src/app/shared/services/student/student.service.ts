import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private http = inject(HttpClient);

  uploadStudents(form : any){
    const options = { withCredentials : true };
    return this.http.post(`${environment.api}/students/upload-list-students`,form, options);
  }

  updateScores(form : any){
    const options = { withCredentials : true };
    return this.http.put(`${environment.api}/students/update-evaluations-students`,form, options);
  }

  getGroupStatistics(id : string) : Observable <any>{
    const options = { withCredentials : true };
    return this.http.get<any>(`${environment.api}/students/generate-statistics/${id}`, options);
  }

  exportStudentsList(group : string, unit : number){
    return this.http.get(`${environment.api}/students/export-student-list/${group}/${unit}`, {responseType : 'blob', withCredentials : true});
  }

  exportFinalStudentsList(group : string){
    return this.http.get(`${environment.api}/students/export-final-student-list/${group}`, {responseType : 'blob', withCredentials : true});
  }

}