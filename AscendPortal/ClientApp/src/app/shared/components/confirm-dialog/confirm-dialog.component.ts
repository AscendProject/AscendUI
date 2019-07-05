import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
    msgBody: any;
    btnText: any;
  title: string;
  isShowCancel: boolean = true;
  isShowSuccess = true;
  btnCancel = '';

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.msgBody = data.msg;
      this.btnText = data.buttonName;     
      if (data.buttonName === 'Ok') {
        this.isShowCancel = false;
        this.isShowSuccess = true;
      }
      if (data.buttonName === 'Okay') {
        this.isShowCancel = true;
        this.isShowSuccess = true;
        this.btnText = 'Ok';
        this.btnCancel = 'Cancel';
      }
      if (data.buttonName === 'Close') {
        this.isShowCancel = false;
        this.isShowSuccess = false;
      }
      this.title = data.title;
    }
  
    save() {
      this.dialogRef.close(true);
    }
  
    close() {
      this.dialogRef.close(false);
    } 
}
