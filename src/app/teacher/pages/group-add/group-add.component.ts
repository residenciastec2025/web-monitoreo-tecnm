import { NgClass } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormArray} from '@angular/forms';
import { MatStepperModule} from '@angular/material/stepper';

import { SystemService } from '../../../shared/services/system/system.service';
import { PeriodService } from '../../../shared/services/period/period.service';
import { SubjectService } from '../../../shared/services/subject/subject.service';
import { subjects } from '../../../shared/interfaces/subject.interface';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';
import { GroupService } from '../../../shared/services/group/group.service';

@Component({
  selector: 'app-group-add',
  standalone: true,
  imports: [NgClass, MatStepperModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './group-add.component.html',
  styleUrl: './group-add.component.css'
})
export class GroupAddComponent implements OnInit{

  //Signals para validar formularios y modo oscuro
  public darkTheme = signal(false);
  public periodInvalid = signal(false);
  public subjectInvalid = signal(false);
  public groupInvalid = signal(false);
  public activityInvalid = signal(false);

  //Informacion de periodos y materias
  public selectedPeriod: string = '';
  public periodsDescriptions : any[] = [];
  public subjectsData : subjects[] = [];

  //Formularios
  groupForm !: FormGroup;
  public btnDisable = signal(false);
  public groupFormValid = signal(false);
  public unitsFormInvalid = signal(false);
  public unitCounter: number = 0;

  constructor(
    private periodService : PeriodService,
    private subjectService : SubjectService,
    private systemService : SystemService,
    private alertService : AlertsService,
    private groupService : GroupService,
    private formBuilder : FormBuilder,
    private router : Router
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.initializeForm();

    this.getPeriods();
  }

  initializeForm(): void {
    this.groupForm = this.formBuilder.group({
      periodo: [this.selectedPeriod, Validators.required],
      numeroGrupo: ['', [Validators.required, Validators.pattern(/^[1-9]$/)]],
      materia: ['', Validators.required],
      unidades: this.formBuilder.array([])
    });
  
    this.addInitialUnits();
  }
  
  addInitialUnits() {
    for (let i = 0; i < 3; i++) {
      this.addUnit();
    }
  }

  get unitControls() {
    const unitsArray = this.groupForm.get('unidades') as FormArray;
    return unitsArray.controls;
  }
  
  activityControls(unitIndex: number) {
    const unitArray = this.groupForm.get('unidades') as FormArray;
    return (unitArray.at(unitIndex).get('actividades') as FormArray).controls;
  }

  createUnit(unitIndex: number): FormGroup {
    return this.formBuilder.group({
      unidad: [`${unitIndex + 1}`, Validators.required],
      actividades: this.formBuilder.array([this.createActivity()])
    });
  }
  
  createActivity(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', Validators.pattern(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]{3,100}$/)],
      porcentaje: ['', [Validators.required, Validators.pattern(/^100$|^\d{1,2}$/)]]
    });
  }

  addUnit() {
    const unitsArray = this.groupForm.get('unidades') as FormArray;
    const newUnitIndex = unitsArray.length; // Obtener el número actual de unidades
    unitsArray.push(this.createUnit(newUnitIndex)); // Crear una nueva unidad con el número de unidad correcto
  }
  
  addActivity(unitIndex: number) {
    const unitArray = this.groupForm.get('unidades') as FormArray;
    const activitiesArray = (unitArray.at(unitIndex).get('actividades') as FormArray);
    activitiesArray.push(this.createActivity());
  }

  removeUnit() {
    const unitsArray = this.groupForm.get('unidades') as FormArray;
    if (unitsArray.length > 1) {
      const lastIndex = unitsArray.length - 1;
      unitsArray.removeAt(lastIndex);
    }
  }
  
  removeActivity(unitIndex: number) {
    const unitArray = (this.groupForm.get('unidades') as FormArray).at(unitIndex).get('actividades') as FormArray;
    if (unitArray.length > 1) {
      unitArray.removeAt(unitArray.length - 1);
    }
  }

  isMinimumUnitsAndActivities(): boolean {
    const unitsArray = this.groupForm.get('unidades') as FormArray;
    return unitsArray.length >= 1 && this.unitControls.every(unit => (unit.get('actividades') as FormArray).length >= 1);
  }

  isMaximumUnitsAndActivities(): boolean {
    const unitsArray = this.groupForm.get('unidades') as FormArray;
    return unitsArray.length <= 10 && this.unitControls.every(unit => (unit.get('actividades') as FormArray).length <= 10);
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  backGroups() : void {
    this.router.navigate(['/docente/lista-grupos']);
  }

  getPeriods() : void{
    this.periodService.getPeriodsDescriptions().subscribe((data : any) => {
      if(data.success === true){
        this.periodsDescriptions = data.periods;
      }
    });
  }

  getSubjects() : void{
    this.groupForm.patchValue({ periodo : this.selectedPeriod });
    this.subjectService.getAllSubjectsCareers(this.selectedPeriod).subscribe((data : any) => {
      if(data.success === true){
        this.subjectsData = data.subjects;
      }
    })
  }
  
  disableBtn() : void{
    this.btnDisable.set(true);
    setTimeout(() => {
      this.btnDisable.set(false);
    }, 3000);
  }

  validateGroupForm() : void{
    this.disableBtn();
    if(this.groupForm.valid){
      this.groupFormValid.set(true);
      this.sendForm();
    }else{
      Object.keys(this.groupForm.controls).forEach(key => {
        const control = this.groupForm.get(key);

        if(control?.invalid){
          switch(key){
            case 'periodo' : this.periodInvalid.set(true); break;
            case 'materia' : this.subjectInvalid.set(true); break;
            case 'numeroGrupo' : this.groupInvalid.set(true); break;
          }
        }

        setTimeout(() => {
          this.periodInvalid.set(false);
          this.subjectInvalid.set(false);
          this.groupInvalid.set(false);
        }, 10000);
      });

      this.alertService.errorAlert('Verifica los campos del formulario');
    }
  }

  sendForm(){
    this.groupService.registerGroup(this.groupForm.value).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);

        setTimeout(() => {
          this.router.navigate(['/docente/lista-grupos']).then(() => {
            window.location.reload();
          });
        }, 3000);
      }
    }, (error : any) => {
      this.alertService.errorAlert(error.error.message);
    });
  }

}