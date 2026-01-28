import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { SystemService } from '../../services/system/system.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  isAuth = signal(false);
  isAdmin = signal(false);
  isTeacher = signal(false);
  darkTheme = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);
  private systemService = inject(SystemService);

  ngOnInit(): void {
    this.loadTheme();
    this.checkAuthAndRole();
  }

  private loadTheme(): void {
    this.darkTheme.set(this.systemService.getThemeState());
  }

  toggleTheme(): void {
    this.systemService.toggleTheme();
    this.darkTheme.set(this.systemService.getThemeState());
  }

  private checkAuthAndRole(): void {
    // 🔴 Limpia TODO antes de empezar
    this.resetRoles();

    this.auth.isAuthenticated().subscribe({
      next: (isLogged) => {
        if (!isLogged) {
          this.resetRoles();
          return;
        }

        this.isAuth.set(true);
        this.loadUserRole();
      },
      error: () => {
        this.resetRoles();
      }
    });
  }

  private loadUserRole(): void {
    this.auth.userAccount().subscribe({
      next: (account) => {
        this.isAdmin.set(account === 'Administrador');
        this.isTeacher.set(account === 'Docente');

        // DEBUG opcional
        console.log(
          'isAuth:', this.isAuth(),
          '| Admin:', this.isAdmin(),
          '| Teacher:', this.isTeacher()
        );
      },
      error: () => {
        this.resetRoles();
        this.logOut();
      }
    });
  }

  private resetRoles(): void {
    this.isAuth.set(false);
    this.isAdmin.set(false);
    this.isTeacher.set(false);
  }

  logOut(): void {
    this.auth.logOut();
  }
}
