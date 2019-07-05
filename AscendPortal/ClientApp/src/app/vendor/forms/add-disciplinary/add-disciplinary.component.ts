import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { DialogsService } from '../../../shared/services/index';
import { IAddDisciplinary } from '../../../shared/models/disciplinary-model';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'app-add-disciplinary',
  templateUrl: './add-disciplinary.component.html',
  styleUrls: ['./add-disciplinary.component.scss']
})
export class AddDisciplinaryComponent implements OnInit {
  public disciplinaryActionForm: FormGroup;
  public discplinaryactions: string[];
  public discstatus: string[];
  public licenseId: any;
  public disciplinaryActionId: any;
  public mindate: Date = new Date();
  expDate: Date;
  effDate: Date;
  disciplinarydetailsdata: any;
  disciplinarydetailsdataedit: any;
  disaction: any;
  ltitle: any;
  isdisable: boolean = false;
  formattedTodayDate: string;
  vendorId: String;
  pastExpireErrorMessage = "Expiration date should be later than Effective date";

  constructor(public $fb: FormBuilder, private dialogService: DialogsService, 
    public route: ActivatedRoute,public router: Router, private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    public dialogRef: MatDialogRef<AddDisciplinaryComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public broadService: BroadcastService,public zone: NgZone ) {
      this.licenseId = data.licenseid;
      this.vendorId = data.vendorId;
    }

    ngOnInit() {
      this.discplinaryactions = ['Suspension', 'Revocation', 'Voluntary Surrender'];
      this.discstatus = ['Active', 'Resolved'];
      this.broadService.on<any>('adddisciplinarycallback').subscribe((obj) => {
        this.zone.run(() => {
          // Angular2 Issue
        });
      });
      
      //   if (this.licenseId.length == 36){
      //   this.ltitle = "Edit";
      //   this.getDisciplinaryDataById();
      //   this.initializeDisciplinaryActionFormOnEdit();
      // }
      // else{
          this.initializeDisciplinaryActionForm();
          this.ltitle = "Add";         
      //}
    }

   
  private initializeDisciplinaryActionForm(): void {
  this.disciplinaryActionForm = this.$fb.group({
    disciplinaryAction: [''],
    disciplinaryStatus: [''],
    effectiveDate: null,
    expirationDate: null,
    Comments:['']
      });
    }


    ValidateExpiryDate(controlValue, controlName) {
      if(this.disciplinaryActionForm.get('expirationDate').value  && 
      (this.isValidDate(controlValue, controlName)))
      
      {
        setTimeout(() => {
          //this.expDate = new Date('');}, 50);
          this.disciplinaryActionForm.get('expirationDate').setValue(new Date(''));}, 50);
          this.isdisable = true;
          
      }
      if ((this.disciplinaryActionForm.get('effectiveDate').value != null) 
      && this.ComparesDates(controlValue, this.disciplinaryActionForm.get('effectiveDate').value)) {
        let dref = this.dialogService.showDialog(this.pastExpireErrorMessage, 'Ok', '500');
        dref.afterClosed().subscribe(result => {
        });
        setTimeout(() => {
          //this.expDate = new Date('');}, 50);
          this.disciplinaryActionForm.get('expirationDate').setValue(new Date(''));}, 50);
          this.isdisable = true;
      }
    
    }
    
    ValidateEffectiveDate(controlValue, controlName) {
      if(this.disciplinaryActionForm.get('effectiveDate').value && 
      (this.isValidDate(controlValue, controlName)))
      
      {
        setTimeout(() => {
          //this.effDate = new Date('');}, 50);
          this.disciplinaryActionForm.get('effectiveDate').setValue(new Date(''));}, 50);
          this.isdisable = true;
      }
      if (this.disciplinaryActionForm.get('expirationDate').value != null) {
            if (this.ComparesDates(this.disciplinaryActionForm.get('expirationDate').value, controlValue)) {
              let dref = this.dialogService.showDialog(this.pastExpireErrorMessage, 'Ok', '500');
              dref.afterClosed().subscribe(result => {
              });
              setTimeout(() => {
                //this.effDate = new Date('');}, 50);
                this.disciplinaryActionForm.get('effectiveDate').setValue(new Date(''));}, 50);
                this.isdisable = true;
            }
          } 
    }
    
   isValidDate(controlValue, controlName) {
      //console.log(controlValue);
      if (!moment(controlValue, 'MM/DD/YYYY').isValid()) {
        return true;
      }
    }
    
  
  ComparesDates(startDate,endDate) {
      return moment(endDate).isAfter(startDate);
    }
  
    omit_special_char(event) {
      const pattern = /[0-9\-\/]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
      }
    }
    onBlurMethod(value,e){
        //console.log('value'+ value + 'e' + e);
    }
    addDisciplinaryActionDialog(){
      let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '500');
      dref.afterClosed().subscribe(result => {
        //console.log(`Dialog closed: ${result}`);
        if (result) {
          this.addDisciplinaryAction();
        } else {
        }
      });
    }
    addDisciplinaryAction(){
      let form = this.disciplinaryActionForm.value;
      let disciplinary = <IAddDisciplinary>{
        vendorId: this.vendorId,
        licenseId: this.licenseId,
        diciplinaryActionId: '',
        diciplinaryAction: {
          disciplinaryAction: form.disciplinaryAction,
          activeResolved: form.disciplinaryStatus,
          effectiveDate: form.effectiveDate,
          expirationDate: form.expirationDate,
          comments: form.Comments,
          isDeleted: false
        }
      }
      console.log('disciplinary: ' + JSON.stringify(disciplinary));
            this.vendorSandbox.addDisciplinaryList(disciplinary);
        this.vendorSandbox.addDisciplinary$.subscribe((data) => {
            this.broadService.broadcast('adddisciplinarycallback', data);
         },(error) => {
           let errResponse = {};
           errResponse = JSON.parse(JSON.stringify(error));
          let dref = this.dialogService.showDialog(errResponse["error"], 'Ok', '500');
            dref.afterClosed().subscribe(result => {
            if (result) {
              // this.vendorAvailabilityForm.reset();
            } else {
            }
          });   
          this.globalErrorHandler.handleError(error);   
         },        
          () => {
            //this.router.navigate(['vendor', 'licesedetails', this.licenseId]);
              this.disciplinaryActionForm.reset();  
              this.dialogRef.close();
          }); 
      //console.log('disciplinary' + JSON.stringify(disciplinary));
    }
    onCancel(){
      this.dialogRef.close();
    }

}
