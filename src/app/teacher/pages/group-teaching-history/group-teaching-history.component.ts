import { Component, OnInit, signal } from '@angular/core';
import { TeacherService } from '../../../shared/services/teacher/teacher.service';
import { SystemService } from '../../../shared/services/system/system.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { GroupService } from '../../../shared/services/group/group.service';
import { group } from '../../../shared/interfaces/group.interfaces';
import { subject } from '../../../shared/interfaces/subject.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-teaching-history',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './group-teaching-history.component.html',
  styleUrl: './group-teaching-history.component.css'
})
export class GroupTeachingHistoryComponent implements OnInit {

  public darkTheme = signal(false);
  public groups : group[] = [];
  public subjects : subject[] = [];
  public searchTerm: string = '';

  public currentPage : number = 1;
  public pageSize : number = 10;
  public totalPages : number = 1;

  constructor(
    private teacherService : TeacherService,
    private groupService : GroupService,
    private router : Router,
    private systemService : SystemService
  ){}

  ngOnInit(): void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.getGroups();
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  getGroups(): void {
    this.groupService.getMyGroupHistory(this.searchTerm, this.currentPage, this.pageSize).subscribe((data: any) => {
      if (data.success === true) {
        this.groups = data.groups;
        this.subjects = data.subjects;
        this.totalPages = data.totalPages;
      }
    });
  }

  onSearch(): void {
    this.groupService.getMyGroups(this.searchTerm).subscribe((data: any) => {
      if (data.success) {
        this.groups = data.groups;
        this.subjects = data.subjects;
      }
    });
  }

  downloadHistory(){
    this.groupService.exportGroupsByTeacher().subscribe((data : Blob) => {
      const url = window.URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `historial_grupos.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    });

    setTimeout(() => {
      this.router.navigate([`/docente/historial-grupos`]).then(() => {
        window.location.reload();
      });
    }, 5000);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getGroups();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getGroups();
    }
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getGroups();
    }
  }
  
}