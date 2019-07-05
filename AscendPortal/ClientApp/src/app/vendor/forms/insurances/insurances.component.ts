import { Component, OnInit, NgZone, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  IVendorAddress, IVendorInsurance, IVendorInsuranceModel, IVendorName
} from '../../../shared/models/insurances-model';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
//import { DialogsService, } from '../../../shared/services/dialogs.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/format-currency.pipe';
import { CurrencyFormatterDirective } from '../../../shared/directives/currency-formatter.directive';

import { FileUploaderService, FileQueueObject } from '../../../shared/services/file-uploader.service';
import { ConfigService } from '../../../config.service';
import * as moment from 'moment';
import { ConfirmDialogComponent } from '../../../shared/components';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogsService, SessionService } from '../../../shared/services/index';
import { BroadcastService } from '../../services/broadcast.service';
import { DataService } from '../../../shared/services/data.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.scss'],
  providers: [CurrencyFormatPipe]
})
export class InsurancesComponent implements OnInit {
  ltitle: string;
  addinsurance: FormGroup;
  vendorid: string = '';
  contactdata: any;
  zipcodePattern = '^00[5-9][0-9]{2}$|\^0[1-9][0-9]{3}$|\^[1-9][0-9]{4}$';
  insurancepocilypattern = '^([A-Za-z0-9-,!~@#$%^&*():<>-_+=/]{0,100})+$';
  amountpattern = '^([0-9$./]{0,100})+$';
  suffixs = ['Jr', 'Sr', 'III', 'IV', 'V'];
  results = ['Pass', 'Fail', 'Pending'];
  insurancetype = ['E&O', 'Auto', 'Workers Comp', 'General Liability', 'Combined E&O/GenLiability'];
  methods = ['Hard Copy', 'Soft Copy', 'Phone call', '3rd Party Verified'];
  states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC",
    "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA",
    "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", 'NE', 'NH',
    'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
    'TX', 'UT', 'VT', 'VA', 'WA', 'WI', 'WV', 'WY', 'AS', 'FM', 'GU', 'MH', 'MP',
    'PI', 'PW'];
  vendorname: string = '';
  dispalyinsurance: boolean = false;
  mindate: Date = new Date();
  isdisable: boolean = false;
  isrequired: boolean = false;
  testFileObj: any;
  fdata: any = [];
  fileInformation: any = [];
  selectedDate:any
  subscription: Subscription;
  @Input() insuranceId: string;
  @Output() closeToggle = new EventEmitter();
  @ViewChild('insuranceForm') insuranceForm;

  constructor(private vendorSandbox: VendorSandbox, private globalErrorHandler: GlobalErrorHandler,
    public router: Router,
    public $fb: FormBuilder,
    public appComp: AppComponent,
    public route: ActivatedRoute,
    private dialogService: DialogsService,
    private configService: ConfigService,
    public fileUploadService: FileUploaderService,
    public dialog: MatDialog,
    public zone: NgZone, private ds: DataService,
    public snackBar: MatSnackBar,
    public broadService: BroadcastService) {
    if (this.route.snapshot && this.route.snapshot.children && this.route.snapshot.children.length !== 0) {
      let selectedInsuranceId = this.route.snapshot.children[0].params['id'];
      if (selectedInsuranceId && selectedInsuranceId.toString().indexOf('INS') === -1) {
        this.vendorid = selectedInsuranceId;
        this.ltitle = 'Add';
      } else {
        this.insuranceId = selectedInsuranceId;
        this.ltitle = 'Edit';
      }
    }
  }

  ngOnInit() {
    console.log('Configuration ready: ' + this.configService.isReady);
    /* broadcast servive to hide license*/
    this.broadService.on<any>('isserviceschanged').subscribe((item) => {
      this.zone.run(() => {
        // Angular2 Issue
      });
    });
    if (this.insuranceId != undefined) {
        this.editinsurancedata();
      } else {
        this.loadvendordata();
      }
  }

  private loadvendordata(): void {
    this.broadService.broadcast('isserviceschanged', true);
    this.vendorSandbox.getVendorIdList(this.vendorid);
    this.vendorSandbox.getvendorIdList$.subscribe(data => {
      this.contactdata = data;
      if (this.contactdata != undefined) {
        if (this.contactdata.vendorName.preferredName !== '' && this.contactdata.vendorName.preferredName != null && this.contactdata.vendorName.preferredName !== undefined) {
          this.vendorname = this.contactdata.vendorName.preferredName + ' ' + this.contactdata.vendorName.lastName;
        } else {
          this.vendorname = this.contactdata.vendorName.firstName + ' ' + this.contactdata.vendorName.lastName;
        }
      }
      this.onloadpagecreate();
    }, error => this.globalErrorHandler.handleError(error));

  }
  onloadpagecreate() {
    this.dispalyinsurance = true;
    //   this.textFieldPattern = '^([A-Za-z-,.\'` -]{0,200})+$';
    let data = this.contactdata;   
    this.addinsurance = this.$fb.group({
      firstName: [this.contactdata.vendorName.firstName],
      middleInitial: [this.contactdata.vendorName.middleName],
      lastName: [this.contactdata.vendorName.lastName],
      suffix: this.contactdata.vendorName.suffix,
      companyName: [this.contactdata.vendorCompany.companyName],
      insuranceType: '',
      insuranceCarrier: [],
      policyNumber: [],
      effectiveDate:null,
      expirationDate: null,
      lastDateVerified: '',
      lastVerifiedResult: '',
      verificationMethod: '',
      coveragePerClaim: [, [Validators.pattern(this.amountpattern)]],
      coveragePerYear: [, [Validators.pattern(this.amountpattern)]]
    });
  }

  editloadpagecreate(data) {
    this.dispalyinsurance = true;
    //  this.textFieldPattern = '^([A-Za-z-,.\'` -]{0,200})+$';
    this.addinsurance = this.$fb.group({
      firstName: [data.vendorInsurance.firstName],
      middleInitial: [data.vendorInsurance.middleInitial],
      lastName: [data.vendorInsurance.lastName],
      suffix: data.vendorInsurance.suffix,
      insuranceCarrier: [data.vendorInsurance.insuranceCarrier, [Validators.required]],
      insuranceType: [data.vendorInsurance.insuranceType, [Validators.required]],
      policyNumber: [data.vendorInsurance.policyNumber],
      effectiveDate: data.vendorInsurance.effectiveDate === null ? '' : new Date(data.vendorInsurance.effectiveDate),
      expirationDate: new Date(data.vendorInsurance.expirationDate),
      lastDateVerified: data.vendorInsurance.lastDateVerified === null ? '' : new Date(data.vendorInsurance.lastDateVerified),
      lastVerifiedResult: [data.vendorInsurance.lastVerifiedResult],
      verificationMethod: [data.vendorInsurance.verificationMethod],
      coveragePerClaim: [data.vendorInsurance.coveragePerClaim, [Validators.pattern(this.amountpattern)]],
      coveragePerYear: [data.vendorInsurance.coveragePerYear, [Validators.pattern(this.amountpattern)]]
    });
   
  }


  veditinsurance: any;
  editinsurancedata() {
    this.vendorSandbox.getVendorIdList(this.insuranceId);
    this.vendorSandbox.getInsuranceDatabyID(this.insuranceId).subscribe(data => {
        this.veditinsurance = data;
        this.fileInformation = this.veditinsurance.insuranceFileInfo;
        if (this.veditinsurance != undefined) {
          this.vendorname = this.veditinsurance.vendorInsurance.vendorName;
          this.vendorid = this.veditinsurance.vendorId;
          this.vendorSandbox.getVendorIdList(this.vendorid);
          this.vendorSandbox.getvendorIdList$.subscribe(data => {
            let vdata = data;
            this.contactdata = vdata;
          },
            error => {
              //this.$broadcast.exception('Please fill all the required details with right format.');
            },
            () => {
              //this.submitted = false;
            });

          this.editloadpagecreate(this.veditinsurance);
        }
      },
      error => {
      },
      () => {
      });
  }

  onBlurMethod(value, e) {
    if (e == 'lastDateVerified') {
      if (value != '' && value != null) {
        if (!moment(value, 'MM/DD/YYYY').isValid()) {
       
          this.addinsurance.get('lastDateVerified').setErrors({ 'valid': false });
        } else {
 
          let cdate = moment().format('MM/DD/YYYY');
          let selecteddate = moment(this.addinsurance.get('lastDateVerified').value).format('MM/DD/YYYY');
          let ss = this.compare(moment().format('MM/DD/YYYY'), this.addinsurance.get('lastDateVerified').value);
          if (ss == -1 || ss == 0) {
            if (value != null && this.isAlphaNumeric(value) == false) {
              this.addinsurance.get('lastDateVerified').setErrors(null);
            } else {
              this.addinsurance.get('lastDateVerified').setErrors({ 'valid': false });
            }
          } else {
            this.addinsurance.get('lastDateVerified').setErrors({ 'valid': false });
          }
        }
      } else {

      }
    } else if (e == 'expirationDate') {
      let sss = moment(value).isValid();
      if (sss == false) {
        this.addinsurance.get('expirationDate').setErrors({ 'valid': false });
      } else {
        let test = this.isAlphaNumeric(value);
        this.addinsurance.get('expirationDate').setErrors(null);
      }
    } else if (e == 'effectiveDate') {
      if (value != null && value != '') {
        let sss = moment(value).isValid();

        if (sss == false) {
          this.addinsurance.get('effectiveDate').setErrors({ 'valid': false });
        } else {
          let test = this.isAlphaNumeric(value);
          this.addinsurance.get('effectiveDate').setErrors(null);
        }
      }
    } else {
      this.addinsurance.get(e).setValue(value);
    }
  }

  compare(cdate, sdate) {

    let CmomentA = moment(cdate, 'MM/DD/YYYY');
    let SmomentB = moment(sdate, 'MM/DD/YYYY');
    if (new Date(SmomentB.toDate()) > new Date(CmomentA.toDate())) return 1;
    else if (new Date(SmomentB.toDate()) < new Date(CmomentA.toDate())) return -1;
    else if (new Date(SmomentB.toDate()) === new Date(CmomentA.toDate())) return 0;
  }
  isAlphaNumeric(str) {
    let first_char = str.search(/[a-zA-Z]/);
    let reg = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
    let sss = reg.test(str);
    if (sss == false) {
      return sss;
    } else {
      return false;
    }
    //return sss;
  }

  clearverificationresultandmethod() {
    this.addinsurance.get('lastVerifiedResult').setErrors(null);
    this.addinsurance.get('verificationMethod').setErrors(null);
    this.addinsurance.get('lastVerifiedResult').setValue('');
    this.addinsurance.get('verificationMethod').setValue('');
  }
  onDateChange(value: Date): void {
    if (value != null && value != undefined) {
      if (this.addinsurance.get('lastVerifiedResult').value == '') {
        this.addinsurance.get('lastVerifiedResult').setErrors({ 'valid': false });
        this.addinsurance.get('lastVerifiedResult').markAsTouched();
      }
      if (this.addinsurance.get('verificationMethod').value == '') {
        this.addinsurance.get('verificationMethod').setErrors({ 'valid': false });
        this.addinsurance.get('verificationMethod').markAsTouched();
      }
    } else {
      this.addinsurance.get('lastVerifiedResult').setErrors(null);
      this.addinsurance.get('verificationMethod').setErrors(null);
      this.addinsurance.get('lastVerifiedResult').setValue('');
      this.addinsurance.get('verificationMethod').setValue('');
      this.addinsurance.get('verificationMethod').markAsTouched();
      this.addinsurance.get('lastVerifiedResult').markAsTouched();
    }
  } 
  dropchange(value, e) {
  
    let result = this.addinsurance.get('lastVerifiedResult').value;
    let method = this.addinsurance.get('verificationMethod').value;
    let date = this.addinsurance.get('lastDateVerified').value;
    //Date change
    if (e == 'lastDateVerified') {
      //Valid Date
      if (moment(date).isValid()) {
        //Result Is Mandatory
        if (result == '' || result == undefined) {
          this.addinsurance.get('lastVerifiedResult').setErrors({ 'valid': false });
          this.addinsurance.get('lastVerifiedResult').markAsTouched();
        }
        //Method Is Mandatory
        if (method == '' || method == undefined) {
          this.addinsurance.get('verificationMethod').setErrors({ 'valid': false });
          this.addinsurance.get('verificationMethod').markAsTouched();
        }
      }

      //Invalid Date
      else {
        //Either dropdown has value,Date is mandatory
        if ((result != '' && result != undefined) || (method != '' && method != undefined) || (!moment(date).isValid())) {
          this.addinsurance.get('lastDateVerified').setErrors({ 'valid': false });
          this.addinsurance.get('lastDateVerified').markAsTouched();
        }
        
      }
    }


    if (e == 'verificationMethod') {
      //Valid method selected
      if (method != '' && method != undefined) {
        //Invalid date,date is mandatory
        if (!moment(date).isValid()) {
          this.addinsurance.get('lastDateVerified').setErrors({ 'valid': false });
          this.addinsurance.get('lastDateVerified').markAsTouched();
        }
        //Result Is Mandatory
        if (result == '' || result == undefined) {
          this.addinsurance.get('lastVerifiedResult').setErrors({ 'valid': false });
          this.addinsurance.get('lastVerifiedResult').markAsTouched();
        }
      }
      else {
        //Either date or result has value, method is mandatory
        if ((result != '' && result != undefined) || (moment(date).isValid()))
          {
          //Method Is Mandatory
          if (method == '' || method == undefined) {
            this.addinsurance.get('verificationMethod').setErrors({ 'valid': false });
            this.addinsurance.get('verificationMethod').markAsTouched();
          }
        }
      }
    }

    //Result change
    if (e == 'lastVerifiedResult') {

      //Valid result selected
      if (result != '' && result != undefined) {

        //Invalid date,date is mandatory
        if (!moment(date).isValid()) {
          this.addinsurance.get('lastDateVerified').setErrors({ 'valid': false });
          this.addinsurance.get('lastDateVerified').markAsTouched();
        }

        //Method Is Mandatory
        if (method == '' || method == undefined) {
          this.addinsurance.get('verificationMethod').setErrors({ 'valid': false });
          this.addinsurance.get('verificationMethod').markAsTouched();
        }

      }

      else {
        //Either Date or method has value,result is mandatory
        if ((method != '' && method != undefined) || (moment(date).isValid())) {
          //Result Is Mandatory
          if (result == '' || result == undefined) {
            this.addinsurance.get('lastVerifiedResult').setErrors({ 'valid': false });
            this.addinsurance.get('lastVerifiedResult').markAsTouched();
          }
        }
      }

    }
     if ((result == '' || result == undefined) && (method == '' || method == undefined) && (date==null || date==''))
      {
      this.addinsurance.get('lastVerifiedResult').setErrors(null);
      this.addinsurance.get('verificationMethod').setErrors(null);
      this.addinsurance.get('lastDateVerified').setErrors(null);
    }
  }

  oncurrency(value, e) {
    let sss = value.split('.');
    if (sss.length > 1) {
      let a = sss[1];
      if (a.length > 2) {
        return false;
      }
    }
  }
  public restrictNumeric(value, e) {
    let sss = value.split('.');
    if (sss.length > 1) {
      let a = sss[1];
      if (a.length > 1) {
        return false;
      }
    }
  }

  dollar(value, e) {
    let dollarreplace = value.replace('$ ', '').replace('$', '');
    if (!dollarreplace.match(/[0-9]/)) {
      dollarreplace = dollarreplace.replace(/[^0-9]/g, '');
    }

    let sss = value.split('.');
    if (sss.length > 1) {
      let a = sss[1];
      if (a.length > 1) {
        this.addinsurance.get(e).setValue('$' + dollarreplace);
        return false;
      }

    } else {
      if (dollarreplace != '') {
        dollarreplace = dollarreplace + '.00';
        this.addinsurance.get(e).setValue('$' + dollarreplace);
      }
    }
  }

  saveinsurance() {
    console.log(this.addinsurance.value.expirationDate);
    if (this.insuranceId != undefined) {
      let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
      dref.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {
          this.SaveOnBeforeFileUpload();
        } else {
        }
      });
    } else {
      let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
      dref.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {
          this.SaveOnBeforeFileUpload();
        } else {

        }
      });
    }
  }
  receiveMessage($event) {
    this.testFileObj = $event;
  }
  onCompleteItem($event) {
    
    if ($event.item.uploadFailed === true) {
      //this.toastr.error("Upload Failed.Please try again", "Upload Failed");
    } else {
      this.fdata.push($event.response);
      if (this.fileInformation.length > 0) {
        this.fileInformation.forEach(file => {
          this.fdata.push(file);
        })
      }

      if (this.fdata.length > 0) {
        this.Addsaveinsurance();
      }
    }
  }

  SaveOnBeforeFileUpload() {
    this.fileUploadService.uploadAll();
    if (this.testFileObj === undefined || this.testFileObj === null) {
      this.Addsaveinsurance()
    }

  }

  Addsaveinsurance() {
   
    this.isdisable = true;
    let address = <IVendorAddress>{
      streetAddress: this.addinsurance.value.streetAddress,
      city: this.addinsurance.value.city,
      state: this.addinsurance.value.state,
      zipcode: this.addinsurance.value.zipcode,
    };
    let insurance = <IVendorInsurance>{
      insuranceType: this.addinsurance.value.insuranceType,
      insuranceCarrier: this.addinsurance.value.insuranceCarrier,
      policyNumber: this.addinsurance.value.policyNumber.toString().trim(),
      effectiveDate: this.addinsurance.value.effectiveDate,
      expirationDate: this.addinsurance.value.expirationDate,
      lastVerifiedResult: this.addinsurance.value.lastVerifiedResult,
      lastDateVerified: this.addinsurance.value.lastDateVerified,
      verificationMethod: this.addinsurance.value.verificationMethod,
      coveragePerClaim: this.addinsurance.value.coveragePerClaim,
      coveragePerYear: this.addinsurance.value.coveragePerYear,
    };
    let insuranceInfo = <IVendorInsuranceModel>{
      vendorName: this.vendorname,
      company: this.addinsurance.value.companyName,
      firstName: this.addinsurance.value.firstName,
      lastName: this.addinsurance.value.lastName,
      middleInitial: this.addinsurance.value.middleInitial,
      suffix: this.addinsurance.value.suffix,
      //address: address,
      insurance: insurance
    };
    
    this.addinsurance.value.vendorName = this.vendorname;
    if (this.insuranceId == undefined) {
      this.insuranceId = null;
    }
    let data = { 'id': this.insuranceId, 'vendorid': this.vendorid, 'insuranceInfo': insuranceInfo, 'insuranceFileInfo': this.fdata && this.fdata.length > 0 ? this.fdata : this.fileInformation };
    if (this.insuranceId == undefined) {
      this.vendorSandbox.addinsurancesList(data);
      this.vendorSandbox.addInsurances$.subscribe((data) => {
        debugger;
        this.isdisable = true;
        let id = this.vendorid;
        this.insuranceForm.resetForm();
        this.onloadpagecreate();
        this.loadvendordata();
        this.closeToggle.emit(true);
        this.snackBar.open('Vendor Insurance Added Successfully', 'Close', {
          duration: 3000,
        });
      }
        , error => {
          let errResponse = {};
          errResponse = JSON.parse(JSON.stringify(error));         
          if (errResponse = "The policy number already exists") {
            let dref = this.dialogService.showDialog('The policy number already exists', 'Ok', '500');
            dref.afterClosed().subscribe(result => {
              this.isdisable = false;
            })
          }
        },

        () => {
          this.insuranceForm.resetForm();
          this.ngOnInit();
        }
      );
    } else {
      this.vendorSandbox.editInsuranceDetails(data);
      this.vendorSandbox.editInsurances$.subscribe((data) => {
        let id = this.vendorid;
        this.isdisable = true;
        this.closeToggle.emit(true);
        this.editinsurancedata();
        this.snackBar.open('Vendor Insurance Updated Successfully', 'Close', {
          duration: 3000,
        });
      },
        error =>  {
          let errResponse = {};
          errResponse = JSON.parse(JSON.stringify(error));
          if (errResponse === "The policy number already exists") {
            let dref = this.dialogService.showDialog('The policy number already exists', 'Ok', '500');
            dref.afterClosed().subscribe(result => {
              this.isdisable = false;
            })
          }
        },
        () => {
          this.router.navigate(['vendor', 'listinsuranceslicenses', this.vendorid]);
          this.insuranceForm.resetForm();
          this.ngOnInit();
        });
    }
  }

  reset() {
    if (this.insuranceId != undefined) {
      let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
      dref.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {
          this.closeToggle.emit(true);
          if (this.insuranceId == undefined) {
            this.insuranceForm.resetForm();
          }
        } else {
        }
      });

    } else {
      let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
      dref.afterClosed().subscribe(result => {
        if (result) {
          this.insuranceForm.resetForm();
          this.onloadpagecreate();
          this.loadvendordata();
          this.closeToggle.emit(true);
        } else { }
      });
    }
  }

  protected setDate($event): void {
    this.addinsurance.controls['effectiveDate'].setValue($event.value);
    this.addinsurance.controls['effectiveDate'].markAsDirty();
  }

}

