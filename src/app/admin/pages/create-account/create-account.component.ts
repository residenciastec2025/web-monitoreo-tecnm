import { NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';

import { AlertsService } from '../../../shared/services/alerts/alerts.service';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TeacherUpdateCareerComponent } from '../../components/teacher-update-career/teacher-update-career.component';
import { SystemService } from '../../../shared/services/system/system.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent implements OnInit{

  public darkTheme = signal(false);
  public btnDisable = signal(false);
  public nameInvalid = signal(false);
  public emailInvalid = signal(false);
  public passwordInvalid = signal(false);
  public hidePassword = signal(true);

  registerForm = this.formBuilder.group({
    nombre : ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ]+(?:\s[a-zA-ZáéíóúñÁÉÍÓÚÑ]+)*$/)]],
    correo : ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_%+-][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    password : ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]{8,25}$/)]]
  });

  constructor(
    private authService : AuthService, 
    private formBuilder : FormBuilder,
    private alertService : AlertsService,
    private systemService : SystemService,
    private router : Router,
    private dialog : MatDialog
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  backToTeacherList(){
    this.router.navigate(['/administrador/docentes']).then(() => {
      window.location.reload();
    });
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

    if(this.registerForm.valid){
      this.sendForm();
    }else{
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);

        if(control?.invalid){
          switch(key){
            case 'nombre' : this.nameInvalid.set(true); break;
            case 'correo' : this.emailInvalid.set(true); break;
            case 'password' : this.passwordInvalid.set(true); break;
          }
        }

        setTimeout(() => {
          this.nameInvalid.set(false);
          this.emailInvalid.set(false);
          this.passwordInvalid.set(false);
        }, 3000);
      })
    }
  }

  sendForm(){
    this.authService.createTeacherAccount(this.registerForm.value).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);

        setTimeout(() => {
          this.router.navigate(['/administrador/docentes']).then(() => {
            window.location.reload();
          });
        }, 3000);
      }else if(data.success === false && data.duplicate === true){
        this.dialog.open(TeacherUpdateCareerComponent, {data : {email : this.registerForm.get('correo')?.value}});
      }
    }, (error : any) => {
      this.alertService.errorAlert(error.error.message);
    });
  }

}
