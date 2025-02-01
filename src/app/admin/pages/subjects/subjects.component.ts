import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgClass } from '@angular/common';

import { SubjectService } from '../../../shared/services/subject/subject.service';
import { subject, subjects } from '../../../shared/interfaces/subject.interface';
import { SubjectCardComponent } from "../../components/subject-card/subject-card.component";
import { SubjectsUploadFileComponent } from '../../components/subjects-upload-file/subjects-upload-file.component';
import { SystemService } from '../../../shared/services/system/system.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-subjects',
    standalone: true,
    templateUrl: './subjects.component.html',
    styleUrl: './subjects.component.css',
    imports: [NgClass, SubjectCardComponent, FormsModule]
})
export class SubjectsComponent implements OnInit{

  public darkTheme = signal(false);
  public subjects : subject[] = [];
  public career !: string;
  public subjectKeys : any[] = [];
  public selectedSubjectId !: string;

  constructor(
    private subjectService : SubjectService,
    private systemService : SystemService,
    private dialog : MatDialog
  ){}

  ngOnInit(): void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.getSubjects();
    this.getSubjectsKey();
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  getSubjects(search ?: string) : void {
    this.subjectService.getSubjectsByCareer(search).subscribe((data : any) => {
      if(data.success === true){
        this.career = data.subjects?.carrera || 'No especificada';
        this.subjects = data.subjects?.materias; 
      } else {
        this.subjects = [];
      }
    });
  }
  
  getSubjectsKey(){
    this.subjectService.getSubjectsKey().subscribe((data : any) => {
      if(data.success === true){
        this.subjectKeys = data.subjects;
      }
    });
  }

  uploadSubjects(){
    this.dialog.open(SubjectsUploadFileComponent);
  }

}