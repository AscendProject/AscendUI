import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import {VendorSandbox} from '../../../vendor/vendor.sandbox';
import {GlobalErrorHandler} from '../../../shared/globalError_handler/global-error-handler';
import {DialogsService} from '../../../shared/services/index';
import {BroadcastService} from '../../../vendor/services/broadcast.service';
import {IVendorCommunicationModel, ICommunication} from '../../../shared/models/add-vendor-model';
import { MatSnackBar } from '@angular/material';
@Component({
    selector: 'app-rating-communication-score',
    templateUrl: './rating-communication-score.html',
    styleUrls: ['./rating-communication-score.scss'],
})
export class RatingCommunicationScore {
  public title: string;
  public saveButton: string;
  public cancelButton: string;
  public ratingForm: FormControl;
  public ratingValue: number;
  public vendorId: string;

  constructor(public dialogRef: MatDialogRef<RatingCommunicationScore>,
    @Inject(MAT_DIALOG_DATA) public data: any, private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler, private dialogService: DialogsService,
    public broadService: BroadcastService, public snackBar: MatSnackBar) {
      this.vendorId = data.vendorId;
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
    //console.log(this.ratingValue);
    this.editVendorRating(this.ratingValue);
    //this.dialogRef.close(this.ratingValue);
  }
  editVendorRating(ratingvalue){
      let communication = <ICommunication>{
          score: ratingvalue
      }
      let vendorRating = <IVendorCommunicationModel>{
        vendorId : this.vendorId,
        updatedVendorSection: 9,
        vendorCommunication: communication
      }
            this.vendorSandbox.editVendorRating(vendorRating);
        this.vendorSandbox.editVendorRating$.subscribe((data) => {
            this.broadService.broadcast('editVendorRatingcallback', data);
         },(error) => {
           let errResponse = {};
           errResponse = JSON.parse(JSON.stringify(error));
          let dref = this.dialogService.showDialog(errResponse["error"], 'Ok', '500');
            dref.afterClosed().subscribe(result => {
            if (result) {
              
            } else {
            }
          });   
          this.globalErrorHandler.handleError(error);   
         },        
          () => {  
              this.dialogRef.close();
              this.snackBar.open('Communication Score Updated Successfully', 'Close', {
                duration: 3000,
              });
          }); 
      //console.log('disciplinary' + JSON.stringify(disciplinary));
    
  }
  
  close() {
    this.dialogRef.close(null);
  } 
  omit_special_char(event)
{
  const pattern = /[0-5]/;
  //const pattern = /d[0-5]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
}
}