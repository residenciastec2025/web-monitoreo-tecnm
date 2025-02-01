import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupOverviewComponent } from './pages/group-overview/group-overview.component';
import { GroupDetailsComponent } from './pages/group-details/group-details.component';
import { GroupAddComponent } from './pages/group-add/group-add.component';
import { GroupStatisticsComponent } from './pages/group-statistics/group-statistics.component';
import { GroupTeachingHistoryComponent } from './pages/group-teaching-history/group-teaching-history.component';
import { teacherGuard } from '../auth/guards/teacher.guard';
import { GroupEvaluationCaptureComponent } from './pages/group-evaluation-capture/group-evaluation-capture.component';

const routes: Routes = [
  {
    path : 'lista-grupos',
    component : GroupOverviewComponent,
    canActivate : [teacherGuard]
  },
  {
    path : 'detalles-grupo/:id',
    component : GroupDetailsComponent,
    canActivate : [teacherGuard]
  },
  {
    path : 'registrar-nuevo-grupo',
    component : GroupAddComponent,
    canActivate : [teacherGuard]
  },
  {
    path : 'estadisticas-grupo/:id',
    component : GroupStatisticsComponent,
    canActivate : [teacherGuard]
  },
  {
    path : 'capturar-calificaciones-grupo/:id',
    component : GroupEvaluationCaptureComponent,
    canActivate : [teacherGuard]
  },
  {
    path : 'historial-grupos',
    component : GroupTeachingHistoryComponent,
    canActivate : [teacherGuard]
  },
  {
    path : '',
    redirectTo : 'lista-grupos',
    pathMatch : 'full'
  },
  {
    path : '**',
    redirectTo : 'lista-grupos',
    pathMatch : 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
