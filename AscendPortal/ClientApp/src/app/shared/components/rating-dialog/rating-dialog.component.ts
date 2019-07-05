import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.scss'],
})
export class RatingDialogComponent {
  public title: string;
  public saveButton: string;
  public cancelButton: string;
  public ratingForm: FormControl;
  public ratingValue: number;

  constructor(public dialogRef: MatDialogRef<RatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.saveButton = data.saveButton;
    this.cancelButton = data.cancelButton;
    this.ratingForm = new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(5),
      Validators.pattern(/^[0-9]{0,1}(\.[0-9]{0,1})?$/),
    ]);

  }

  save() {
    this.dialogRef.close(this.ratingValue);
  }

  close() {
    this.dialogRef.close(null);
  }
}
