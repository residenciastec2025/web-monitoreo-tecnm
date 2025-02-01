import { NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';
import { SubjectService } from '../../../shared/services/subject/subject.service';
import { MatDialog } from '@angular/material/dialog';
import { SystemService } from '../../../shared/services/system/system.service';

@Component({
  selector: 'app-subjects-upload-file',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './subjects-upload-file.component.html',
  styleUrl: './subjects-upload-file.component.css'
})
export class SubjectsUploadFileComponent implements OnInit{

  public darkTheme = signal(false);
  keyInvalid = signal(false);
  fileInvalid = signal(false);
  btnDisable = signal(false);

  fileSelected: File | null = null;
  subjectsForm = this.formBuilder.group({
    claveReticula : ['', Validators.pattern(/^[a-zA-Z\s]{4}\s*[-]{1}\s*[a-zA-Z\s]{0,3}\s*[-]{1}\s*\d{4}\s*[-]\s*\d{2}/)],
  });

  constructor(
    private formBuilder : FormBuilder,
    private alertService : AlertsService,
    private subjectService : SubjectService,
    private dialog : MatDialog,
    private systemService : SystemService
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

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
  
    const keyControl = this.subjectsForm.get('claveReticula');
    const isClaveReticulaInvalid = !keyControl?.value || keyControl.invalid;
    const isFileNotSelected = !this.fileSelected;
  
    if (isClaveReticulaInvalid || isFileNotSelected) {
      this.keyInvalid.set(isClaveReticulaInvalid);
      this.fileInvalid.set(isFileNotSelected);
  
      setTimeout(() => {
        this.keyInvalid.set(false);
        this.fileInvalid.set(false);
      }, 3000);
    } else {
      const Clave_Reticula = keyControl.value;
      const formData = new FormData();
      formData.append('claveReticula', Clave_Reticula?.toString() || '');
      formData.append('file', this.fileSelected as Blob);
  
      this.sendForm(formData);
    }
  }

  sendForm(formData : FormData){
    this.subjectService.uploadSubjects(formData).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert('Reticula guardada');

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    }, (error : any) => {
      this.alertService.errorAlert(error.error.message);
    });
  }

}