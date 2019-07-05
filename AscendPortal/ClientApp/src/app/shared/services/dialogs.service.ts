import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { AddDisciplinaryComponent, DisciplinaryDetailsComponent, EditVendorTypeStatusComponent } from '../components';
import {RatingCommunicationScore} from '../components/index';
import{AttestationDetailsComponent} from '../../vendor/forms/attestation-details/attestation-details.component';

@Injectable()
export class DialogsService {

  constructor(private dialog: MatDialog) { }

  showDialog(msg: string, btnName: string, width): any {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      msg,
      buttonName: btnName
    };
    dialogConfig.width = width + 'px';   
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    return dialogRef;
  }

  showAddDisciplinaryDialog(vid: String, licid: string, btnName: string, width): any {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      vendorId: vid,
      licenseid: licid,
      buttonName: btnName
    };
    dialogConfig.width = width + 'px';
    //dialogConfig.height =  '350px';
    const dialogRef = this.dialog.open(AddDisciplinaryComponent, dialogConfig);
    return dialogRef;
  }
  viewDisciplinaryDialog(vid: String, licenseid,disciplinaryActionId,width){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      vendorId: vid,
      licenseId: licenseid,
      disciplinaryActionId: disciplinaryActionId
    };
    dialogConfig.width = width + 'px';
    const dialogRef = this.dialog.open(DisciplinaryDetailsComponent, dialogConfig);
    return dialogRef;
  }

  showVendorTypeAndStatustDialog(data: string[], Title: string, btnName: string, width): any {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      msg: data,
      buttonName: btnName,
      title: Title
    };
    dialogConfig.width = width + 'px';
    //dialogConfig.height = 250 + 'px';
    const dialogRef = this.dialog.open(EditVendorTypeStatusComponent, dialogConfig);
    return dialogRef;
  }
  
  /* Update Rating in Summary Page*/
  //updateRatingDialog(vendorId: string, btnName: string, width): any {
    updateRatingDialog(vendorId: string,title: string, saveButton: string, cancelButton: string): any {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      vendorId: vendorId,
      title: title,
      saveButton: saveButton,
      cancelButton: cancelButton
      //buttonName: btnName
    };
    dialogConfig.width = '500px';
    //dialogConfig.height =  '350px';
    const dialogRef = this.dialog.open(RatingCommunicationScore, dialogConfig);
    return dialogRef;
  }

  showAttestationDialog(attestationObject): any {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      msg: attestationObject
    };
    dialogConfig.width = 600 + 'px';
   // dialogConfig.height = '550px';
    const dialogRef = this.dialog.open(AttestationDetailsComponent, dialogConfig);
    return dialogRef;
  }
}
