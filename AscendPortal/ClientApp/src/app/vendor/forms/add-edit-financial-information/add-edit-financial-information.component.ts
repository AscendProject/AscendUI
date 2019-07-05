import { Component, OnInit, NgZone, Output, EventEmitter, Input } from '@angular/core';
import {
  IFinancialInformationModel, IACH, IContact, IFinancialInformationModelResponse,
  IMailingAddress, IPayment, IVendorAttributes, IW9, IW9FileInfo
} from '../../../shared/models/financial-information-model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatIcon, MatGridListModule,
  MatSidenavModule,
  MatSnackBar
} from '@angular/material';
import { AddVendorApiService } from '../../services/add-vendor-api.service';
import { FinancialInformationService } from '../../services/financial-information.service';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
import { DialogsService } from '../../../shared/services/dialogs.service';
import { BroadcastService } from '../../services/broadcast.service';
import { FileUploaderService } from '../../../shared/services/file-uploader.service';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'app-add-edit-financial-information',
  templateUrl: './add-edit-financial-information.component.html',
  styleUrls: ['./add-edit-financial-information.component.scss']
})
export class AddEditFinancialInformationComponent implements OnInit {
  IsPaymentMethodSelected: boolean;
  fileExist: boolean;
  docKey: any;
  w9FileName: string;
  fileInformation = [];
  w9FileData = [];
  w9FileObj: any;
  w9FileInfo: IW9FileInfo;


  // flags for changing display of page

  isEditFinancialInfo = false;
  isAddFinancialInfo = false;
  IsACHSelected = false;
  isDisable = false;
  submitted: boolean;
  IsUpdateDisable = false;



  // Drop down lists for the page
  paymentTypes = [
    { value: 'Check', viewValue: 'Check' },
    { value: 'ACH', viewValue: 'ACH' }
  ];
  accountTypes = [
    { value: 'Checking', viewValue: 'Checking' },
    { value: 'Savings', viewValue: 'Savings' }
  ];

  taxIDTypes = [
    { value: 'SSN', viewValue: 'SSN' },
    { value: 'EIN', viewValue: 'EIN' }
  ];

  // Form Group
  public addfinancialinfo: FormGroup;




  // Other variables
  financialData: any;
  showVendorError = false;
  vendorname: string;
  contactdata: any;
  modifiedNumber: string;
  taxIdNumberTemp: string;
  trimmedNum: string;
  taxIDLength: string;
  maskedAccountNumber: string;
  maskedRoutingNumber: string;
  maskedTaxId: string;
  AddressData: any;
  ContactdataFinancial: any;
  financialPageTitle: string;
  primaryPhoneFinancial: any;
  secondaryPhoneFinancial: any;
  emailFinancial: any;
  PaymentData: IPayment;
  AttributesData: IVendorAttributes;
  W9Data: IW9;
  ACHData: IACH;
  isUploadNewForm: boolean;
  isNoFileSelected = true;
  subscription: Subscription;
  @Input() vendorid: string;
  @Output() closeToggle = new EventEmitter();



  constructor(private fb: FormBuilder,
    public $vendorFinancialInfoService: FinancialInformationService,
    private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    public router: Router,
    public appComp: AppComponent,
    public route: ActivatedRoute,
    public dialog: DialogsService,
    public vendorservice: AddVendorApiService,
    public broadService: BroadcastService,
    public zone: NgZone,
    public fileUploadService: FileUploaderService,
    public snackBar: MatSnackBar,
    public ds: DataService
  ) { }


  ngOnInit() {


    this.initForm();
    this.loadvendordata(this.vendorid);

    // Set Page Title and Mode
    if (this.financialData === undefined) {
      this.financialPageTitle = 'Add Financial Information';
      this.isAddFinancialInfo = true;
      this.isEditFinancialInfo = false;
    } else {
      this.financialPageTitle = 'Edit Financial Information';
      this.isAddFinancialInfo = false;
      this.isEditFinancialInfo = true;
    }
  }

  // Load basic vendor data and financial data
  loadvendordata(vendorId: string) {
    this.vendorSandbox.getVendorIdList(this.vendorid);
    this.vendorSandbox.getvendorIdList$.subscribe(
      data => {
        this.contactdata = data;
        if (this.contactdata !== undefined) {
          if (this.contactdata.vendorName.preferredName !== ''
            && this.contactdata.vendorName.preferredName != null
            && this.contactdata.vendorName.preferredName !== undefined) {
            this.vendorname = this.contactdata.vendorName.preferredName + '' + this.contactdata.vendorName.lastName;
          } else {
            this.vendorname = this.contactdata.vendorName.firstName + '' + this.contactdata.vendorName.lastName;
          }
        }
      },
      error => {
        // this.$broadcast.exception('Please fill all the required details with right format.');
      },
      () => {
        // this.submitted = false;
      });
    this.loadFinancialData();
  }

