import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent {


    public title: string;
    public message: string;

    constructor(public dialogRef: MatDialogRef<AlertDialogComponent>) {

    }
}