import { Component, OnInit, EventEmitter, NgZone, Output,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  IVendorName, IVendorAddress, IVendorAddressInfo, IServiceType, IVendorEmail,
  IVendorPhone, ICompanyInformation, IVendorProfileModel, IVendorProfileModelResponse, ICommunication
} from '../../../shared/models/add-vendor-model';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
import { DialogsService } from '../../../shared/services/dialogs.service';
import { SwitchComponent } from '../../../shared/components/switch/switch.component';
import { ConfirmDialogComponent } from '../../../shared/components/index';
import { MatDialog, MatSnackBar } from '@angular/material';
import { VendorListComponent } from '../vendor_list/vendor_list.component';
import { BroadcastService } from '../../services/broadcast.service';



@Component({
  selector: 'app-addvendor',
  templateUrl: './addvendor.component.html',
  styleUrls: ['./addvendor.component.scss'],
  providers: [VendorListComponent]
})
export class AddvendorComponent implements OnInit {
  @Output() closeToggle = new EventEmitter();
  public vendorProfileForm: FormGroup;
  public suffixs: string[];
  public states: string[];
  public emailPattern: string;
  public zipcodePattern: string;
  public phoneNumberPattern: string;
  public textFieldPattern: string;
  public middleName: string;
  public streetPattern: string;
  public cityPattern: string;
  public companyNamePattern: string;
  public submitted: boolean = false;
  chkStaffApraiser: any;
  vendorData: any;

  public chkmailbox: boolean = false;
  markCompanyNameReadonly: any;

  modifiedNumber: string;
  primaryNumber: any;
  regx = new RegExp(/\D$/);
  services = ['Appraisal', 'Broker'];
  vendorPhonePrimary: IVendorPhone;
  max: any = 10;
  zipLength: any = 5;
  phonetypes: string[];
  isdisable: boolean = false;
  isPoBoxError: boolean = false
  isAllFieldsOfAddressRequired: boolean = false;
  isAllFieldsOfMailingAddressRequired: boolean = false;
  @ViewChild('f') myForm;

  constructor(private vendorSandbox: VendorSandbox, private globalErrorHandler: GlobalErrorHandler,
    public router: Router,
    public $fb: FormBuilder, public snackBar: MatSnackBar,
    public appComp: AppComponent,
    public dialog: DialogsService,
    public broadService: BroadcastService,
    public zone: NgZone) {
    localStorage.setItem('vendorid', '');
  }

  convertToValue(key: string) {
    return this.vendorProfileForm.value[key].map((x, i) => x && this[key][i]).filter(x => !!x);
  }

