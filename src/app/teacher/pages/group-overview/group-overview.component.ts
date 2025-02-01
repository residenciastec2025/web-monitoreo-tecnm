import { Component, OnInit, signal } from '@angular/core';
import { SystemService } from '../../../shared/services/system/system.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

import { GroupService } from '../../../shared/services/group/group.service';
import { subject } from '../../../shared/interfaces/subject.interface';
import { group } from '../../../shared/interfaces/group.interfaces';
import { GroupCardComponent } from "../../components/group-card/group-card.component";

@Component({
    selector: 'app-group-overview',
    standalone: true,
    templateUrl: './group-overview.component.html',
    styleUrl: './group-overview.component.css',
    imports: [NgClass, GroupCardComponent]
})
export class GroupOverviewComponent implements OnInit{

  public darkTheme = signal(false);
  public groups : group[] = [];
  public subjects : subject[] = [];

  constructor(
    private groupService : GroupService,
    private systemService : SystemService,
    private router : Router
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.getGroups();
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  addGruop() : void{
    this.router.navigate(['/docente/registrar-nuevo-grupo']);
  }

  getGroups() : void{
    this.groupService.getMyGroups().subscribe((data : any) => {
      if(data.success === true){
        this.groups = data.groups;
        this.subjects = data.subjects;
      }
    });
  }

}