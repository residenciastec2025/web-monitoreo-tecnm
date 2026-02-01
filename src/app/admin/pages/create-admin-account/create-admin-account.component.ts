import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SystemService } from '../../../shared/services/system/system.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';

@Component({
  selector: 'app-create-admin-account',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './create-admin-account.component.html',
  styleUrl: './create-admin-account.component.css'
})
export class CreateAdminAccountComponent implements OnInit{

  public darkTheme = signal(false);
  public btnDisable = signal(false);
  public nameInvalid = signal(false);
  public emailInvalid = signal(false);
  public careerInvalid = signal(false);
  public passwordInvalid = signal(false);
  public hidePassword = signal(true);

  //Condiciones para validar los datos
  registerForm = this.formBuilder.group({
    nombre : ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ]+(?:\s[a-zA-ZáéíóúñÁÉÍÓÚÑ]+)*$/)]],
    correo : ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_%+-][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    carrera : ['', [Validators.required]],
    password: ['', [
      Validators.required, 
      Validators.pattern(/^(?=.*[0-9])(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*[*$!#@_\-:])[a-zA-Z0-9*$!#@_\-:áéíóúÁÉÍÓÚñÑ]{8,25}$/)
    ]]    
  });

  constructor(
    private formBuilder : FormBuilder,
    private systemService : SystemService,
    private authService : AuthService,
    private alertService : AlertsService,
    private router : Router,
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });
  }

  //Obtener preferencias del tema
  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  //Regresar a la seccion de administradores
  backToAdminList(){
    this.router.navigate(['/administrador/administradores']).then(() => {
      window.location.reload();
    });
  }

  //Desactivar el boton de enviar para evitar multiples solicitudes
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

  //Validar el formulario y mostrar los campos erroneos
  validateForm(){
    this.disableBtn();

    if(this.registerForm.valid){
      //Si el formulario es valido se invoca el metodo para el envio
      this.sendForm();
    }else{
      //Mostrar que campos son erroneos o invalidos
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);

        if(control?.invalid){
          switch(key){
            case 'nombre' : this.nameInvalid.set(true); break;
            case 'correo' : this.emailInvalid.set(true); break;
            case 'carrera' : this.careerInvalid.set(true); break;
            case 'password' : this.passwordInvalid.set(true); break;
          }
        }

        setTimeout(() => {
          this.nameInvalid.set(false);
          this.emailInvalid.set(false);
          this.careerInvalid.set(false);
          this.passwordInvalid.set(false);
        }, 3000);
      })
    }
  }

  //Enviar el formulario al backend para guardar la informacion
  sendForm(){
    this.authService.createAdminAccount(this.registerForm.value).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);

        //Regirigir al usuario a la seccion de administradores
        setTimeout(() => {
          this.router.navigate(['/administrador/administradores']).then(() => {
            window.location.reload();
          });
        }, 3000);
      }
    }, (error : any) => {
      //Mostrar el error del backend para informar al usuario
      this.alertService.errorAlert(error.error.message);
    });
  }

}