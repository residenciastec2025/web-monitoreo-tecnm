import { NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectService } from '../../../shared/services/subject/subject.service';
import { PeriodService } from '../../../shared/services/period/period.service';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';
import { MatDialog } from '@angular/material/dialog';
import { SystemService } from '../../../shared/services/system/system.service';

@Component({
  selector: 'app-add-new-period',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './add-new-period.component.html',
  styleUrl: './add-new-period.component.css'
})
export class AddNewPeriodComponent implements OnInit{

  public darkTheme = signal(false);
  public periodInvalid = signal(false);
  public keyInvalid = signal(false);
  public btnDisable = signal(false);
  public subjectKeys : any[] = [];

  periodForm = this.formBuilder.group({
    periodo : ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+\s(?:\d{4}\s)?[-_:]\s[a-zA-Z]+\s(?:\d{4})$/)]],
    idReticula : ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor(
    private formBuilder : FormBuilder,
    private subjectService : SubjectService,
    private periodService : PeriodService,
    private alertService : AlertsService,
    private dialog : MatDialog,
    private systemService : SystemService
  ){}

  ngOnInit(): void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.getSubjectsKey();
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

  getSubjectsKey(){
    this.subjectService.getSubjectsKey().subscribe((data : any) => {
      if(data.success === true){
        this.subjectKeys = data.subjects;
      }
    });
  }

  validateForm(){
    this.disableBtn();

    if(this.periodForm.valid){
      this.sendForm();
    }else{
      Object.keys(this.periodForm.controls).forEach(key => {
        const control = this.periodForm.get(key);

        if(control?.invalid){
          switch(key){
            case 'periodo' : this.periodInvalid.set(true); break;
            case 'idReticula' : this.keyInvalid.set(true); break;
          }
        }

        setTimeout(() => {
          this.periodInvalid.set(false);
          this.keyInvalid.set(false);
        }, 3000);
      });
    }
  }

  sendForm(){
    this.periodService.registerPeriod(this.periodForm.value).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);
      }

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }, (error : any) => {
      this.alertService.errorAlert(error.error.message);
    });
  }

}