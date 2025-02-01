import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { SystemService } from '../../../shared/services/system/system.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css'
})
export class GroupCardComponent implements OnInit{

  @Input() clave !: string;
  @Input() materia !: string;
  @Input() grupo !: number;
  @Input() id !: string;

  public darkTheme = signal(false);
  private systemService = inject(SystemService);
  private router = inject(Router);

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  openGroup(id : string){
    this.router.navigate([`/docente/detalles-grupo/${id}`]);
  }

}