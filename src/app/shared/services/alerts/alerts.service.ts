import { ComponentType } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertErrorComponent } from '../../components/alert-error/alert-error.component';
import { AlertSuccessComponent } from '../../components/alert-success/alert-success.component';
import { AlertConfirmComponent } from '../../components/alert-confirm/alert-confirm.component';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private dialog = inject(MatDialog);

  private openAlert<T>(component : ComponentType<T>, data : any, duration?: number): MatDialogRef<T>{
    const dialogRef : MatDialogRef<T> = this.dialog.open(component, {
      data : data
    });

    if (duration) {
      dialogRef.afterOpened().subscribe(() => {
        setTimeout(() => {
          dialogRef.close();
        }, duration);
      });
    }else{
      dialogRef.afterOpened().subscribe(() => {
        setTimeout(() => {
          dialogRef.close();
        }, 3000);
      });
    }
  
    return dialogRef;
  }
  
  errorAlert(message : string): MatDialogRef<AlertErrorComponent>{
    return this.openAlert(AlertErrorComponent, { message });
  }
  
  successAlert(message : string): MatDialogRef<AlertSuccessComponent>{
    return this.openAlert(AlertSuccessComponent, { message });
  }

  confirmCloseGroup(message : string, group : string, reason : string, duration?: number): MatDialogRef<AlertConfirmComponent>{
    return this.openAlert(AlertConfirmComponent, { message, group, reason }, duration);
  }
  
  confirmAlert(message : string, email : string, reason : string): MatDialogRef<AlertConfirmComponent>{
    return this.openAlert(AlertConfirmComponent, { message, email, reason });
  }

}