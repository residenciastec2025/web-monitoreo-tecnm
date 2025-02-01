import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';

import { SystemService } from '../../../shared/services/system/system.service';
import { GroupService } from '../../../shared/services/group/group.service';
import { StudentService } from '../../../shared/services/student/student.service';
import { student } from '../../../shared/interfaces/student.intefaces';
import { subject } from '../../../shared/interfaces/subject.interface';
import { group } from '../../../shared/interfaces/group.interfaces';

import { CanvasJS, CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { AverageRange, ChartData } from '../../../shared/interfaces/chart.interfaces';

CanvasJS.addColorSet("blue", [
  "#3f8efc",
  "#a594f9",
  "#9abe26",
  "#ffc300",
  "#38a3a5",
  "#4c956c",
  "#eaac8b",
  "#c0c0c0",
  "#fed9b7",
]);

@Component({
    selector: 'app-group-statistics',
    standalone: true,
    templateUrl: './group-statistics.component.html',
    styleUrl: './group-statistics.component.css',
    imports: [NgClass, CanvasJSAngularChartsModule]
})
export class GroupStatisticsComponent implements OnInit{

  public darkTheme = signal(false);
  public idGroup : string = '';
  public groupStatistics: any = []; 
  public group: group = {} as group;
  public subject: subject = {} as subject; 
  public students : student [] = [];

  // Informacion graficas
  public chartsData!: ChartData;
  public chartImages: string[] = [];
  public files: File[] = [];

  // Graficas
  public unitChart : any;
  public averagesChart : any;
  public studentsChart : any;

  // Informacion de las graficas
  public dataPointsUnitChart: any[] = [];
  public dataPointsAveragesChart: any[] = [];
  public dataPointsStudentsChart: any[] = [];

  // Perzonalizacion de las graficas
  chartOptions1 = {
    animationEnabled: true,
    colorSet: "blue",
    axisY: {
      titleFontSize: 20,
      titleFontFamily: "Arial",
      labelFontSize: 20,
      labelFontFamily: "Arial",
    },
    axisX:{
      titleFontSize: 16,
      titleFontFamily: "Arial",
      labelFontSize: 16,
      labelFontFamily: "Arial" 
    },
    legend:{
      fontSize: 16,
     },
    data: [] as any[], // Especificar el tipo como un arreglo de cualquier tipo
  };
  chartOptions2 = {
    animationEnabled: true,
    colorSet: "blue",
    axisY: {
      titleFontSize: 20,
      titleFontFamily: "Arial",
      labelFontSize: 20,
      labelFontFamily: "Arial" 
    },
    axisX : {
      title : "Calificaciones",
      titleFontSize: 20,
      titleFontFamily: "Arial",
      labelFontSize: 20,
      labelFontFamily: "Arial" 
    },
    data: [] as any[],
  };
  chartOptions3 = {
    animationEnabled: true,
    colorSet: "blue",
    axisY: {
      titleFontSize: 20,
      titleFontFamily: "Arial",
      labelFontSize: 20,
      labelFontFamily: "Arial" 
    },
    axisX:{
      title : 'Estado',
      titleFontSize: 20,
      titleFontFamily: "Arial",
      labelFontSize: 20,
      labelFontFamily: "Arial" 
    },
    data: [] as any[],
  };

  constructor(
    private systemService : SystemService,
    private groupService : GroupService,
    private studentService : StudentService,
    private router : Router,
    private route : ActivatedRoute,
  ){}

  ngOnInit() : void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.getIdGroup();
  }

  ngAfterViewInit() : void {
    this.updateCharts();
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

  getGroup(id : string){
    this.groupService.getInfoGroup(id).subscribe((data : any) => {
      if(data.success === true){
        this.group = data.group;
        this.subject = data.subject[0];
        this.students = data.students.alumnos;

        if(this.group.grupoActivo === false){
          this.router.navigate(['/docente/lista-grupos']).then(() => {
            window.location.reload();
          });
        }

        this.getGroupStatistics(this.idGroup);
      }
    });
  }

  getGroupStatistics(id : string){
    this.studentService.getGroupStatistics(id).subscribe((data : any) => {
      if(data.success === true){
        this.groupStatistics = data.group;

        this.chartsData = data.group;
        this.updateUnitChartData();
        this.updateAveragesChart();
        this.updateStudentsChart();
      }
    });
  }

  // Asignar informacion a las graficas
  updateUnitChartData(){
    this.dataPointsUnitChart = []; // Vaciar dataPoints

    // Obtener la cantidad de unidades
    const unitCount = this.chartsData.units.length;

    // Iterar sobre los tipos de estudiantes (aprobados, reprobados, desertores)
    for (let i = 0; i < 3; i++) {
      // Crear una serie de datos para cada tipo de estudiante
      const dataSeries = {
        type: "column",
        name: i === 0 ? "Aprobados" : i === 1 ? "Reprobados" : "Desertores",
        legendText: i === 0 ? "Aprobados" : i === 1 ? "Reprobados" : "Desertores",
        showInLegend: true,
        indexLabel: "{y} alu.",
        indexLabelFontSize: 20,
        dataPoints: [] as { label: string; y: number }[], // Especificar el tipo de dataPoints
      };

      // Iterar sobre las unidades y agregar los datos correspondientes
      for (let j = 0; j < unitCount; j++) {
        const unitData = this.chartsData.units[j];
        const value = i === 0 ? unitData.aprobados : i === 1 ? unitData.reprobados : unitData.desertores;
        dataSeries.dataPoints.push({ label: `U${j+1}`, y: value });
      }

      // Agregar la serie de datos a la configuración del gráfico
      this.chartOptions1.data.push(dataSeries);
    }

    this.updateCharts();
  }
  
  updateAveragesChart(){
    this.dataPointsAveragesChart = []; // Vaciar dataPoints
    // Obtener los datos de averageRange
    const averageRangeData: AverageRange = this.chartsData.averageRange;

    // Iterar sobre los rangos de calificación y agregar los datos correspondientes
    for (const range in averageRangeData) {
        if (averageRangeData.hasOwnProperty(range)) {
          const label = range.split("_").slice(1).join("_").replace('_', '-');
          this.dataPointsAveragesChart.push({ label: label, y: averageRangeData[range] });
        }
    }

    // Agregar la serie de datos a la configuración del gráfico
    this.chartOptions2.data.push({
        type: "splineArea",
        indexLabel: "{y} alu.",
        indexLabelFontSize: 20,
        yValueFormatString: "#,###",
        dataPoints: this.dataPointsAveragesChart
    });
    this.updateCharts();
  }
  
  updateStudentsChart(){
    this.dataPointsStudentsChart.push(
      { label: `Apro. ${this.chartsData.finalPercentages.aprobados}`, y: this.chartsData.final.aprobados },
      { label: `Repro. ${this.chartsData.finalPercentages.reprobados}`, y: this.chartsData.final.reprobados },
      { label: `Deser. ${this.chartsData.finalPercentages.desertores}`, y: this.chartsData.final.desertores },
    );

    this.chartOptions3.data.push({
      type: "column",
      indexLabel: "{y} alu.",
      indexLabelFontSize: 20,
      yValueFormatString: "#,###",
      dataPoints: this.dataPointsStudentsChart
    });

    this.updateCharts();
  }

  // Crear instancias
  getChartInstance1(chart: object) {
    this.unitChart = chart;
    this.updateCharts();
  }

  getChartInstance2(chart: object) {
    this.averagesChart = chart;
    this.updateCharts();
  }

  getChartInstance3(chart: object) {
    this.studentsChart = chart;
    this.updateCharts();
  }

  // Actualizar graficas
  updateCharts = () => {
    this.unitChart?.render();
    this.averagesChart?.render();
    this.studentsChart?.render();
  }

  addAverageSeries(){
    let chart1 = this.unitChart;
    let chart2 = this.averagesChart;
    let chart3 = this.studentsChart;

    let image1 = chart1.exportChart({ format: 'png', toDataURL: true });
    let image2 = chart2.exportChart({ format: 'png', toDataURL: true });
    let image3 = chart3.exportChart({ format: 'png', toDataURL: true });

    // Convierte las imágenes en objetos File
    let file1 = this.base64ToFile(image1, 'chart1.png');
    let file2 = this.base64ToFile(image2, 'chart2.png');
    let file3 = this.base64ToFile(image3, 'chart3.png');

    // Agrega los archivos al arreglo de archivos
    this.files.push(file1);
    this.files.push(file2);
    this.files.push(file3);
  }

  getFileURL(file: File): string {
    return URL.createObjectURL(file);
  }

  base64ToFile(dataURI: string, fileName: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    return new File([blob], fileName, { type: 'image/png' });
  }

  verifyForm(): void {
    this.addAverageSeries();

    const formData = new FormData();
    this.files.forEach(file => {
        formData.append('files', file);
    });

    this.sendForm(formData);
  }

  sendForm(formData : FormData){
    this.groupService.generateStatistics(formData, this.idGroup).subscribe((data : Blob) => {
      const url = window.URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${this.subject.claveMateria}_datos_estudiantes.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    });

    setTimeout(() => {
      this.router.navigate([`/docente/estadisticas-grupo/${this.idGroup}`]).then(() => {
        window.location.reload();
      });
    }, 5000);
  }

}