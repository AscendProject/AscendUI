import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DialogsService } from '../../../shared/services/index';
import * as moment from 'moment';
import { IAddDisciplinary } from '../../../shared/models/disciplinary-model';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'app-disciplinary-details',
  templateUrl: './disciplinary-details.component.html',
  styleUrls: ['./disciplinary-details.component.scss']
})
export class DisciplinaryDetailsComponent implements OnInit {
  disciplinaryActionId: string = '';
  licenseId: string = '';
  vendorId: String;
  disciplinarydetailsdata: any;
  isEditClicked: boolean = true;
  showAddDisciplinary: boolean = false;
  public disciplinaryActionForm: FormGroup;
  public discplinaryactions: string[];
  public discstatus: string[];
  public mindate: Date = new Date();
  expDate: Date;
  effDate: Date;
  pastExpireErrorMessage = "Expiration date should be later than Effective date";
  isdisable: boolean = false;

  constructor(private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    public router: Router,
    public route: ActivatedRoute, public $fb: FormBuilder, private dialogService: DialogsService,
    public dialogRef: MatDialogRef<DisciplinaryDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public broadService: BroadcastService,public zone: NgZone) {
    this.disciplinaryActionId = data.disciplinaryActionId;
    this.licenseId = data.licenseId;
    this.vendorId = data.vendorId;
    console.log('vendorId: ' + this.vendorId);
  }
  
  ngOnInit() {
    this.broadService.on<any>('editdisciplinarycallback').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
      });
    });
    this.getDisciplinaryDataById();
  }
  getDisciplinaryDataById() {
    this.vendorSandbox.getDisciplinaryDataById(this.vendorId, this.disciplinaryActionId);
    this.vendorSandbox.getDisciplinaryDataById$.subscribe((data) => {
      if (data != null) {
        this.disciplinarydetailsdata = data;
      }
    }, error => this.globalErrorHandler.handleError(error));

  }
  onCancel() {
    this.dialogRef.close();
  }
  editDisciplinaryAction() {
    this.isEditClicked = false;
    this.showAddDisciplinary = true;
    this.discplinaryactions = ['Suspension', 'Revocation', 'Voluntary Surrender'];
    this.discstatus = ['Active', 'Resolved'];
    this.initializeDisciplinaryActionFormOnEdit();
  }


  private initializeDisciplinaryActionFormOnEdit(): void {
    this.disciplinaryActionForm = this.$fb.group({
      disciplinaryAction: [this.disciplinarydetailsdata["diciplinaryAction"].disciplinaryAction],
      disciplinaryStatus: [this.disciplinarydetailsdata["diciplinaryAction"].activeResolved],
      effectiveDate: [this.disciplinarydetailsdata["diciplinaryAction"].effectiveDate],
      expirationDate: [this.disciplinarydetailsdata["diciplinaryAction"].expirationDate],
      Comments: [this.disciplinarydetailsdata["diciplinaryAction"].comments]
    });
  }

  ValidateExpiryDate(controlValue, controlName) {
    if (this.disciplinaryActionForm.get('expirationDate').value && 
    (this.isValidDate(controlValue, controlName))) {
      setTimeout(() => { 
        this.disciplinaryActionForm.get('expirationDate').setValue(new Date(''));}, 50);
        this.isdisable = true;
    }
    if ((this.disciplinaryActionForm.get('effectiveDate').value != null)
      && this.ComparesDates(controlValue, this.disciplinaryActionForm.get('effectiveDate').value)) {
      let dref = this.dialogService.showDialog(this.pastExpireErrorMessage, 'Ok', '500');
      dref.afterClosed().subscribe(result => {
      });
      setTimeout(() => { 
        this.disciplinaryActionForm.get('expirationDate').setValue(new Date(''));}, 50);
        this.isdisable = true;
    }

  }

  ValidateEffectiveDate(controlValue, controlName) {
    if (this.disciplinaryActionForm.get('effectiveDate').value &&
    (this.isValidDate(controlValue, controlName))) {
      setTimeout(() => { 
        this.disciplinaryActionForm.get('effectiveDate').setValue(new Date(''));}, 50);
        this.isdisable = true;
    }
    if (this.disciplinaryActionForm.get('expirationDate').value != null) {
      if (this.ComparesDates(this.disciplinaryActionForm.get('expirationDate').value, controlValue)) {
        let dref = this.dialogService.showDialog(this.pastExpireErrorMessage, 'Ok', '500');
        dref.afterClosed().subscribe(result => {
        });
        setTimeout(() => { 
          this.disciplinaryActionForm.get('effectiveDate').setValue(new Date(''));}, 50);
          this.isdisable = true;
      }
    }
  }

  isValidDate(controlValue, controlName) {
    if (!moment(controlValue, 'MM/DD/YYYY').isValid()) {
      return true;
    }
  }

  ComparesDates(startDate, endDate) {
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
  onBlurMethod(value, e) {
    //console.log('value' + value + 'e' + e);
  }
  editDisciplinaryActionDialog() {
    let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '500');
    dref.afterClosed().subscribe(result => {
      if (result) {
        this.addDisciplinaryAction();
      } else {
      }
    });
  }
  addDisciplinaryAction() {
    let form = this.disciplinaryActionForm.value;
    let disciplinary = <IAddDisciplinary>{
      vendorId: this.vendorId,
      licenseId: this.licenseId,
      diciplinaryActionId: this.disciplinaryActionId,
      diciplinaryAction: {
        disciplinaryAction: form.disciplinaryAction,
        activeResolved: form.disciplinaryStatus,
        effectiveDate: form.effectiveDate,
        expirationDate: form.expirationDate,
        comments: form.Comments,
        isDeleted: form.isDeleted
      }
    }
    this.vendorSandbox.EditDisciplinaryList(disciplinary);
    this.vendorSandbox.editDisciplinary$.subscribe((data) => {
      this.broadService.broadcast('editdisciplinarycallback', data);
    }, (error) => {
      let errResponse = {};
      errResponse = JSON.parse(JSON.stringify(error));
      let dref = this.dialogService.showDialog(errResponse["error"], 'Ok', '500');
      dref.afterClosed().subscribe(
        result => {
        if (result) {
          // this.vendorAvailabilityForm.reset();
        } else {
        }
      });
      this.globalErrorHandler.handleError(error);
    },
      () => {
        this.disciplinaryActionForm.reset();
        this.dialogRef.close();
      });
  }

}