  ngOnInit() {
    /* broadcast servive to hide license*/
    window.scrollTo(0, 0);
    this.broadService.on<any>('isserviceschanged').subscribe((item) => {
      this.zone.run(() => {
        // Angular2 Issue
      });
    });
    this.broadService.on<any>('addvendordata').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
      });
    });
    this.vendorForm();
  }

  vendorForm() {
    const defaultServices = [];
    this.emailPattern = '^[a-z][a-z|0-9|]*([_][a-z|0-9]+)*([.][a-z|0-9]+([_][a-z|0-9]+)*)?@[a-z][a-z|0-9|]*\.([a-z][a-z|0-9]*(\.[a-z][a-z|0-9]*)?)$';
    this.zipcodePattern = '^00[5-9][0-9]{2}$|\^0[1-9][0-9]{3}$|\^[1-9][0-9]{4}$';
    //  this.textFieldPattern = '^([A-Za-z-,.\'` -]{0,200})+$';
    // this.streetPattern = '^([A-Za-z0-9-, .:/]{0,100})+$';
    //  this.cityPattern = '^([A-Za-z0-9 /]{0,100})+$';
    //  this.middleName = '^([A-Za-z-,.\'`-]{0,200})+$';
    //   this.companyNamePattern = '^([A-Za-z0-9-,.\'` -&@!()[]{0,200})+$';
    this.suffixs = ['Jr',
      'Sr', 'III', 'IV', 'V'];
    this.states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC',
      'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA',
      'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH',
      'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
      'TX', 'UT', 'VT', 'VA', 'WA', 'WI', 'WV', 'WY', 'AS', 'FM', 'GU', 'MH', 'MP',
      'PI', 'PW'];
    this.phonetypes = ['MOBILE', 'WORK'];
    this.vendorProfileForm = this.$fb.group({
      chkmailbox: [false],
      chkStaffApraiser: [false],
      firstName: [, Validators.pattern(this.textFieldPattern)],
      lastName: [, Validators.pattern(this.textFieldPattern)],
      middleName: [, Validators.pattern(this.middleName)],
      suffix: ['',],
      preferedName: [, Validators.pattern(this.textFieldPattern)],
      street: [, Validators.pattern(this.streetPattern)],
      city: [, Validators.pattern(this.cityPattern)],
      state: ['',],
      zipcode: [, [Validators.pattern(this.zipcodePattern)]],
      mstreet: [, Validators.pattern(this.streetPattern)],
      mcity: [, Validators.pattern(this.cityPattern)],
      mstate: ['',],
      mzipcode: [, [Validators.pattern(this.zipcodePattern)]],
      services: this.$fb.array(this.services.map(x => defaultServices.indexOf(x) > -1), Validators.required),
      primaryemail: [,],
      secondaryemail: [,],
      companyName: [, Validators.pattern(this.companyNamePattern)],
      companystate: ['', [Validators.required]],
      primaryphone: [],
      secondaryphone: [],
      phoneType: ['',],
      phoneInfo: this.$fb.array([
        this.initPhone(),
      ])
    });
  }


  addvendorDialog(): void {
    let dialogRef = this.dialog.showDialog('Are you sure you want to save?', 'Yes', '400');
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);

      if (result) {
        this.addVendor();
      }
    });

  }

  addVendor(): void {
    this.broadService.broadcast('isserviceschanged', true);
    this.isdisable = true;
    const selectedServiceTypes = this.convertToValue('services');
    let isMailingAddressSame;

    let form = this.vendorProfileForm.value;

    let vendor = <IVendorName>{
      firstName: form.firstName,
      lastName: form.lastName,
      middleName: form.middleName,
      suffix: form.suffix,
      preferredName: form.preferedName,
      isStaffAppraiser: form.chkStaffApraiser
    };

    let vendorAddress = <IVendorAddress>{
      StreetAddress: form.street,
      City: form.city,
      State: form.state,
      Zipcode: form.zipcode
    };
    let vendorServiceType = <IServiceType>{
      ServiceType: selectedServiceTypes
    };
    //Email Object
    let vendorEmailPrimary = <IVendorEmail>{
      Email: form.primaryemail,
      Type: 'Primary'
    };
    let vendorEmailSecondary = <IVendorEmail>{
      Email: form.secondaryemail,
      Type: 'Secondary'
    };
    let vendorCommScore = <ICommunication>{
      score: 0
    }

    let emailList = new Array();
    let phoneList = new Array();
    let addressList = new Array();

    //address Array
    if (form.chkmailbox === true) {

      let vendorMailingAddress = <IVendorAddress>{
        StreetAddress: form.mstreet,
        City: form.mcity,
        State: form.mstate,
        Zipcode: form.mzipcode
      };
      isMailingAddressSame = false;
      let venodorMailingAddressInfo = <IVendorAddressInfo>{
        address: vendorMailingAddress,
        addressType: 'Mailing',
        isMailingAddressSame: isMailingAddressSame
      }
      if (form.mstreet != null || form.mstreet != '') {
        addressList.push(venodorMailingAddressInfo);
      }
      this.chk();
    }
    else {
      isMailingAddressSame = true;
    }

    let venodorPhyAddressInfo = <IVendorAddressInfo>{
      address: vendorAddress,
      addressType: 'Physical',
      isMailingAddressSame: isMailingAddressSame
    }
    if (form.street != null || form.street != '') {
      addressList.push(venodorPhyAddressInfo);
    }

    // Phone Object
    let formArr = this.vendorProfileForm.get('phoneInfo') as FormArray;
    let numType: string;
    let finalphone: string;
    for (let i = 0; i < formArr.length; i++) {

      if (this.primaryNumber === null || this.primaryNumber === undefined || this.primaryNumber === '') {
        this.primaryNumber = 0;
        numType = 'Primary';
      } else {
        if (this.primaryNumber === i) {
          numType = 'Primary';
        } else {
          numType = 'Secondary';
        }
      }
      finalphone = formArr.at(i).get('phoneNumber').value;
      if (finalphone !== null && finalphone !== '') {
        this.vendorPhonePrimary = <IVendorPhone>{
          Phone: finalphone.replace(/[^0-9a-zA-Z]/g, ''),
          numberType: numType,
          phoneType: formArr.at(i).get('phoneType').value,
          allowTexts: formArr.at(i).get('mySwitch').value,
          phoneExtension: formArr.at(i).get('phoneExtension').value 
        };
        phoneList.push(this.vendorPhonePrimary);
      }
    }


    //Email Array
    emailList.push(vendorEmailPrimary);
    emailList.push(vendorEmailSecondary);

    let vendorcompanyInformation = <ICompanyInformation>{
      CompanyName: form.companyName,
      State: form.companystate
    };


    let vendorData = <IVendorProfileModel>{
      name: vendor,
      address: addressList,
      servicetype: vendorServiceType,
      company: vendorcompanyInformation,
      email: emailList,
      phone: phoneList,
      communicationScore:vendorCommScore
    };
console.log('vendorData' + vendorData);

    {
      if (((form.city == null || form.city == '') && (form.street == null || form.street == '') && (form.mstreet == null || form.mstreet == '') && (form.state == null || form.state == '')
        && (form.zipcode == '' || form.zipcode == null)
      ) && ((form.primaryemail == '' || form.primaryemail == null)
        && (form.secondaryemail == '' || form.secondaryemail == null))
        && (phoneList.length == 0)
      ) {
        this.isdisable = false;
        this.submitted = false;
      } else {
        this.vendorSandbox.addVendorList(vendorData);
        this.vendorSandbox.addVendor$.subscribe((addedVendorDetails: IVendorProfileModelResponse) => {
          if (addedVendorDetails && addedVendorDetails.isSuccessful) {            
            this.vendorData = addedVendorDetails;
            localStorage.setItem('vendorid', addedVendorDetails.createdVendorId);
            //this.appComp.gedata();
            this.vendorProfileForm.reset();
            this.closeToggle.emit(true)
            this.snackBar.open('Vendor ' + addedVendorDetails.name.firstName + ' Added Successfully', 'Close', {
              duration: 3000,
            });
           
          }

        }
          , error => this.globalErrorHandler.handleError(error),
          () => {
            this.myForm.resetForm();            
            this.broadService.broadcast('addvendordata', vendorData);
            // this.router.navigate(['vendor', 'summary', this.vendorData.createdVendorId]);
            this.ngOnInit();
          });
      }
      
    }

  }

  onStateChange(event: any) {
    console.log(event.value);   
      this.chckvalidations('state');
      this.chckmailingvalidations('mstate');
      this.chk();   
  }



  onBlurMethod(value, e) {
    this.vendorProfileForm.get(e).setValue(value.toString().trim());
    this.chckvalidations(e);
    this.chckmailingvalidations(e);
    this.chk();
    if (e === 'companyName' || e ==='companystate') {
      this.checkCompanyFieldsNull();
    }
   
    if (value) {
     
      var valueStreet = this.vendorProfileForm.get('street').value;
      if (this.checkPOBox(valueStreet)) {
       // this.isdisable = true;
        this.isPoBoxError = true;
        this.vendorProfileForm.get('street').setErrors({ 'valid': false });
      } else {
        this.isPoBoxError = false;
        //this.isdisable = false;
      }
    }
  }

  setErrorForPOBox(value, e) {    
    if (e == 'street' && this.checkPOBox(value)) {
      this.isdisable = true;
    } else {
      this.isPoBoxError = false;
      this.chk();
    }
  }

  setCompanyInfomation(event) {
    if (this.vendorProfileForm.get('chkStaffApraiser').value === true) {

      this.vendorProfileForm.get('companyName').setValue('Assurant Valuations');

      this.markCompanyNameReadonly = true;      
        this.checkCompanyFieldsNull();
     
    }
    else {     
      this.vendorProfileForm.get('companyName').setValue('');
      this.vendorProfileForm.get('companyName').enable();
      this.vendorProfileForm.get('companyName').markAsUntouched();
      this.vendorProfileForm.get('companyName').updateValueAndValidity();
      this.vendorProfileForm.get('companystate').setValue('');
      this.vendorProfileForm.get('companystate').enable();
      this.vendorProfileForm.get('companystate').markAsUntouched();
      this.vendorProfileForm.get('companystate').updateValueAndValidity();
      this.markCompanyNameReadonly = false;
    }

  }
  checkPOBox(value) {
    if (value) {
      var flag = false;
      var listPobox = ['po box', 'p.o box', 'p o box', 'pobox', 'po.box', 'p.o.box', 'p.o. box'];
      for (var i = 0; i < listPobox.length; i++) {
        var toLower = value.toLowerCase();
        if (toLower.includes(listPobox[i])) { return true }
        else { flag = false }
      }
      return flag;
    }
  }
  // all address fields required start
  chckvalidations = function (e) {
    if (this.checkAddressNullorEmpty() == true) {
      if (e == 'street' || e == 'city' || e == 'state' || e == 'zipcode') {
        this.checkaddressfiledsnullorempty();
      }
    } else {
      this.vendorProfileForm.get('street').setErrors(null);
      this.vendorProfileForm.get('state').setErrors(null);
      this.vendorProfileForm.get('city').setErrors(null);
      this.vendorProfileForm.get('zipcode').setErrors(null);
    }
  };

  chckmailingvalidations = function (e) {
    if (this.checkmaillingAddressNullorEmpty() == true) {
      if (e == 'mstreet' || e == 'mcity' || e == 'mstate' || e == 'mzipcode') {
        this.checkmallingaddressfiledsnullorempty();
      }
    } else {
      this.vendorProfileForm.get('mstreet').setErrors(null);
      this.vendorProfileForm.get('mstate').setErrors(null);
      this.vendorProfileForm.get('mcity').setErrors(null);
      this.vendorProfileForm.get('mzipcode').setErrors(null);
    }
  }

  chk = function () {    
    if (this.checkEmailInformationNullOrEmpty() == false && this.checkAddressNullorEmpty() == false && this.checkPhoneInformationNullOrEmpty() == false && this.checkmaillingAddressNullorEmpty() == false) {
      this.isdisable = true;
    } else {
      this.isdisable = false;
    }
  };

  addressChecked = function (event) {
    if (this.vendorProfileForm.get('chkmailbox').value === true) {
      this.vendorProfileForm.get('mstreet').setErrors(null);
      this.vendorProfileForm.get('mstreet').setValidators(Validators.required);
    }
    else {
      this.vendorProfileForm.get('mstreet').setErrors(null);
      this.vendorProfileForm.get('mstreet').setValidators(Validators.nullValidator);
      this.vendorProfileForm.get('mstreet').updateValueAndValidity();
      this.vendorProfileForm.get('mstreet').markAsUntouched();
      this.vendorProfileForm.get('mstreet').setValue('');
      this.vendorProfileForm.get('mzipcode').setValue('');
      this.vendorProfileForm.get('mcity').setValue('');
      this.vendorProfileForm.get('mstate').setValue('');
    }

  }

  checkEmailInformationNullOrEmpty = function () {
    let form = this.vendorProfileForm.value;
    if ((form.primaryemail == null || form.primaryemail == '') && (form.secondaryemail == null || form.secondaryemail == '')) {
      return false;
    } else {
      return true
    }
  };

  checkAddressNullorEmpty = function () {
    if ((this.vendorProfileForm.get('city').value == '' || this.vendorProfileForm.get('city').value == null || this.vendorProfileForm.get('city').value == undefined) && (this.vendorProfileForm.get('street').value == '' || this.vendorProfileForm.get('street').value == null)
      && (this.vendorProfileForm.get('zipcode').value == '' || this.vendorProfileForm.get('zipcode').value == null) &&
      (this.vendorProfileForm.get('state').value == '' || this.vendorProfileForm.get('state').value == null) &&
      (this.vendorProfileForm.get('street').value == '' || this.vendorProfileForm.get('street').value == null)) {
      return false;
    } else {
      return true;
    }
  }
  checkmaillingAddressNullorEmpty = function () {
    if ((this.vendorProfileForm.get('mcity').value == '' || this.vendorProfileForm.get('mcity').value == null || this.vendorProfileForm.get('mcity').value == undefined) && (this.vendorProfileForm.get('mstreet').value == '' || this.vendorProfileForm.get('mstreet').value == null)
      && (this.vendorProfileForm.get('mzipcode').value == '' || this.vendorProfileForm.get('mzipcode').value == null) &&
      (this.vendorProfileForm.get('mstate').value == '' || this.vendorProfileForm.get('mstate').value == null) &&
      (this.vendorProfileForm.get('mstreet').value == '' || this.vendorProfileForm.get('mstreet').value == null)) {
      return false;
    }
    else {
      return true;
    }
  }
  checkCompanyFieldsNull() {
    if (this.vendorProfileForm.get('companystate').value != '' && this.vendorProfileForm.get('companystate').value != null && this.vendorProfileForm.get('companystate').value != undefined) {
      this.vendorProfileForm.get('companystate').setErrors(null);

    } else {
      this.vendorProfileForm.get('companystate').setErrors({ 'valid': false });
      this.vendorProfileForm.get('companystate').markAsTouched();
    }
    if (this.vendorProfileForm.get('companyName').value !== '' && this.vendorProfileForm.get('companyName').value != null && this.vendorProfileForm.get('companyName').value !== undefined) {
      this.vendorProfileForm.get('companyName').setErrors(null);
    } else {
      this.vendorProfileForm.get('companyName').setErrors({ 'valid': false });
      this.vendorProfileForm.get('companyName').markAsTouched();
    }
  }
  checkaddressfiledsnullorempty = function () {    
    if (this.vendorProfileForm.get('street').value !== '' && this.vendorProfileForm.get('street').value != null && this.vendorProfileForm.get('street').value !== undefined) {
      this.vendorProfileForm.get('street').setErrors(null);
    } else {
      this.vendorProfileForm.get('street').setErrors({ 'valid': false });
      this.vendorProfileForm.get('street').markAsTouched();
    }

    if (this.vendorProfileForm.get('city').value !== '' && this.vendorProfileForm.get('city').value != null && this.vendorProfileForm.get('city').value != undefined) {
      this.vendorProfileForm.get('city').setErrors(null);
    } else {
      this.vendorProfileForm.get('city').setErrors({ 'valid': false });
      this.vendorProfileForm.get('city').markAsTouched();
    }

    if (this.vendorProfileForm.get('zipcode').value != '' && this.vendorProfileForm.get('zipcode').value != null && this.vendorProfileForm.get('zipcode').value != undefined) {
      if (this.vendorProfileForm.get('zipcode').status == 'VALID') {
        this.vendorProfileForm.get('zipcode').setErrors(null);

      } else {

        this.vendorProfileForm.get('zipcode').setErrors({ 'valid': false });
        this.vendorProfileForm.get('zipcode').markAsTouched();
        this.isAllFieldsOfAddressRequired = false;
      }
    } else {
      this.vendorProfileForm.get('zipcode').setErrors({ 'valid': false });
      this.vendorProfileForm.get('zipcode').markAsTouched();
      this.isAllFieldsOfAddressRequired = true;
    }

    if (this.vendorProfileForm.get('state').value != '' && this.vendorProfileForm.get('state').value != null && this.vendorProfileForm.get('state').value != undefined) {
      this.vendorProfileForm.get('state').setErrors(null);

    } else {
      this.vendorProfileForm.get('state').setErrors({ 'valid': false });
      this.vendorProfileForm.get('state').markAsTouched();

    }
  }
  checkmallingaddressfiledsnullorempty = function () {
    if (this.vendorProfileForm.get('mstreet').value != '' && this.vendorProfileForm.get('mstreet').value != null && this.vendorProfileForm.get('mstreet').value != undefined) {
      this.vendorProfileForm.get('mstreet').setErrors(null);

    } else {
      this.vendorProfileForm.get('mstreet').setErrors({ 'valid': false });
      this.vendorProfileForm.get('mstreet').markAsTouched();
    }

    if (this.vendorProfileForm.get('mcity').value != '' && this.vendorProfileForm.get('mcity').value != null && this.vendorProfileForm.get('mcity').value != undefined) {
      this.vendorProfileForm.get('mcity').setErrors(null);

    } else {
      this.vendorProfileForm.get('mcity').setErrors({ 'valid': false });
      this.vendorProfileForm.get('mcity').markAsTouched();
    }

    if (this.vendorProfileForm.get('mzipcode').value != '' && this.vendorProfileForm.get('mzipcode').value != null && this.vendorProfileForm.get('mzipcode').value != undefined) {
      if (this.vendorProfileForm.get('mzipcode').status == 'VALID') {
        this.vendorProfileForm.get('mzipcode').setErrors(null);

      }
      else {
        this.vendorProfileForm.get('mzipcode').setErrors({ 'valid': false });
        this.vendorProfileForm.get('mzipcode').markAsTouched();
        this.isAllFieldsOfMailingAddressRequired = false;
      }
    } else {
      this.vendorProfileForm.get('mzipcode').setErrors({ 'valid': false });
      this.vendorProfileForm.get('mzipcode').markAsTouched();
      this.isAllFieldsOfMailingAddressRequired = true;
    }

    if (this.vendorProfileForm.get('mstate').value != '' && this.vendorProfileForm.get('mstate').value != null && this.vendorProfileForm.get('mstate').value != undefined) {
      this.vendorProfileForm.get('mstate').setErrors(null);

    } else {
      this.vendorProfileForm.get('mstate').setErrors({ 'valid': false });
      this.vendorProfileForm.get('mstate').markAsTouched();
    }
  }


  checkPhoneInformationNullOrEmpty = function () {
    let formArr = this.vendorProfileForm.value.phoneInfo;
    let value = false;
    for (let i = 0; i < formArr.length; i++) {
      if (formArr[i].phoneNumber == null || formArr[i].phoneNumber == undefined || formArr[i].phoneNumber == '') { value = false; } else {
        let ss = formArr[i].phoneNumber.replace(/[^a-zA-Z 0-9]/g, '');
        if (ss.length < 10) {
          value = false;
        } else {
          value = true;
        }
      }
    }
    return value;
  };
  //all address fields required end 
  // Phone UI Relted methods -Start 
  primaryNumberFormatChange(number: any, i) {
    let formArr = this.vendorProfileForm.get('phoneInfo') as FormArray;
    if (number.length < 10 && number.length != 0) {
      if (formArr.at(i).get('phoneType').untouched) {
        formArr.at(i).get('phoneType').setErrors(null);
        formArr.at(i).get('phoneType').setValidators(Validators.required);
        formArr.at(i).get('phoneType').setErrors({ 'valid': false });
        formArr.at(i).get('phoneType').markAsTouched();
      } else {
        formArr.at(i).get('phoneNumber').setErrors(null);
        formArr.at(i).get('phoneNumber').setValidators(Validators.required);
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        if (formArr.at(i).get('phoneType').value === '' || formArr.at(i).get('phoneType').value === undefined) {
          formArr.at(i).get('phoneType').setErrors(null);
          formArr.at(i).get('phoneType').setValidators(Validators.required);
          formArr.at(i).get('phoneType').setErrors({ 'valid': false });
          formArr.at(i).get('phoneType').markAsTouched();
        }
      }
      this.chk();
    }

    if (number.length === 10) {

    }

    if (number.length === 0) {
      let formArr = this.vendorProfileForm.get('phoneInfo') as FormArray;
      formArr.at(i).valid;
      formArr.at(i).get('phoneNumber').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': true });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
      formArr.at(i).get('phoneType').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneType').setErrors({ 'valid': true });
      formArr.at(i).get('phoneType').setValue('');
      formArr.at(i).get('phoneType').updateValueAndValidity();
      formArr.at(i).get('mySwitch').setValue(false);
    }


  }

  changeSwitch(e, i) {
    let formArr = this.vendorProfileForm.get('phoneInfo') as FormArray;
    if (e.checked === true) {
      if (formArr.at(i).get('phoneNumber').value < 10 || formArr.at(i).get('phoneType').value === '') {
        formArr.at(i).get('phoneNumber').setValidators(Validators.required);
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        formArr.at(i).get('phoneNumber').updateValueAndValidity();
        formArr.at(i).get('phoneNumber').markAsTouched();
        formArr.at(i).get('phoneType').setValidators(Validators.required);
        formArr.at(i).get('phoneType').setErrors({ 'valid': false });
        formArr.at(i).get('phoneType').updateValueAndValidity();
        formArr.at(i).get('phoneType').markAsTouched();
      }
    } else {
      formArr.at(i).get('phoneNumber').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': true });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
      formArr.at(i).get('phoneType').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneType').setErrors({ 'valid': true });
      formArr.at(i).get('phoneType').updateValueAndValidity();
    }
  }

  out(number: string, i) {
    let formArr = this.vendorProfileForm.get('phoneInfo') as FormArray;
    let trimmedNum = number.toString().trim()
    if (trimmedNum.length == 10 && /^\d+$/.test(trimmedNum)) {
      formArr.at(i).get('phoneNumber').setValidators(Validators.maxLength(14))
      this.modifiedNumber = '(' + trimmedNum.substr(0, 3) + ') ' + trimmedNum.substr(3, 3) + '-' + trimmedNum.substr(6, 4);
      formArr.at(i).get('phoneNumber').setValue(this.modifiedNumber)
    } else if (trimmedNum.length < 10 && trimmedNum.length != 0) {
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
    } else if (/^\d+$/.test(trimmedNum) === false && trimmedNum.length === 10) {
      formArr.at(i).get('phoneNumber').setErrors(null);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
    } else {
      formArr.at(i).get('phoneNumber').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': true });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
    }
    this.chk();
  }

  primaryNumFoucusIn(number: String, i) {
    let formArr = this.vendorProfileForm.get('phoneInfo') as FormArray;
    console.log(formArr.at(i).get('phoneNumber').value);
    if (formArr) {
      if (formArr.at(i).get('phoneNumber').value) {
        let len = formArr.at(i).get('phoneNumber').value.length;
        if (len < 10 && len != 0) {
          formArr.at(i).get('phoneNumber').setValidators(Validators.maxLength(10))
          this.modifiedNumber = number.replace(/[^0-9a-zA-Z]/g, '');
          formArr.at(i).get('phoneNumber').setValue(this.modifiedNumber)
          formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        } else {
          formArr.at(i).get('phoneNumber').setValidators(Validators.maxLength(10))
          this.modifiedNumber = number.replace(/[^0-9a-zA-Z]/g, '');
          formArr.at(i).get('phoneNumber').setValue(this.modifiedNumber)
        }
      }
    }

  }

  initPhone() {
    return this.$fb.group({
      phoneRadio: [],
      phoneType: [''],
      mySwitch: [],
      phoneNumber: [],
      phoneExtension: [],

    });
  }

  handleChange(evt, i) {
    if (evt.target.checked) {
      this.primaryNumber = i;
      let formArr = this.vendorProfileForm.get('phoneInfo') as FormArray;
      if (formArr.at(i).get('phoneNumber').value < 10 || formArr.at(i).get('phoneType').value === '') {
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        formArr.at(i).get('phoneType').setErrors({ 'valid': false });
      }


    }
  }

  addPhone() {
    const control = <FormArray>this.vendorProfileForm.controls['phoneInfo'];
    control.push(this.initPhone());
  }

  removephone(i: number) {
    const control = <FormArray>this.vendorProfileForm.controls['phoneInfo'];
    control.removeAt(i);
    this.chk();
  }

  onTypeChange(value, i) {
    let formArr = this.vendorProfileForm.get('phoneInfo') as FormArray;
    let len = formArr.at(i).get('phoneNumber').value;

    if (value === 'MOBILE') {
      if (len === null || (len.length < 10 && len.length != 0) || len === '') {
        formArr.at(i).get('phoneNumber').setErrors(null);
        formArr.at(i).get('phoneNumber').setValidators(Validators.required);
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        formArr.at(i).get('phoneNumber').markAsTouched();
      }
      formArr.at(i).get('mySwitch').setValue(true);
    } else if (value === 'WORK') {
      if (len === null || (len.length < 10 && len.length != 0) || len === '') {
        formArr.at(i).get('phoneNumber').setErrors(null);
        formArr.at(i).get('phoneNumber').setValidators(Validators.required);
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        formArr.at(i).get('phoneNumber').markAsTouched();
      }
      formArr.at(i).get('mySwitch').setValue(false);
    } else if (len === null || len.length === 0) {

      formArr.at(i).get('phoneNumber').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': true });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
      formArr.at(i).get('mySwitch').setValue(false);

    } else if ((len != null || (len.length < 10 && len.length != 0))) {

      formArr.at(i).get('phoneNumber').setValidators(Validators.required);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
      formArr.at(i).get('phoneType').setValidators(Validators.required);
      formArr.at(i).get('phoneType').setErrors({ 'valid': false });
      formArr.at(i).get('phoneType').updateValueAndValidity();

    } else if ((len === null || len.length === 0) && value === '') {

      formArr.at(i).get('phoneNumber').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': true });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
      formArr.at(i).get('phoneType').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneType').setErrors({ 'valid': true });

      formArr.at(i).get('phoneType').updateValueAndValidity();
      formArr.at(i).get('mySwitch').setValue(false);

    }
    this.chk();
  }

  addVendorToggleClose() {
    let dref = this.dialog.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        //this.myForm.resetForm();
       // this.ngOnInit();
        this.closeToggle.emit(true);
      } else {
      }
    });
  } 
  //Phone UI Related Methods  -End
}
