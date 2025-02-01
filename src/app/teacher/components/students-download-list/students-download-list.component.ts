import { Component, Inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { AlertsService } from '../../../shared/services/alerts/alerts.service';
import { StudentService } from '../../../shared/services/student/student.service';
import { SystemService } from '../../../shared/services/system/system.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupService } from '../../../shared/services/group/group.service';

@Component({
  selector: 'app-students-download-list',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './students-download-list.component.html',
  styleUrl: './students-download-list.component.css'
})
export class StudentsDownloadListComponent implements OnInit{
  
  public darkTheme = signal(false);
  public btnDisable = signal(false);

  public idGroup : string = '';
  public subject : string = '';
  public selectedUnit : number = 0;
  public unitsCount !: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private alertService : AlertsService,
    private studentService : StudentService,
    private groupService : GroupService,
    private dialog : MatDialog,
    private systemService : SystemService,
    private router : Router,
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });
    this.idGroup = this.data.id;
    this.subject = this.data.subject;
    this.getUnits();
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
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

  getUnits() : void{
    this.groupService.getInfoUnitsGroup(this.idGroup).subscribe((data : any) => {
      if(data.success === true){
        this.unitsCount = data.units;
      }
    });
  }

  downloadList() : void{
    if(this.selectedUnit == 100){
      this.downloadFinalList();
    }else if(this.selectedUnit > 0 && this.selectedUnit < 100){
      this.downloadUnitList();
    }

    setTimeout(() => {
      this.router.navigate([`/docente/detalles-grupo/${this.idGroup}`]).then(() => {
        window.location.reload();
      });
    }, 3000);
  }

  downloadUnitList() : void{
    this.studentService.exportStudentsList(this.idGroup, this.selectedUnit).subscribe((data : Blob) => {
      const url = window.URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${this.subject}_calificaciones_u${this.selectedUnit}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    });
  }

  downloadFinalList() : void{
    this.studentService.exportFinalStudentsList(this.idGroup).subscribe((data : Blob) => {
      const url = window.URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${this.subject}_calificaciones_finales.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    });
  }

}