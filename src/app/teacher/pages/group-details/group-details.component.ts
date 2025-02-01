import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';

import { GroupService } from '../../../shared/services/group/group.service';
import { SystemService } from '../../../shared/services/system/system.service';
import { group } from '../../../shared/interfaces/group.interfaces';
import { subject } from '../../../shared/interfaces/subject.interface';
import { MatDialog } from '@angular/material/dialog';
import { StudentsUploadListComponent } from '../../components/students-upload-list/students-upload-list.component';
import { student } from '../../../shared/interfaces/student.intefaces';
import { StudentsDownloadListComponent } from '../../components/students-download-list/students-download-list.component';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [NgClass],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.css'
})
export class GroupDetailsComponent implements OnInit{

  public darkTheme = signal(false);
  public idGroup : string = '';
  public group: group = {} as group;
  public subject: subject = {} as subject; 
  public students : student [] = [];
  public message : string = '¿Estás seguro de que deseas cerrar este grupo? Esta acción es irreversible y, una vez cerrado, no podrás asignar más calificaciones.';

  constructor(
    private groupService : GroupService,
    private systemService : SystemService,
    private alertService : AlertsService,
    private route : ActivatedRoute,
    private router : Router,
    private dialog : MatDialog,
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.getIdGroup();
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  redirectToStatistics() : void{
    setTimeout(() => {
      this.router.navigate([`/docente/estadisticas-grupo/${this.idGroup}`]);
    }, 1);
  }

  closeGroup() : void{
    this.alertService.confirmCloseGroup(this.message, this.idGroup, 'closeGroup', 10000);
  }

  redirectToEvaluationCapture() : void{
    setTimeout(() => {
      this.router.navigate([`/docente/capturar-calificaciones-grupo/${this.idGroup}`]);
    }, 1);
  }

  uploadList() : void{
    this.dialog.open(StudentsUploadListComponent , {data : {id : this.idGroup}});
  }

  downloadList() : void{
    this.dialog.open(StudentsDownloadListComponent , {data : {id : this.idGroup, subject : this.subject.claveMateria}});
  }

  getIdGroup(){
    this.route.paramMap.subscribe(params => {
      this.idGroup = params.get('id') || '';
      this.getGroup(this.idGroup);
    });
  }

  getActividadesLength(unitIndex: number): number {
    return this.group?.unidades[unitIndex]?.actividades.length + 1 || 0;
  }

  getGroup(id : string){
    this.groupService.getInfoGroup(id).subscribe((data : any) => {
      if(data.success === true){

        this.group = data.group;
        this.subject = data.subject[0];
        this.students = data.students.alumnos;

        if(this.group.grupoActivo === false){
          this.router.navigate(['/docente/lista-grupos']).then(() => {
            window.location.reload();
          });
        }
      }
    });
  }

}