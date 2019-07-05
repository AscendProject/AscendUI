import { Component, OnInit, NgZone } from '@angular/core';
import { IFinancialInformationModel, IACH, IContact, IFinancialInformationModelResponse,
   IMailingAddress, IPayment, IVendorAttributes, IW9 , IW9FileInfo } from '../../../shared/models/financial-information-model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatIcon, MatGridListModule,
   MatSidenavModule,
   MatSnackBar} from '@angular/material';
import { AddVendorApiService } from '../../services/add-vendor-api.service';
import { FinancialInformationService } from '../../services/financial-information.service';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
import { DialogsService } from '../../../shared/services/dialogs.service';
import { SwitchComponent } from '../../../shared/components/switch/switch.component';
import { BroadcastService } from '../../services/broadcast.service';
import { ConfirmDialogComponent } from '../../../shared/components/index';
import { FileUploaderService, FileQueueObject } from '../../../shared/services/file-uploader.service';
import { saveAs } from 'file-saver';
import { DataService } from '../../../shared/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-financial-information',
  templateUrl: './financial-information.component.html',
  styleUrls: ['./financial-information.component.scss']
})




export class FinancialInformationComponent implements OnInit {
  w9FileName: string;
  docKey: string;
   fileExist = false;
  fileInformation = [];
  w9FileData = [];
  w9FileObj: any;
  w9FileInfo: IW9FileInfo ;
  isUploadNewForm: boolean;


  // flags for changing display of page
  isDefaultView = true;
  isEditFinancialInfo = false;
  isAddFinancialInfo = false;
  isViewFinancialInfo = false;
  displayFinancialInfoFields = false;
  IsACHSelected = false;
  isDisable = false;
  submitted: boolean;
  IsUpdateDisable = false;





  // Other variables
  financialData: any;
  showVendorError = false;
  vendorname: string;
  vendorid: any;
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
  isNoFileSelected = true;
  isFreshUpload = false;
  subscription: Subscription;


  // constructor to initialize services

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
    public fileService: FileUploaderService,
    private ds: DataService,
    public snackBar: MatSnackBar
  ) {
    // get current vendor id
    this.vendorid = this.route.snapshot.params['id'];
    this.subscription = this.ds.getData().subscribe(formPageEvent => {
      if (formPageEvent && formPageEvent.formType === 'updateDataList') {
        this.loadvendordata(this.vendorid);
      }
    });
  }



  // Initializes the page
  ngOnInit() {
    // Set Page Title
    this.financialPageTitle = 'Financial Information';
    this.broadService.on<any>('updateFinancialData').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
        console.log(obj);
        if (obj) {
          this.loadvendordata(this.vendorid);
        }
      });
    });



    // Load Vendor data and financial data
    this.loadvendordata(this.vendorid);
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
          this.maskedTaxId =
          this.financialData.taxId.substr(0, 3).replace(/[0-9]/g, 'x') + '-'
          + this.financialData.taxId.substr(3, 2).replace(/[0-9]/g, 'x') + '-' + this.financialData.taxId.substr(5, 4);
         }
          if (this.financialData.taxIdType === 'EIN') {
          this.maskedTaxId = this.financialData.taxId.substr(0, 2).replace(/[0-9]/g, 'x') +
           '-' + this.financialData.taxId.substr(2, 3).replace(/[0-9]/g, 'x') + this.financialData.taxId.substr(5, 4);
          }
          this.isViewFinancialInfo = true;
          this.isDefaultView = false;

      } else {

        this.isViewFinancialInfo = false;
        this.isDefaultView = true;
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
  this.isFreshUpload = false;
  } else {
    this.fileExist = false;
    this.isNoFileSelected = true;
    this.isFreshUpload = true;
  }
}
    });

}




  // Change To Add Mode
  displayAddFinancialInfoFields() {
    if (this.contactdata.vendorAddress.length >= 1
       && (this.contactdata.vendorPhone.length >= 1 || this.contactdata.vendorEmail.length >= 1)) {
      this.ds.sendData({ 'formType': 'add-edit-financial-information', 'value': this.vendorid });
       // this.router.navigate(['vendor', 'add-edit-financial-information', this.vendorid]);
    } else {
      const dialogRefmsg = this.dialog.showDialog('Please add mailing address and either phone or email to proceed', 'Ok', '400');
      dialogRefmsg.afterClosed().subscribe(result => {
        if (result) {
          this.isDefaultView = true;
        } else {

        }
      });
    }

  }







  // Change to Edit Mode
  editFinancialInfo() {
    this.ds.sendData({ 'formType': 'add-edit-financial-information', 'value': this.vendorid });

    }


// W9 Upload and View Section




  /* file upload */


  uploadW9Form() {

    this.fileService.uploadAll();
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




  // Download W9
    downloadFile(docKey, fileName) {
      this.fileService.getFile(docKey, fileName)
        .subscribe(blob => { saveAs(blob, fileName.split('.', 1) + '.pdf', { type: 'text/plain;charset=windows-1252' });
      });
    }

  }