  // Load Financial Data-View Mode
  loadFinancialData() {

    this.vendorSandbox.getFinancialInformation(this.vendorid).subscribe(
      data => {
        if (data !== undefined) {
          this.financialData = data;
          this.maskedAccountNumber =
            this.financialData.accountNumber.substr(0, 13).replace(/[0-9]/g, 'x') + this.financialData.accountNumber.substr(13, 4);
          this.maskedRoutingNumber =
            this.financialData.routingNumber.substr(0, 5).replace(/[0-9]/g, 'x') + this.financialData.routingNumber.substr(5, 4);

          if (this.financialData.taxIdType === 'SSN') {
            this.maskedTaxId = this.financialData.taxId.substr(0, 3).replace(/[0-9]/g, 'x')
              + '-' + this.financialData.taxId.substr(3, 2).replace(/[0-9]/g, 'x') + '-' + this.financialData.taxId.substr(5, 4);
          }
          if (this.financialData.taxIdType === 'EIN') {
            this.maskedTaxId = this.financialData.taxId.substr(0, 2).replace(/[0-9]/g, 'x')
              + '-' + this.financialData.taxId.substr(2, 3).replace(/[0-9]/g, 'x') + this.financialData.taxId.substr(5, 4);
          }
          this.financialPageTitle = 'Edit Financial Information';
          this.isEditFinancialInfo = true;
          this.isAddFinancialInfo = false;
          if (this.financialData.paymentMethod = 'ACH') {
            this.IsACHSelected = true;
            this.IsPaymentMethodSelected = true;
            this.IsUpdateDisable = false;
          } else {
            this.IsACHSelected = false;
            this.IsUpdateDisable = true;
          }
          this.addfinancialinfo = this.fb.group({
            methodOfPayment: [this.financialData.paymentMethod],
            bankName: [this.financialData.bankName],
            nameOnAccount: [this.financialData.accountHolderName],
            accountNumber: [this.financialData.accountNumber],
            confirmAccountNumber: [this.financialData.accountNumber],
            accountType: [this.financialData.accountType],
            routingNumber: [this.financialData.routingNumber],
            taxIDType: [this.financialData.taxIdType],
            taxID: [this.financialData.taxId]
          });

          this.out(this.financialData.taxId);

        } else {
          this.financialPageTitle = 'Add Financial Information';
          this.isAddFinancialInfo = true;
          this.isEditFinancialInfo = false;
          this.initForm();
        }

      });

    this.loadW9Data();
  }

  loadW9Data() {

    this.vendorSandbox.getW9FileInformation(this.vendorid).subscribe(
      data => {
        if (data !== undefined) {
          this.w9FileData = data.DocumentData;
          if (this.w9FileData.length > 0) {
            this.w9FileName = this.w9FileData[this.w9FileData.length - 1].fileName.split('.', 1) + '.pdf';
            this.docKey = this.w9FileData[this.w9FileData.length - 1].documentKey;
            this.fileExist = true;
          } else {
            this.fileExist = false;
            this.isNoFileSelected = true;
          }
        }
      });

  }


  // Set Form
  initForm() {
    this.addfinancialinfo = this.fb.group({
      methodOfPayment: ['', Validators.required],
      bankName: ['', Validators.required],
      nameOnAccount: ['', Validators.required],
      accountNumber: ['', Validators.required],
      confirmAccountNumber: ['', Validators.required],
      accountType: ['', Validators.required],
      routingNumber: ['', Validators.required],
      taxIDType: ['', Validators.required],
      taxID: ['', Validators.required]
    });
  }

  // display ACH or Check Fields in Add/Edit Mode
  displayFields(event: any) {
    if (event.value === 'ACH') {
      this.IsACHSelected = true;
      this.IsPaymentMethodSelected = true;
      this.IsUpdateDisable = false;
    } else if (event.value === 'Check') {
      this.IsACHSelected = false;
      this.IsPaymentMethodSelected = true;
      this.IsUpdateDisable = true;
    }
  }



  isNumberKey(evt) {


    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }


  onBlurMethod(value, e) {
    this.addfinancialinfo.get(e).setValue(value.toString().trim());
  }


