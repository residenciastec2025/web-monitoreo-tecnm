import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { Subscription, map } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SystemService } from '../../services/system/system.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  isAdmin = signal(false);
  isTeacher = signal(false);
  isAuth = signal(false);
  darkTheme = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);
  private systemService = inject(SystemService);
  public userLoggedSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.getPreferences();

    this.userLoggedSubscription = this.auth.userLogged().subscribe(
      (isLogged: boolean) => {
        this.isAuth.set(isLogged); 
        this.userAccount();
      },
      (error: any) => {});
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  toggleTheme(){
    this.systemService.toggleTheme();
    this.darkTheme.set(this.systemService.getThemeState());
  }

  userAccount(){
    this.auth.userAccount().subscribe(account => {
      if(account === 'Administrador'){
        this.isAdmin.set(true);
      }else if(account === 'Docente'){
        this.isTeacher.set(true);
      }else{
        this.router.navigate(['/iniciar-sesion']).then(() => {window.location.reload()});
      }
    }, (error : any) => {
      this.auth.logOut();
    });
  }

  logOut(){
    this.auth.logOut();
  }

}