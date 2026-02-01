import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { AuthService } from '../../../auth/services/auth/auth.service';
import { SystemService } from '../../../shared/services/system/system.service';
import { teacher } from '../../../shared/interfaces/teacher.interfaces';
import { AdminService } from '../../../shared/services/admin/admin.service';
import { AlertsService } from '../../../shared/services/alerts/alerts.service';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.css'
})
export class AdminsComponent implements OnInit{

  // informacion y preferencias
  public darkTheme = signal(false);
  public career !: string;
  public admins : teacher[] = [];
  public searchTerm: string = '';

  // paginado
  public currentPage : number = 1;
  public pageSize : number = 20;
  public totalPages : number = 1;

  // servicios
  constructor(
    private authService :  AuthService,
    private adminService : AdminService,
    private router : Router,
    private systemService : SystemService,
    private alertService : AlertsService
  ){}

  ngOnInit(): void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    // obtener la informacion al cargar la pagina
    this.getCareerName(); 
    this.getAdminList();
  }

  // obtener preferencias del modo de color
  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

  // descargar el pdf con los administradores
  downloadAdmins(){
    this.adminService.exportAdmins().subscribe((data : Blob) => {
      const url = window.URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'administradores.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    });
  }

  // ir a la pagina para agregar un nuevo administrador
  registerAdmin() : void{
    this.router.navigate(['/administrador/registrar-administrador']);
  }

  // obtener el nombre de carrera del usuario
  getCareerName() : void{
    this.authService.userInfo().subscribe((data : any) => {
      if(data.success === true){
        this.career = data.user?.carrera;
      }
    });
  }

  // obtener la informacion de los administradores mediante una peticion http al servidor
  getAdminList() : void{
    this.adminService.getAdminsInfo(this.searchTerm, this.currentPage, this.pageSize).subscribe((data : any) => {
      if(data.success === true){
        // guardar la informacion en admins
        this.admins = data.admins;
        this.totalPages = data.totalPages;
      }
    });
  }

  // Eliminar administrador mediante id
  deleteAdmin(id : string) : void{
    this.adminService.deleteAdminAccount(id).subscribe((data : any) => {
      if(data.success === true){
        this.alertService.successAlert(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 5001);
      }
    }, (error : any) => {
      this.alertService.errorAlert(error.error.message);
    });
  }

  // enviar una peticion para buscar administradores 
  onSearch(): void {
    this.adminService.getAdminsInfo(this.searchTerm).subscribe((data : any) => {
      if(data.success === true){
        this.admins = data.admins;
        this.totalPages = data.totalPages;
      }
    });
  }

  // ir a la pagina anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAdminList();
    }
  }

  // ir a la pagina siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAdminList();
    }
  }

  // ir a una x pagina
  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAdminList();
    }
  }

}