  changeTaxIDFormat(number: string) {
    if (this.trimmedNum !== '') {
      this.out(this.trimmedNum);
    }
  }

  out(number: string) {


    this.trimmedNum = number.toString().trim();

    if (this.trimmedNum.length === 9 && /^\d+$/.test(this.trimmedNum)) {

      if (this.addfinancialinfo.get('taxIDType').value === 'EIN') {

        this.addfinancialinfo.get('taxID').setValidators(Validators.maxLength(10));
        this.modifiedNumber = this.trimmedNum.substr(0, 2).replace(/[0-9]/g, 'x')
          + '-' + this.trimmedNum.substr(2, 3).replace(/[0-9]/g, 'x') + this.trimmedNum.substr(5, 4);
        this.addfinancialinfo.get('taxID').setValue(this.modifiedNumber);

      } else if (this.addfinancialinfo.get('taxIDType').value === 'SSN') {
        this.addfinancialinfo.get('taxID').setValidators(Validators.maxLength(11));
        this.modifiedNumber = this.trimmedNum.substr(0, 3).replace(/[0-9]/g, 'x')
          + '-' + this.trimmedNum.substr(3, 2).replace(/[0-9]/g, 'x') + '-' + this.trimmedNum.substr(5, 4);
        this.addfinancialinfo.get('taxID').setValue(this.modifiedNumber);
      } else {
        if (this.trimmedNum.length === 9) {
          this.addfinancialinfo.get('taxID').setValidators(Validators.nullValidator);
          this.addfinancialinfo.get('taxID').setErrors({ 'valid': true });
          this.addfinancialinfo.get('taxID').updateValueAndValidity();
        }

      }
    } else if (this.trimmedNum.length < 9 && this.trimmedNum.length !== 0 || this.trimmedNum.length === 0) {
      this.addfinancialinfo.get('taxID').setErrors({ 'valid': false });
    } else if (/^\d+$/.test(this.trimmedNum) === false && this.trimmedNum.length === 9) {
      this.addfinancialinfo.get('taxID').setErrors(null);
      this.addfinancialinfo.get('taxID').setErrors({ 'valid': false });
    } else {
      this.addfinancialinfo.get('taxID').setValidators(Validators.nullValidator);
      this.addfinancialinfo.get('taxID').setErrors({ 'valid': true });
      this.addfinancialinfo.get('taxID').updateValueAndValidity();
    }


  }


  taxIDNumberFoucusIn(number: String) {

    this.taxIDLength = '9';
    const len = this.addfinancialinfo.get('taxID').value.length;
    if (len < 9 && len !== 0) {
      this.addfinancialinfo.get('taxID').setValidators(Validators.maxLength(9));


      this.addfinancialinfo.get('taxID').setValue(this.trimmedNum);
      this.addfinancialinfo.get('taxID').setErrors({ 'valid': false });
    } else {
      this.addfinancialinfo.get('taxID').setValidators(Validators.maxLength(9));
      this.addfinancialinfo.get('taxID').setValue(this.trimmedNum);
    }

  }

  taxIDNumberFormatChange(number: string) {

    if (number.length < 10 && number.length !== 0) {
      this.addfinancialinfo.get('taxID').setErrors(null);
      this.addfinancialinfo.get('taxID').setErrors({ 'valid': false });
    }

    if (number.length === 0) {
      this.addfinancialinfo.get('taxID').setValidators(Validators.nullValidator);
      this.addfinancialinfo.get('taxID').setErrors({ 'valid': true });
      this.addfinancialinfo.get('taxID').updateValueAndValidity();

    }
  }


  checkAccountNumber() {

    if (this.addfinancialinfo.get('accountNumber').value.length !== 17 ||
      this.addfinancialinfo.get('accountNumber').value !== this.addfinancialinfo.get('confirmAccountNumber').value) {


      this.addfinancialinfo.get('confirmAccountNumber').setErrors({ 'valid': false });
    } else if (this.addfinancialinfo.get('accountNumber').value === this.addfinancialinfo.get('confirmAccountNumber').value) {
      this.addfinancialinfo.get('confirmAccountNumber').setValidators(Validators.nullValidator);
      this.addfinancialinfo.get('confirmAccountNumber').updateValueAndValidity();
    }
  }



  // Validation methods for ACH Ends




