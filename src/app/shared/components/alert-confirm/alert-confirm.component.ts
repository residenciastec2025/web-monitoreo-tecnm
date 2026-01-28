import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SystemService } from '../../services/system/system.service';
import { NgClass } from '@angular/common';
import { GroupService } from '../../services/group/group.service';
import { AlertsService } from '../../services/alerts/alerts.service';
import { Router } from '@angular/router';
import { PeriodService } from '../../services/period/period.service';
import { SubjectService } from '../../services/subject/subject.service';

@Component({
  selector: 'app-alert-confirm',
  standalone: true,
  imports: [NgClass],
  templateUrl: './alert-confirm.component.html',
  styleUrl: './alert-confirm.component.css'
})
export class AlertConfirmComponent implements OnInit{
  darkTheme = signal(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private groupService : GroupService,
    private systemService : SystemService,
    private periodService : PeriodService,
    private alertService : AlertsService,
    private subjectService : SubjectService,
    private router : Router,
    private dialog : MatDialog,
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  cancel() : void{
    this.dialog.closeAll();
  }

  confirm() : void{
    switch(this.data.reason){
      case 'closeGroup' : this.closeGroup(); break;
      case 'deletePeriod' : this.deletePeriod(); break;
      case 'deleteSubjects' : this.deleteSubjects(); break;
    }
  }

  closeGroup() : void{
    this.groupService.closeGroup(this.data.group).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);

        setTimeout(() => {
          window.location.reload();
        },3000);
      }
    });
  }

  deletePeriod() : void{
    this.periodService.deletePeriod(this.data.group).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);

        setTimeout(() => {
          window.location.reload();
        },3000);
      }
    });
  }

  deleteSubjects() : void{
    this.subjectService.deleteSubjectId(this.data.group).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);

        setTimeout(() => {
          window.location.reload();
        },3000);
      }
    });
  }

}