import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemService } from '../../services/system/system.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-alert-error',
  standalone: true,
  imports: [NgClass],
  templateUrl: './alert-error.component.html',
  styleUrl: './alert-error.component.css'
})
export class AlertErrorComponent implements OnInit{
  darkTheme = signal(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private systemService : SystemService
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

}