  // Collect all data of vendor including financial data
  getFinancialDataFromPage() {
    const form = this.addfinancialinfo.value;

    // Setting Address
    if (this.contactdata.vendorAddress.length === 1) {

      this.AddressData = <IMailingAddress>{

        Address1: this.contactdata.vendorAddress[0].streetAddress,
        StateAbbreviation: this.contactdata.vendorAddress[0].state,
        PostalCode: this.contactdata.vendorAddress[0].zipcode,
        City: this.contactdata.vendorAddress[0].city,
      };

    }

    if (this.contactdata.vendorAddress.length === 2) {
      this.AddressData = <IMailingAddress>{

        Address1: this.contactdata.vendorAddress[1].streetAddress,
        StateAbbreviation: this.contactdata.vendorAddress[1].state,
        PostalCode: this.contactdata.vendorAddress[1].zipcode,
        City: this.contactdata.vendorAddress[1].city,
      };
    }

    // Setting Contact Info -Phone and email for financial object
    if (this.contactdata.vendorPhone != null || this.contactdata.vendorEmail != null) {
      if (this.contactdata.vendorEmail == null) {
        if (this.contactdata.vendorPhone.length > 1) {
          this.primaryPhoneFinancial = this.contactdata.vendorPhone[0].phone;
          this.secondaryPhoneFinancial = this.contactdata.vendorPhone[1].phone;
          this.emailFinancial = null;
        }
        if (this.contactdata.vendorPhone.length === 1) {
          this.primaryPhoneFinancial = this.contactdata.vendorPhone[0].phone;
          this.secondaryPhoneFinancial = null;
          this.emailFinancial = null;
        }
      }
      if (this.contactdata.vendorPhone == null) {
        this.primaryPhoneFinancial = null;
        this.secondaryPhoneFinancial = null;
        this.emailFinancial = this.contactdata.vendorEmail[0].email;
      }
    }



    this.ContactdataFinancial = <IContact>{

      Phone1: this.primaryPhoneFinancial,
      Phone2: this.secondaryPhoneFinancial,
      Fax: 'string',
      Email: this.emailFinancial
    };


    this.ACHData = <IACH>
      {
        BankName: form.bankName,
        BankNumber: form.routingNumber,
        BankAccountNumber: form.accountNumber,
      };

    this.PaymentData = <IPayment>{
      PaymentMethod: form.methodOfPayment,
      ACH: this.ACHData,
      PayToVendor: 'VIV1234567',
      PaymentFrequency: 'Monthly',
    };


    this.W9Data = <IW9>{
      LegalName: this.contactdata.vendorName.firstName + this.contactdata.vendorName.lastName,
      TaxID: this.trimmedNum
    };
    this.AttributesData = <IVendorAttributes>{
      PlatformNumber: 'PLA1234567',
      VendorType: 'Appraiser'
    };

  }


  /* file upload */


  uploadW9Form() {

    this.fileUploadService.uploadAll();
  }




  receiveMessage($event) {
    this.isNoFileSelected = false;
    this.w9FileObj = $event;
  }
  onCompleteItem($event) {

    if ($event.item.uploadFailed === true) {
      this.dialog.showDialog('W9 upload failed. Please upload a valid W9 form!', 'Close', '400');
      this.w9FileObj = null;
      this.isNoFileSelected = true;
    } else {

      this.w9FileData.push($event.response);
      if (this.fileInformation.length > 0) {
        this.fileInformation.forEach(file => {
          this.w9FileData.push(file);
        });
      }
      if (this.w9FileData.length > 0) {

        this.w9FileInfo = <IW9FileInfo>{

          VendorId: this.vendorid,
          DocumentData: this.w9FileData
        };



        const dialogRef = this.dialog.showDialog('Are you sure you want to upload?', 'Yes', '400');

        dialogRef.afterClosed().subscribe(result => {
          if (result) {

            this.vendorSandbox.addW9FileInformation(this.w9FileInfo).subscribe(
              data => {
                if (data !== undefined) {
                  this.dialog.showDialog('W9 uploaded successfully!', 'Ok', '400');
                  this.fileExist = true;
                  this.isUploadNewForm = false;
                  this.broadService.broadcast('updateFinancialData', this.w9FileInfo);
                }
              });
          }
        });
      }
    }

  }
   
  // Edit W9 Form click event
  uploadNewW9Form() {
    this.isUploadNewForm = true;
    this.isNoFileSelected = true;
  }


