import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { AlertsService } from '../../../shared/services/alerts/alerts.service';
import { StudentService } from '../../../shared/services/student/student.service';
import { SystemService } from '../../../shared/services/system/system.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-students-upload-list',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './students-upload-list.component.html',
  styleUrl: './students-upload-list.component.css'
})
export class StudentsUploadListComponent implements OnInit{
  public darkTheme = signal(false);
  public fileInvalid = signal(false);
  public btnDisable = signal(false);
  public fileSelected : File | null = null;
  public idGroup : string = '';
  public studentsForm !: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private alertService : AlertsService,
    private studentService : StudentService,
    private dialog : MatDialog,
    private systemService : SystemService,
    private router : Router,
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });
    this.idGroup = this.data.id;
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  closeDialog() : void{
    this.dialog.closeAll();
  }

  onFileSelected(event: any): void {
    this.fileSelected = event.target.files[0] as File;
  }

  disableBtn(){
    this.btnDisable.set(true);

    setTimeout(() => {
      this.btnDisable.set(false);
    }, 3000);
  }

  validateForm(): void {
    this.disableBtn();

    const isFileNotSelected = !this.fileSelected;
  
    if (isFileNotSelected) {
      this.fileInvalid.set(isFileNotSelected);
  
      setTimeout(() => {
        this.fileInvalid.set(false);
      }, 3000);
    } else {
      const formData = new FormData();
      formData.append('file', this.fileSelected as Blob);
      formData.append('grupo', this.idGroup);
      this.sendForm(formData);
    }
  }

  sendForm(formData: FormData) {
    this.studentService.uploadStudents(formData).subscribe(
      (data: any) => {
        if (data.success === true) {
          this.alertService.successAlert(data.message);
          setTimeout(() => {
            this.router.navigate([`/docente/detalles-grupo/${this.idGroup}`]).then(() => {
              window.location.reload();
            })
          }, 3000);
        }
      },
      (error: any) => {
        this.alertService.errorAlert(error.error.message);
      }
    );
  }

}