import {
  Component, OnInit, Output, EventEmitter, NgZone, ViewChild
} from '@angular/core';
import * as moment from 'moment';
import { ConfirmDialogComponent } from '../../../shared/components';
import { DialogsService, SessionService } from '../../../shared/services/index';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  BackgroundcheckModel
} from '../../../shared/models/backgroundcheck-model';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { VendorSandbox } from '../../vendor.sandbox';
import { MatDialog, MatSnackBar } from '@angular/material';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'backgroundcheck',
  templateUrl: './backgroundcheck.component.html',
  styleUrls: ['./backgroundcheck.component.scss']
})
export class BackgroundcheckComponent implements OnInit {

  pastExpireErrorMessage1 = "Please note, the date provided is in the past.  Would you like to proceed?";
  pastExpireErrorMessage = "Expiration date should be later than Report date";
  public backgroundCheckFrom: FormGroup;
  public results: string[];
  public vendorId: any;
  public typeofBackgroundChecks: string[];
  public mindate: Date = new Date();
   pastdate: Date;
  backgroundcheckid: any;
  ltitle: string;
  @Output() closeToggle = new EventEmitter();
  viewBgItem: any;
  addEditButtonText: string;
  @ViewChild('f') myForm;
  formattedTodayDate: string;
  expDate: Date;
  repDate: Date;
  reportDatErrorMessage: string;
  expiryDateErrorMessage: string;
  isdisable: boolean = false;
  
  
  //showReportDateErrorMessage: boolean;
 

  constructor(public $fb: FormBuilder, private dialogService: DialogsService,
    public route: ActivatedRoute,
    private vendorSandbox: VendorSandbox,
    public router: Router,
    public snackBar: MatSnackBar,
    private globalErrorHandler: GlobalErrorHandler,
    public broadService: BroadcastService,
    public zone: NgZone,) {
    this.results = ['Pass', 'Fail'];
    this.typeofBackgroundChecks = ['Criminal', 'OFAC', 'Criminal & OFAC'];
    if (this.route.snapshot.children.length !== 0) {
      let vendorid = this.route.snapshot.children[0].params['id']; 
      let selectedLicenseId = this.route.snapshot.children[0].params['bid'];         
      
      if (selectedLicenseId) {
        this.backgroundcheckid = selectedLicenseId;
        this.vendorId = vendorid;
        this.ltitle = 'Edit';
        this.addEditButtonText = 'Update'
        //this.pastdate = expirationDate;
      } else {
        this.vendorId = vendorid;
        this.addEditButtonText = this.ltitle = 'Add';
      }
    }

  }

