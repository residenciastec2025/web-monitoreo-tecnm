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
    this.getPreferences();
    this.checkAuthAndRole();
  }

  /* =========================
     THEME
  ========================= */

  getPreferences() {
    this.darkTheme.set(this.systemService.getThemeState());
  }

  toggleTheme() {
    this.systemService.toggleTheme();
    this.darkTheme.set(this.systemService.getThemeState());
  }

  /* =========================
     AUTH + ROLE
  ========================= */

  private checkAuthAndRole(): void {
    this.auth.userLogged().subscribe({
      next: (isLogged) => {
        this.isAuth.set(isLogged);

        if (isLogged) {
          this.loadUserRole();
        } else {
          this.resetRoles();
        }
      },
      error: () => {
        this.resetRoles();
      }
    });
  }

  private loadUserRole(): void {
    this.auth.userAccount().subscribe({
      next: (account) => {
        this.resetRoles();

        if (account === 'Administrador') {
          this.isAdmin.set(true);
        } else if (account === 'Docente') {
          this.isTeacher.set(true);
        }
      },
      error: () => {
        this.logOut();
      }
    });
  }

  private resetRoles(): void {
    this.isAuth.set(false);
    this.isAdmin.set(false);
    this.isTeacher.set(false);
  }

  /* =========================
     LOGOUT
  ========================= */

  logOut(): void {
    this.auth.logOut();
  }
}
