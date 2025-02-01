import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { SystemService } from '../../../shared/services/system/system.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-subject-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './subject-card.component.html',
  styleUrl: './subject-card.component.css'
})
export class SubjectCardComponent implements OnInit{

  @Input() clave = '';
  @Input() materia = '';

  public darkTheme = signal(false);

  private systemService = inject(SystemService);

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }
  
}