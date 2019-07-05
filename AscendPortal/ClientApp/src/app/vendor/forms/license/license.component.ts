import { Component, OnInit, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  IVendorLicense, IVendorLicenseModel
} from '../../../shared/models/license-model';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
import { DialogsService } from '../../../shared/services/dialogs.service';
import { FileUploaderService, FileQueueObject } from '../../../shared/services/file-uploader.service';
import { ConfigService } from '../../../config.service';
import * as moment from 'moment';
import { ConfirmDialogComponent } from '../../../shared/components';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'license',
  templateUrl: './license.component.html',
  inputs: ['licienseid'],
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {

  ltitle: string;
  addlicense: FormGroup;
  vendorid: string = '';
  contactdata: any;
  //textFieldPattern = '^([A-Za-z-,.\'` -]{0,200})+$';
  middleName;
  insurancepocilypattern = '^([A-Za-z0-9-,!~@#$%^&*():<>-_+=/]{0,100})+$';
  amountpattern = '^([0-9$./]{0,100})+$';
  suffixs = ['Jr', 'Sr', 'III', 'IV', 'V'];
  results = ['Pass', 'Fail', 'Pending'];
  licenseTypes = ['Certified General', 'Certified Residential', 'Licensed Residential',
    'Trainee', 'Broker', 'Real Estate Agent', 'Salesperson'];
  methods = ['Hard Copy', 'Soft Copy', 'Phone call', '3rd Party Verified'];
  states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC",
    "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA",
    "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH",
    "NJ", "NM", "NV", "NY", 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
    'TX', 'UT', 'VT', 'VA', 'WA', 'WI', 'WV', 'WY', 'AS', 'FM', 'GU', 'MH', 'MP',
    'PI', 'PW'];
  vendorname: string = '';
  dispalylicense: boolean = false;
  mindate: Date = new Date();
  isdisable: boolean = false;
  formData: FormData = new FormData();
  myFiles: string[] = [];
  private alive: boolean;
  fdata: any = [];
  fileUploadObj: any;
  fileInformation: any = [];
  @ViewChild('filecount') filecount;
  testFileObj: any;
  @Input() licenseId: string;
  @Output() closeToggle = new EventEmitter();
  @ViewChild('licenseForm') licenseForm;


  constructor(private vendorSandbox: VendorSandbox, private globalErrorHandler: GlobalErrorHandler,
    public router: Router,
    public $fb: FormBuilder,
    public appComp: AppComponent,
    public route: ActivatedRoute,
    private dialogService: DialogsService,
    private configService: ConfigService,
    public fileUploadService: FileUploaderService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog, public broadService: BroadcastService,
    public zone: NgZone) {
    if (this.route.snapshot.children.length !== 0) {
      let selectedLicenseId = this.route.snapshot.children[0].params['id'];
      if (selectedLicenseId && selectedLicenseId.toString().indexOf('LIC') === -1) {
        this.vendorid = selectedLicenseId;
        this.ltitle = 'Add';
      } else {
        this.licenseId = selectedLicenseId;
        this.ltitle = 'Edit';
      }
    }

    this.alive = true;
  }
  ngOnInit() {
   /* broadcast servive to hide license*/
    this.broadService.on<any>('isserviceschanged').subscribe((item) => {
      this.zone.run(() => {
        // Angular2 Issue
      });
    });
    
    if (this.licenseId != undefined) {
      this.editliciencedata();
    } else {
      this.loadvendordata();
    }
  }

  loadvendordata() {
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
    this.dispalylicense = true;
    // this.textFieldPattern = '^([A-Za-z-,.\'` -]{0,200})+$';
    var data = this.contactdata;
    this.addlicense = this.$fb.group({
      firstName: [this.contactdata.vendorName.firstName],
      middleInitial: [this.contactdata.vendorName.middleName],
      lastName: [this.contactdata.vendorName.lastName],
      suffix: this.contactdata.vendorName.suffix,
      licenseState: ['', [Validators.required]],
      licenseType: ['', [Validators.required]],
      licenseNumber: [],
      effectiveDate: null,
      expirationDate: null,
      lastDateVerified: null,
      lastVerifiedResult: '',
      verificationMethod: '',
    });
  }

  editliciencedata() {
    this.vendorSandbox.getVendorIdList(this.licenseId);
    this.vendorSandbox.getLicienceDatabyID(this.licenseId).subscribe(
      data => {
        this.contactdata = data; 
        if (this.contactdata != undefined) {
          this.vendorname = this.contactdata.vendorLicense.vendorName;
          this.vendorid = this.contactdata.vendorId;
          this.fileInformation = this.contactdata.licenseFileInfo;
          this.editloadpagecreate(this.contactdata);
        }
      },
      error => {
      },
      () => {
      });
  }

  editloadpagecreate(data) {
    this.dispalylicense = true;
    //this.textFieldPattern = '';
    var data = this.contactdata;  
    this.addlicense = this.$fb.group({
      firstName: [data.vendorLicense.firstName],
      middleInitial: [data.vendorLicense.middleInitial, Validators.pattern(this.middleName)],
      lastName: [data.vendorLicense.lastName],
      suffix: data.vendorLicense.suffix,
      licenseState: [data.vendorLicense.licenseState, [Validators.required]],
      licenseType: [data.vendorLicense.licenseType, [Validators.required]],
      licenseNumber: [data.vendorLicense.licenseNumber],
      effectiveDate: data.vendorLicense.effectiveDate === null ? '' : new Date(data.vendorLicense.effectiveDate),
      expirationDate: new Date(data.vendorLicense.expirationDate),
      lastDateVerified: data.vendorLicense.lastDateVerified === null ? '' : new Date(data.vendorLicense.lastDateVerified),
      lastVerifiedResult: [data.vendorLicense.lastVerifiedResult],
      verificationMethod: [data.vendorLicense.verificationMethod],
    });
    console.log(moment(data.vendorLicense.effectiveDate).format('MM/DD/YYYY'));
  }

  /* Date Picker */
  ldate(d) {
    if (d == null) {
      return null;
    } else {
      return moment(d).format('MM/DD/YYYY');
    }
  }

  onBlurMethod(value, e) {
    if (e == 'lastDateVerified') {
      if (value != '' && value != null) {
        if (!moment(value, 'MM/DD/YYYY').isValid()) {
          console.log('Invalid Date');
          this.addlicense.get('lastDateVerified').setErrors({ 'valid': false });
        } else {
          console.log('Valid Date');
          var cdate = moment().format('MM/DD/YYYY');
          var selecteddate = moment(this.addlicense.get('lastDateVerified').value).format('MM/DD/YYYY');
          var ss = this.compare(moment().format('MM/DD/YYYY'), this.addlicense.get('lastDateVerified').value);
          if (ss == -1 || ss == 0) {
            if (value != null && this.isAlphaNumeric(value) == false) {
              this.addlicense.get('lastDateVerified').setErrors(null);
            } else {
              this.addlicense.get('lastDateVerified').setErrors({ 'valid': false });
            }
          } else {
            this.addlicense.get('lastDateVerified').setErrors({ 'valid': false });
          }
        }
      } else {
        //  this.addlicense.get('lastDateVerified').setErrors({ 'valid': false });
      }
    } else if (e == 'expirationDate') {
      var sss = moment(value).isValid();
      if (sss == false) {
        this.addlicense.get('expirationDate').setErrors({ 'valid': false });
      } else {
        var test = this.isAlphaNumeric(value);
        this.addlicense.get('expirationDate').setErrors(null);
      }

    } else if (e == 'effectiveDate') {
      var sss = moment(value).isValid();
      if (sss == false) {
        this.addlicense.get('effectiveDate').setErrors({ 'valid': false });
      } else {
        var test = this.isAlphaNumeric(value);
        this.addlicense.get('effectiveDate').setErrors(null);
      }
    } else {
      this.addlicense.get(e).setValue(value);
    }
  }
  compare(cdate, sdate) {
    var CmomentA = moment(cdate, 'MM/DD/YYYY');
    var SmomentB = moment(sdate, 'MM/DD/YYYY');
    if (new Date(SmomentB.toDate()) > new Date(CmomentA.toDate())) return 1;
    else if (new Date(SmomentB.toDate()) < new Date(CmomentA.toDate())) return -1;
    else if (new Date(SmomentB.toDate()) === new Date(CmomentA.toDate())) return 0;
  }
  isAlphaNumeric(str) {
    var first_char = str.search(/[a-zA-Z]/);
    var reg = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
    var sss = reg.test(str);
    if (sss == false) {
      return sss;
    } else {
      return false;
    }
    //return sss;
  }
  clearverificationresultandmethod() {
    this.addlicense.get('lastVerifiedResult').setErrors(null);
    this.addlicense.get('verificationMethod').setErrors(null);
    this.addlicense.get('lastVerifiedResult').setValue('');
    this.addlicense.get('verificationMethod').setValue('');
  }

  savelicense() {
    if (this.licenseId != undefined) {
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

  /* file upload */
  receiveMessage($event) {
    console.log($event);
    this.testFileObj = $event;
  }
  onCompleteItem($event) {
    this.fdata.push($event.response);
    if (this.fileInformation.length > 0) {
      this.fileInformation.forEach(file => {
        this.fdata.push(file);
      })
    }

    if (this.fdata.length > 0) {
      this.Addsavelicense();
    }
  }
  SaveOnBeforeFileUpload() {
    this.fileUploadService.uploadAll();
    if (this.testFileObj === undefined || this.testFileObj === null) {
      this.Addsavelicense();
    }
  }

  Addsavelicense() {
    this.isdisable = true;
    let license = <IVendorLicense>{
      licenseType: this.addlicense.value.licenseType,
      licenseNumber: this.addlicense.value.licenseNumber.toString().trim(),
      licenseState: this.addlicense.value.licenseState,
      effectiveDate: this.addlicense.value.effectiveDate,
      expirationDate: this.addlicense.value.expirationDate,
      lastVerifiedResult: this.addlicense.value.lastVerifiedResult,
      lastDateVerified: this.addlicense.value.lastDateVerified,
      verificationMethod: this.addlicense.value.verificationMethod
    };

    this.addlicense.value.vendorName = this.vendorname;
    if (this.licenseId == undefined) {
      this.licenseId = null;
    }

    let insuranceInfo = <IVendorLicenseModel>{
      vendorName: this.vendorname,
      firstName: this.addlicense.value.firstName,
      lastName: this.addlicense.value.lastName,
      middleInitial: this.addlicense.value.middleInitial,
      suffix: this.addlicense.value.suffix,
      license: license,
    };
    var data = { 'id': this.licenseId, 'vendorid': this.vendorid, 'licenseInfo': insuranceInfo, 'licenseFileInfo':  this.fdata && this.fdata.length > 0 ? this.fdata : this.fileInformation };
    if (this.licenseId == undefined) {
      this.vendorSandbox.addLicensesList(data);
      this.vendorSandbox.addLicense$.subscribe((data) => {
        this.isdisable = true;
        let id = this.vendorid;
        this.licenseForm.resetForm();
        this.onloadpagecreate();
        this.loadvendordata();
        this.closeToggle.emit(true);
        this.snackBar.open('Vendor License Added Successfully', 'Close', {
          duration: 3000,
        });
      }
        , error => {
          let errResponse = {};
          errResponse = JSON.parse(JSON.stringify(error));
          if (errResponse = "Vendor license already exists") {
            let dref = this.dialogService.showDialog('The license already exists', 'Ok', '500');
            dref.afterClosed().subscribe(result => {
              this.isdisable = false;
            })
          }
        });
        }
     else {
      this.vendorSandbox.editLicenseDetails(data);
      this.vendorSandbox.editLicense$.subscribe((data) => {
   
        let id = this.vendorid;
        this.isdisable = true;
        this.editliciencedata();
        this.closeToggle.emit(true);
        this.snackBar.open('Vendor License updated Successfully', 'Close', {
          duration: 3000,
        });
      },
        error => {
          let errResponse = {};
          errResponse = JSON.parse(JSON.stringify(error));
          if (errResponse === "Vendor license already exists") {
            let dref = this.dialogService.showDialog('The license already exists', 'Ok', '500');
            dref.afterClosed().subscribe(result => {
              this.isdisable = false;
            })
          }
        },
        () => {
          this.ngOnInit();
          this.router.navigate(['vendor', 'listinsuranceslicenses', this.vendorid]);
        });
    }
  }


  reset() {
    if (this.licenseId != undefined) {
      let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
      dref.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {
          this.editliciencedata();
          this.closeToggle.emit(true);
        } else {
        }
      });

    } else {
      let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
      dref.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {
          this.licenseForm.resetForm();
          this.onloadpagecreate();
          this.loadvendordata();
          this.closeToggle.emit(true);
        } else { }
      });
    }
  }

  protected setDate($event): void {
    this.addlicense.controls['effectiveDate'].setValue($event.value);
    this.addlicense.controls['effectiveDate'].markAsDirty();
  }

  onDateChange(value: Date): void {
    if (value != null && value != undefined) {
      if (this.addlicense.get('lastVerifiedResult').value == '') {
        this.addlicense.get('lastVerifiedResult').setErrors({ 'valid': false });
        this.addlicense.get('lastVerifiedResult').markAsUntouched();
      }
      if (this.addlicense.get('verificationMethod').value == '') {
        this.addlicense.get('verificationMethod').setErrors({ 'valid': false });
        this.addlicense.get('verificationMethod').markAsUntouched();
      }
    } else {
      this.addlicense.get('lastVerifiedResult').setErrors(null);
      this.addlicense.get('verificationMethod').setErrors(null);
      this.addlicense.get('lastVerifiedResult').setValue('');
      this.addlicense.get('verificationMethod').setValue('');
      this.addlicense.get('verificationMethod').markAsUntouched();
      this.addlicense.get('lastVerifiedResult').markAsUntouched();
    }
  }

  dropchange(value, e) {

    var result = this.addlicense.get('lastVerifiedResult').value;
    var method = this.addlicense.get('verificationMethod').value;
    var date = this.addlicense.get('lastDateVerified').value;
    //Date change
    if (e == 'lastDateVerified') {
      //Valid Date
      if (moment(date).isValid()) {
        //Result Is Mandatory
        if (result == '' || result == undefined) {
          this.addlicense.get('lastVerifiedResult').setErrors({ 'valid': false });
          this.addlicense.get('lastVerifiedResult').markAsTouched();
        }
        //Method Is Mandatory
        if (method == '' || method == undefined) {
          this.addlicense.get('verificationMethod').setErrors({ 'valid': false });
          this.addlicense.get('verificationMethod').markAsTouched();
        }
      }

      //Invalid Date
      else {
        //Either dropdown has value,Date is mandatory
        if ((result != '' && result != undefined) || (method != '' && method != undefined) || (!moment(date).isValid())) {
          this.addlicense.get('lastDateVerified').setErrors({ 'valid': false });
          this.addlicense.get('lastDateVerified').markAsTouched();
        }

      }
    }


    if (e == 'verificationMethod') {
      //Valid method selected
      if (method != '' && method != undefined) {
        //Invalid date,date is mandatory
        if (!moment(date).isValid()) {
          this.addlicense.get('lastDateVerified').setErrors({ 'valid': false });
          this.addlicense.get('lastDateVerified').markAsTouched();
        }
        //Result Is Mandatory
        if (result == '' || result == undefined) {
          this.addlicense.get('lastVerifiedResult').setErrors({ 'valid': false });
          this.addlicense.get('lastVerifiedResult').markAsTouched();
        }
      }
      else {
        //Either date or result has value, method is mandatory
        if ((result != '' && result != undefined) || (moment(date).isValid())) {
          //Method Is Mandatory
          if (method == '' || method == undefined) {
            this.addlicense.get('verificationMethod').setErrors({ 'valid': false });
            this.addlicense.get('verificationMethod').markAsTouched();
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
          this.addlicense.get('lastDateVerified').setErrors({ 'valid': false });
          this.addlicense.get('lastDateVerified').markAsTouched();
        }

        //Method Is Mandatory
        if (method == '' || method == undefined) {
          this.addlicense.get('verificationMethod').setErrors({ 'valid': false });
          this.addlicense.get('verificationMethod').markAsTouched();
        }

      }

      else {
        //Either Date or method has value,result is mandatory
        if ((method != '' && method != undefined) || (moment(date).isValid())) {
          //Result Is Mandatory
          if (result == '' || result == undefined) {
            this.addlicense.get('lastVerifiedResult').setErrors({ 'valid': false });
            this.addlicense.get('lastVerifiedResult').markAsTouched();
          }
        }
      }

    }
    if ((result == '' || result == undefined) && (method == '' || method == undefined) && (date == null || date == '')) {
      this.addlicense.get('lastVerifiedResult').setErrors(null);
      this.addlicense.get('verificationMethod').setErrors(null);
      this.addlicense.get('lastDateVerified').setErrors(null);
    }
    
    }

}
