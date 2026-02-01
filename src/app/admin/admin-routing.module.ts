import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectsComponent } from './pages/subjects/subjects.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { PeriodsComponent } from './pages/periods/periods.component';
import { AdminsComponent } from './pages/admins/admins.component';
import { CreateAdminAccountComponent } from './pages/create-admin-account/create-admin-account.component';
import { authGuard } from '../auth/guards/auth.guard';
import { adminGuard } from '../auth/guards/admin.guard';
import { CreateAccountComponent } from './pages/create-account/create-account.component';

const routes: Routes = [
  {
    path : 'materias',
    component : SubjectsComponent,
    canActivate : [authGuard, adminGuard]
  },
  {
    path : 'docentes',
    component : TeachersComponent,
    canActivate : [authGuard, adminGuard]
  },
  {
    path : 'periodos',
    component : PeriodsComponent,
    canActivate : [authGuard, adminGuard]
  },
  {
    path : 'crear-cuenta',
    component : CreateAccountComponent,
    canActivate : [authGuard, adminGuard]
  },
  {
    path : 'administradores',
    component : AdminsComponent,
    canActivate : [authGuard, adminGuard]
  },
  {
    path : 'registrar-administrador',
    component : CreateAdminAccountComponent,
    canActivate : [authGuard, adminGuard]
  },
  {
    path : '',
    redirectTo : '/administrador/materias',
    pathMatch : 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