  ngOnInit() {
    this.broadService.on<any>('addBackgroundCheckItems').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
      });
    });
    
    if (this.backgroundcheckid) {
      this.viewBackgroundCheckItem();     
    } else {
      this.initializeBackgroundForm();
    }
  }


  private initializeBackgroundForm(): void {
    this.backgroundCheckFrom = this.$fb.group({
      bgcompanyName: [, Validators.required],
      referenceID: ['', [Validators.required]],
      result: ['', Validators.required],
      typeofbg: ['', Validators.required],
      expirationDate: null,
      reportDate: null
    });
  }

 
  private viewBackgroundCheckItem(): void {
    this.vendorSandbox.viewBackgroundCheckItem(this.backgroundcheckid, this.vendorId);
    this.vendorSandbox.viewBackgroundCheckItem$.subscribe(
      data => {
        this.viewBgItem = data;
        console.log("edit bg item ==", this.viewBgItem)
        this.initializeBackgroundFormEdit(this.viewBgItem);
      }, error => this.globalErrorHandler.handleError(error));
  }

  private initializeBackgroundFormEdit(data): void  {
    this.backgroundCheckFrom  =  this.$fb.group({
      bgcompanyName: [data.vendorBackgroundCheck.bgCompanyName, [Validators.required]],
      referenceID: [data.vendorBackgroundCheck.referenceID, [Validators.required]],
      result: [data.vendorBackgroundCheck.backgroundCheckResult, [Validators.required]],
      typeofbg: [data.vendorBackgroundCheck.typeOfbgCheck, [Validators.required]],
      expirationDate: [data.vendorBackgroundCheck.expirationDate],
      reportDate: [data.vendorBackgroundCheck.reportDate]
    });
    
    this.pastdate = data.vendorBackgroundCheck.reportDate;
  }

  public addbgDialog(): void {
    let dialogRef = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.addBackgroundCheck();
      }
    });
  }

  private addBackgroundCheck(): void {
    this.isdisable = true;
    let bgCheckForm = this.backgroundCheckFrom.value;
    const bgchkID = this.backgroundcheckid ? this.backgroundcheckid : '';
    if (this.vendorId == undefined) {
      this.vendorId = this.viewBgItem.vendorId
    }
    let backgroundCheckObj = {
      vendorId: this.vendorId,
      backgroundCheckId: bgchkID,
      backgroundCheckInfo: {
        referenceID: bgCheckForm.referenceID,
        resultType: bgCheckForm.result,
        reportDate: bgCheckForm.reportDate,
        bgCompanyName: bgCheckForm.bgcompanyName,
        typeOfbgCheck: bgCheckForm.typeofbg,
        expirationDate: bgCheckForm.expirationDate,
        isDeleted:false,
      }
    };
    console.log(backgroundCheckObj);
    if (this.backgroundcheckid == undefined) {
      this.vendorSandbox.addBackgroundCheck(backgroundCheckObj);
      this.vendorSandbox.addBackgroundCheck$.subscribe((backgroundCheckObj) => {
        this.isdisable = true;
        this.broadService.broadcast('addBackgroundCheckItems', backgroundCheckObj);
        //this.backgroundCheckFrom.reset();
        this.closeToggle.emit(true);
        this.snackBar.open('Vendor Background Check Added Successfully', 'Close', {
          duration: 3000,
        });
      },
        error => {
          this.isdisable = false;
          //this.isSaveDisable = false;
        },
        () => {
          this.myForm.resetForm();
          this.ngOnInit();
        });
    } else {
      this.vendorSandbox.editBackgroundCheck(backgroundCheckObj);
      this.vendorSandbox.editBackgroundCheck$.subscribe((backgroundCheckObj) => {
        this.isdisable = true;
        this.broadService.broadcast('addBackgroundCheckItems', backgroundCheckObj);
        this.closeToggle.emit(true);
        this.snackBar.open('Vendor Background Check updated Successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['vendor', 'listinsuranceslicenses', this.viewBgItem.vendorId]);
        this.ngOnInit();
        //this.toastr.success('Updated License Successfully', ' Success');
      },
        error => {
          this.isdisable = false;
         // this.isSaveDisable = false;
        },
        () => {
          this.myForm.resetForm();
          this.ngOnInit();
        });
    }
  }

 
  GetFormattedDate(date) {
    
    
    
    let newDate = new Date(date);
    
    let dd = newDate.getDate();
    let mm = newDate.getMonth() + 1; //January is 0!
    let yyyy = newDate.getFullYear();
    this.formattedTodayDate = mm + '/' + dd + '/' + yyyy;
    
    return this.formattedTodayDate;
  }
 
 
  ShowDialog(message) {
    let dref = this.dialogService.showDialog(message, 'Yes', '500');
    dref.afterClosed().subscribe(result => {
      if (result) { } else {
      }
    });
  }
  ValidateExpiryDate(controlValue, controlName, isFirst) {
    //if (controlValue.length>0 &&  !this.isValidDate(this.GetFormattedDate(controlValue)))
    if (controlValue.length > 0 && !this.isValidDate(this.GetFormattedDate(controlValue)))
    {
      this.expiryDateErrorMessage = "Please enter a valid Expiry Date.";
      this.backgroundCheckFrom.get(controlName).setErrors(new Error(this.expiryDateErrorMessage));
    }
    else {
      // If Date is Valid
      if (this.backgroundCheckFrom.get('reportDate').value && this.backgroundCheckFrom.get('expirationDate').value && !this.ComparesDates(this.backgroundCheckFrom.get('reportDate').value, controlValue)) {
        this.expiryDateErrorMessage = "Expiry Date cannot be previous than Report Date.";
        this.backgroundCheckFrom.get(controlName).setErrors(new Error(this.expiryDateErrorMessage));
      }
      else {

      }
      if (this.IsValidPastDate(controlValue) && !this.backgroundCheckFrom.controls['expirationDate'].errors)
      {
        this.ShowDialog('Please note, the Expiry date provided is in the past.  Would you like to proceed?');
      }
    }

    //Report Date Logic
    if (this.backgroundCheckFrom.get('reportDate').value && this.IsValidFuturedate(this.backgroundCheckFrom.get('reportDate').value)) {
      //If Report Date is a future date, show an error
      this.reportDatErrorMessage = "Report date cannot be in the future.";
      this.backgroundCheckFrom.get('reportDate').setErrors(new Error(this.reportDatErrorMessage));
    }
    
    
  }
  ValidateReportDate(controlValue, controlName,isFirst) {
    
    if (!this.isValidDate(this.GetFormattedDate(controlValue)))
    {
      this.reportDatErrorMessage = "Please enter a valid Report Date.";
      this.backgroundCheckFrom.get(controlName).setErrors(new Error(this.reportDatErrorMessage));
      
    }
    else
    {
      this.pastdate = new Date(controlValue);
      if (this.IsValidFuturedate(controlValue)) {
        //If Report Date is a future date, show an error
        this.reportDatErrorMessage = "Report date cannot be in the future.";
        this.backgroundCheckFrom.get(controlName).setErrors(new Error(this.reportDatErrorMessage));
      }
      else {
        //do nothing if the Report Date is either today or Past
      }
    }
    //Validate Expiry Data Logic
    if (this.backgroundCheckFrom.get('expirationDate').value && !this.ComparesDates(this.backgroundCheckFrom.get('reportDate').value, this.backgroundCheckFrom.get('expirationDate').value)) {
      this.expiryDateErrorMessage = "Expiry Date cannot be previous than Report Date.";
      this.backgroundCheckFrom.get('expirationDate').setErrors(new Error(this.expiryDateErrorMessage));
    }
    if (this.IsValidPastDate(this.backgroundCheckFrom.get('expirationDate').value) && !this.backgroundCheckFrom.controls['expirationDate'].errors)
      {
        this.ShowDialog('Please note, the Expiry date provided is in the past.  Would you like to proceed?');
      }

  }

  IsValidFuturedate(date){
    let todayDate = new Date();
    return moment(date).isAfter(moment(todayDate.getMonth() + 1 + '/' + todayDate.getDate() + '/' + todayDate.getFullYear(), 'MM/DD/YYYY'));
  
  }
  
  IsValidPastDate(date) {

    let todayDate = new Date();
    //let dd = todayDate.getDate();
    //let mm = todayDate.getMonth() + 1; //January is 0!
    //let yyyy = todayDate.getFullYear();
    
    if (moment(date).isBefore(moment(todayDate.getMonth() + 1 + '/' + todayDate.getDate() + '/' + todayDate.getFullYear(), 'MM/DD/YYYY'))) {
      return true;
    }
    else {
      return false;
    }

  }
  
  isValidDate(controlValue) {
   // var date = moment(controlValue, 'MM/DD/YYYY')
   // alert(controlValue instanceof Date);
    //alert(moment(controlValue, 'YYYY-MM-DD', true).isValid()) // true
    //alert(moment(controlValue, 'YYYY-MM-DD', true).isValid()) // true
    //alert(moment(controlValue, ['MM/DD/YYYY', 'M/DD/YYYY', 'M/D/YYYY', 'MM/D/YYYY'], true).isValid());
    if (controlValue.length>0 && moment(controlValue, 'MM/DD/YYYY').isValid()) {
    //if (controlValue.length > 0 && moment(controlValue, ['MM/DD/YYYY', 'M/DD/YYYY', 'M/D/YYYY', 'MM/D/YYYY']).isValid()) {
      return true;
    }
    else
    {
      return false;
    }
  } 


  ComparesDates(startDate, endDate) {
    return moment(endDate).isSameOrAfter(startDate);
  }

  omit_special_char(event) {
    const pattern = /[0-9\-\/]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  reset() {
    if (this.backgroundcheckid != undefined) {
      let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
      dref.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {
          this.closeToggle.emit(true);
        } else {
        }
      });

    } else {
      let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
      dref.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {
          this.closeToggle.emit(true);
          this.ngOnInit();
        } else { }
      });
    }
  }
}



