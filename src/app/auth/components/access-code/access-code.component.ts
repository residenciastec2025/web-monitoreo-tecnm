import { NgClass } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';
import { SystemService } from '../../../shared/services/system/system.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-code',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './access-code.component.html',
  styleUrl: './access-code.component.css'
})
export class AccessCodeComponent implements OnInit{

  public darkTheme = signal(false);
  public codeInvalid = signal(false);
  public btnDisable = signal(false);
  accessForm !: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private formBuilder : FormBuilder,
    private alertService : AlertsService,
    private authService : AuthService,
    private systemService : SystemService,
    private dialog : MatDialog,
    private router : Router
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.accessForm = this.formBuilder.group({
      codigo : ['', [Validators.required]]
    });
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

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  validateForm(){
    this.btnDisable();

    if(this.accessForm.valid){
      this.sendForm();
    }else{
      this.codeInvalid.set(true);

      setTimeout(() => {
        this.codeInvalid.set(false);
      }, 3000);
    }
  }

  sendForm(){
    const body = {
      correo : this.data.email,
      codigo : this.accessForm.get('codigo')?.value
    }

    this.authService.validateCodeSession(body).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);
        this.redirectUser();
      }
    }, (error : any) => {
      this.alertService.errorAlert(error.error.message);
    });

  }

  redirectUser(){
    this.authService.userAccount().subscribe(account => {
      switch(account){
        case 'Administrador' : 
        setTimeout(() => {
          this.router.navigate(['/administrador/periodos']).then(() => {
            window.location.reload();
          });
        }, 3000);
        break;

        case 'Docente' : 
        setTimeout(() => {
          this.router.navigate(['/docente/lista-grupos']).then(() => {
            window.location.reload();
          });
        }, 3000);
        break;
        
      }
    });
  }

}