import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemService } from '../../services/system/system.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-alert-success',
  standalone: true,
  imports: [NgClass],
  templateUrl: './alert-success.component.html',
  styleUrl: './alert-success.component.css'
})
export class AlertSuccessComponent implements OnInit{
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