import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TeacherService } from '../../../shared/services/teacher/teacher.service';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-update-career',
  standalone: true,
  imports: [],
  templateUrl: './teacher-update-career.component.html',
  styleUrl: './teacher-update-career.component.css'
})
export class TeacherUpdateCareerComponent implements OnInit{
  darkTheme = signal(false);
  public email : string = '';
  public btnDisable = signal(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private dialog : MatDialog,
    private teacherService : TeacherService,
    private alertService : AlertsService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.email = this.data.email;
  }

  closeDialog() : void{
    this.dialog.closeAll();
  }

  disableBtn(){
    this.btnDisable.set(true);

    setTimeout(() => {
      this.btnDisable.set(false);
    }, 3000);
  }

  updateTeacherCareer(){
    this.btnDisable();

    this.teacherService.updateTeacherCareers(this.email).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);

        setTimeout(() => {
          this.router.navigate(['/administrador/docentes']).then(() => {
            window.location.reload();
          });
        }, 3000);
      }
    }, (error : any) => {
      this.alertService.errorAlert(error.error.message);
    });
  }

}