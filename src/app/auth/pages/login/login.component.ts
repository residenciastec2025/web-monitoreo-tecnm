import { NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../services/auth/auth.service';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';
import { SystemService } from '../../../shared/services/system/system.service';
import { AccessCodeComponent } from '../../components/access-code/access-code.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  public darkTheme = signal(false);
  public emailInvalid = signal(false);
  public passwordInvalid = signal(false);
  public btnDisable = signal(false);
  public hidePassword = signal(true);
  public loginForm !: FormGroup;

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    private alertService : AlertsService,
    private systemService : SystemService,
    private router : Router,
    private dialog : MatDialog
  ){
    this.loginForm = this.formBuilder.group({
      correo : ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_%+-][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password : ['', Validators.required]
    });
  }

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  disableBtn(){
    this.btnDisable.set(true);
    setTimeout(() => {
      this.btnDisable.set(false);
    }, 3000);
  }

  togglePassword(): void {
    if(this.hidePassword() === true){
      this.hidePassword.set(false);
    }else{
      this.hidePassword.set(true);
    }
  }

  validateForm(){
    this.disableBtn();

    if(this.loginForm.valid){
      this.login();
    }else{
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);

        if(control?.invalid){
          switch(key){
            case 'correo' : this.emailInvalid.set(true); break;
            case 'password' : this.passwordInvalid.set(true); break;
            default :
          }
          setTimeout(() => {
            this.emailInvalid.set(false);
            this.passwordInvalid.set(false);
          }, 3000);
        }

      });
    }
  }

  login(){
    const form = this.loginForm.value;
    this.authService.login(form).subscribe((data : any) => {
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

  requestCode() : void{
    if(this.loginForm.get('correo')?.valid){
      const body = { correo :  this.loginForm.get('correo')?.value}

      this.authService.requestCodeSession(body).subscribe((data : any) => {
        if(data.success === true){
          this.dialog.open(AccessCodeComponent, {data : {email : body.correo}});
        }
      }, (error : any) => {
        this.alertService.errorAlert(error.error.message);
      });
    }else{
      this.alertService.errorAlert('Ingresa un correo valido');
    }
  }

}