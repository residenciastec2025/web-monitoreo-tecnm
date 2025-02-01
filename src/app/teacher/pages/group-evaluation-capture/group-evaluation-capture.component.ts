import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { SystemService } from '../../../shared/services/system/system.service';
import { GroupService } from '../../../shared/services/group/group.service';
import { subject } from '../../../shared/interfaces/subject.interface';
import { student } from '../../../shared/interfaces/student.intefaces';
import { group } from '../../../shared/interfaces/group.interfaces';
import { NgClass } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../../shared/services/student/student.service';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';

@Component({
  selector: 'app-group-evaluation-capture',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './group-evaluation-capture.component.html',
  styleUrl: './group-evaluation-capture.component.css'
})
export class GroupEvaluationCaptureComponent implements OnInit{
  public darkTheme = signal(false);
  public idGroup : string = '';
  public group: group = {} as group;
  public subject: subject = {} as subject; 
  public students : student [] = [];

  public studentsForm = this.formBuilder.group({
    grupo : ['', Validators.required],
    alumnos : this.formBuilder.array([])
  });

  constructor(
    private studentService : StudentService,
    private groupService : GroupService,
    private systemService : SystemService,
    private alertService : AlertsService,
    private formBuilder: FormBuilder,
    private route : ActivatedRoute,
    private router : Router,
    private dialog : MatDialog
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.getIdGroup();
    this.studentsForm.patchValue({'grupo' : this.idGroup});
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  redirectToGroup() : void{
    setTimeout(() => {
      this.router.navigate([`/docente/detalles-grupo/${this.idGroup}`]);
    }, 1);
  }

  getIdGroup(){
    this.route.paramMap.subscribe(params => {
      this.idGroup = params.get('id') || '';
      this.getGroup(this.idGroup);
    });
  }

  getActividadesLength(unitIndex: number): number {
    return this.group?.unidades[unitIndex]?.actividades.length || 0;
  }

  getGroup(id : string){
    this.groupService.getInfoGroup(id).subscribe((data : any) => {
      if(data.success === true){
        this.group = data.group;
        this.subject = data.subject[0];
        this.students = data.students.alumnos;
        this.copyGroupDataToStudents();
      }
    });
  }

  getInputValue(i: number, j: number, k: number): any {
    return this.students[i]?.calificaciones[j]?.actividades[k].calificacionActividad;
  }
  
  setInputValue(newValue: any, i: number, j: number, k: number): void {
    this.students[i].calificaciones[j].actividades[k].calificacionActividad = newValue;
  }

  validateForm() : void{
    this.studentService.updateScores(this.studentsForm.value).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);
        setTimeout(() => {
          this.redirectToGroup();
        }, 3000);
      }
    }, (error : any) => {
      this.alertService.errorAlert(error.error.message);
    });
  }

  copyGroupDataToStudents(){
    const alumnosArray = this.studentsForm.get('alumnos') as FormArray;
    alumnosArray.clear();
  
    this.students.forEach(student => {
        const studentFormGroup = this.formBuilder.group({
            idAlumno: [student._id],
            calificaciones: this.formBuilder.array([])
        });

        // Verificar si hay calificaciones existentes para este estudiante
        const existingCalificaciones = student.calificaciones || [];

        // Iterar sobre las unidades del grupo
        this.group.unidades.forEach(unidad => {
            // Crear un FormGroup para representar cada calificación de la unidad
            const calificacionFormGroup = this.formBuilder.group({
                unidad: [unidad.unidad],
                actividades: this.formBuilder.array([])
            });

            // Iterar sobre las actividades de la unidad
            unidad.actividades.forEach(actividad => {
                // Buscar la calificación existente para esta actividad
                const existingCalificacion = existingCalificaciones.find(calificacion => calificacion.unidad === unidad.unidad && calificacion.actividades.some(act => act.nombreActividad === actividad.nombre));
                const calificacionActividad = existingCalificacion ? existingCalificacion.actividades.find(act => act.nombreActividad === actividad.nombre)?.calificacionActividad : ''; // Usar la calificación existente si está presente

                // Crear un FormGroup para representar cada actividad
                const actividadFormGroup = this.formBuilder.group({
                    nombreActividad: [actividad.nombre],
                    calificacionActividad: [calificacionActividad, Validators.required] // Asignar la calificación existente o 0 si no existe
                });

                // Agregar el FormGroup de la actividad al FormArray de actividades de la calificación
                (calificacionFormGroup.get('actividades') as FormArray).push(actividadFormGroup);
            });

            // Agregar el FormGroup de la calificación al FormArray de calificaciones del estudiante
            (studentFormGroup.get('calificaciones') as FormArray).push(calificacionFormGroup);
        });

        // Agregar el FormGroup del estudiante al FormArray de estudiantes
        alumnosArray.push(studentFormGroup);
    });
  }
  
  addData(student: number, unit: number, activity: number, score: number) {
    let i = student;
    let j = unit;
    let k = activity; 

    if(score < 0 || score > 100){
      this.alertService.errorAlert('La calificacion debe ser entre 0 y 100');
      this.setInputValue(0, i, j ,k);
      return;
    }

    const studentForm = (this.studentsForm.get('alumnos') as FormArray).at(i) as FormGroup;

    if (!studentForm) {
      console.error('No se encontró el estudiante en el formulario.');
      return;
    }

    const calificacionControl = (studentForm.get('calificaciones') as FormArray).at(j) as FormGroup;
    const actividadControl = (calificacionControl.get('actividades') as FormArray).at(k) as FormGroup;

    actividadControl.get('calificacionActividad')?.setValue(score);
  }

}