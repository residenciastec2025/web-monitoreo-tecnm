import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgClass } from '@angular/common';

import { PeriodService } from '../../../shared/services/period/period.service';
import { period } from '../../../shared/interfaces/period.interfaces';
import { AddNewPeriodComponent } from '../../components/period-add/add-new-period.component';
import { SystemService } from '../../../shared/services/system/system.service';
import { AuthService } from '../../../auth/services/auth/auth.service';


@Component({
  selector: 'app-periods',
  standalone: true,
  imports: [NgClass],
  templateUrl: './periods.component.html',
  styleUrl: './periods.component.css'
})
export class PeriodsComponent implements OnInit{

  public darkTheme = signal(false);
  public career !: string;
  public periods : period[] = [];
  public subjects : any[] = [];

  public currentPage : number = 1;
  public pageSize : number = 20;
  public totalPages : number = 1;

  constructor(
    private authService : AuthService,
    private periodService : PeriodService,
    private systemService : SystemService,
    private dialog : MatDialog,
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });
    
    this.getCareerName();
    this.getDataPeriods();
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  addPeriod() : void{
    this.dialog.open(AddNewPeriodComponent);
  }

  downloadPeriods(){
    this.periodService.exportPeriods().subscribe((data : Blob) => {
      const url = window.URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'periodos.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    });
  }

  getCareerName() : void{
    this.authService.userInfo().subscribe((data : any) => {
      if(data.success === true){
        this.career = data.user?.carrera;
      }
    });
  }

  getDataPeriods(){
    this.periodService.getPeriods(this.currentPage, this.pageSize).subscribe((data : any) => {
      if(data.success === true){
        this.periods = data.periods;
        this.subjects = data.subjects;
        this.totalPages = data.totalPages;
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getDataPeriods();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getDataPeriods();
    }
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getDataPeriods();
    }
  }

}