  cancelW9Upload(event) {
    const dialogRef = this.dialog.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.isUploadNewForm) {
          this.isUploadNewForm = false;

        } else {

        }
      }
    });
  }


  // file upload methods ends


  // Add Or Update Button click event
  // Save ACH Info
  saveFinancialInfo() {

    const form = this.addfinancialinfo.value;
    // this.getFinancialDataFromPage();


    const vendorFinancialInfo = <IFinancialInformationModel>{
      // vendorId: this.vendorid,
      // Name: this.vendorname,
      // Address: this.AddressData,
      // Contact: this.ContactdataFinancial,
      // Payment: this.PaymentData,
      // W9: this.W9Data,
      // Attributes: this.AttributesData,
      // RequestId: UUID.UUID(),
      // SourceSystem: "Vendor"


      vendorId: this.vendorid,
      paymentMethod: form.methodOfPayment,
      bankName: form.bankName,
      accountHolderName: form.nameOnAccount,
      routingNumber: form.routingNumber,
      accountNumber: form.accountNumber,
      accountType: form.accountType,
      taxIdType: form.taxIDType,
      taxId: this.trimmedNum,
      // w9FileInfo: this.w9FileData

    };

    if (this.isAddFinancialInfo) {
      const dialogRef = this.dialog.showDialog('Are you sure you want to save?', 'Yes', '400');

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.vendorSandbox.addFinancialInformation(vendorFinancialInfo, this.vendorid, ).subscribe(
            data => {
              this.isDisable = true;
              this.dialog.showDialog('Financial information added successfully!', 'Ok', '400');


              this.closeToggle.emit(true);
              this.broadService.broadcast('updateFinancialData', vendorFinancialInfo);

            },

            error => this.globalErrorHandler.handleError(error));
        }
      });
    } else if (this.isEditFinancialInfo) {
      if (form.methodOfPayment === 'Check') {
        this.dialog.showDialog('Check information cannot be updated. Please select ACH to update your information.', 'Ok', '400');
      } else {
        const dialogRef = this.dialog.showDialog('Are you sure you want to update?', 'Yes', '400');

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.vendorSandbox.updateFinancialInformation(vendorFinancialInfo, this.vendorid).subscribe(
              data => {
                this.isDisable = true;

                this.closeToggle.emit(true);
                this.broadService.broadcast('updateFinancialData', vendorFinancialInfo);
                this.dialog.showDialog('Financial information updated successfully!', 'Ok', '400');




              },

              error => this.globalErrorHandler.handleError(error));
          }
        });

      }
    }
  }



  // Cancel button click
  cancelFinancialInfo(event) {
    event.preventDefault();
    const dialogRef = this.dialog.showDialog('Are you sure you want to cancel?', 'Yes', '400');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.closeToggle.emit(true);

      } else {

      }
    });
  }


  // Update Info
  updateFinancialInfo() {

    const form = this.addfinancialinfo.value;

    // this.getFinancialDataFromPage();


    const vendorFinancialInfo = <IFinancialInformationModel>{
      //  vendorId: this.vendorid,
      //  Name: this.vendorname,
      //  Address: this.AddressData,
      //  Contact: this.ContactdataFinancial,
      //  Payment: this.PaymentData,
      //  W9: this.W9Data,
      //  Attributes: this.AttributesData,
      //  RequestId: UUID.UUID(),
      //  SourceSystem: "Vendor"


      vendorId: this.vendorid,
      paymentMethod: form.methodOfPayment,
      bankName: form.bankName,
      accountHolderName: form.nameOnAccount,
      routingNumber: form.routingNumber,
      accountNumber: form.accountNumber,
      accountType: form.accountType,
      taxIdType: form.taxIDType,
      taxId: this.trimmedNum,
      w9FileInfo: this.w9FileData

    };

    const dialogRef = this.dialog.showDialog('Are you sure you want to update?', 'Yes', '400');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (form.methodOfPayment === 'Check') {
          this.dialog.showDialog
            ('Check information cannot be updated.Please select ACH to update your information.', 'Ok', '400');
        } else {
          this.vendorSandbox.updateFinancialInformation(vendorFinancialInfo, this.vendorid).subscribe(
            data => {
              this.isDisable = true;
              this.router.navigate(['vendor', 'financialinformation', this.vendorid]);
            },
            error => this.globalErrorHandler.handleError(error));

        }

      }

    });


  }


  // Download W9
  downloadFile(docKey, fileName) {
    this.fileUploadService.getFile(docKey, fileName)
      .subscribe(blob => {
        saveAs(blob, fileName.split('.', 1) + '.pdf', { type: 'text/plain;charset=windows-1252' });
      });
  }


}
