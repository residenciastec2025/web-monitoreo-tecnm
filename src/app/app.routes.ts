import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    {
        path : 'administrador',
        title : 'Calificaciones',
        loadChildren : () => import('./admin/admin.module').then(m => m.AdminModule),
        canMatch : [authGuard]
    },
    {
        path : 'docente',
        title : 'Calificaciones',
        loadChildren : () => import('./teacher/teacher.module').then(m => m.TeacherModule),
        canMatch : [authGuard]
    },
    {
        path : 'iniciar-sesion',
        title : 'Inicio',
        loadComponent : () => import('./auth/pages/login/login.component').then( c => c.LoginComponent)
    },
    {
        path : '',
        redirectTo : '/iniciar-sesion',
        pathMatch : 'full'
    },
    {
        path : '**',
        redirectTo : '/iniciar-sesion',
        pathMatch : 'full'
    }
];