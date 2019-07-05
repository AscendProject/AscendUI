import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../config.service';
import { ContactVendorApiService } from '../../services/contact-vendor-api.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { VendorSandbox } from '../../vendor.sandbox';
import { Observable } from 'rxjs'
import {
  IVendorName, IVendorAddress, IVendorAddressInfo, IServiceType, IVendorEmail,
  IVendorPhone, ICompanyInformation, IVendorProfileModel, IVendorProfileModelResponse
} from '../../../shared/models/add-vendor-model';
import { DialogsService } from '../../../shared/services/dialogs.service';
import { ContactpageAuditHistoryComponent } from '../contactpage-audit-history/contactpage-audit-history.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  vendorid: any;
  iseditvendoraddressdetais = false;
  isvendoraddressdetails = true;
  isaddvendoraddress = false;
  zipLength: number = 5;
  contactdata: any;
  public vendorProfileAddressPhysicalForm: FormGroup;
  public vendorProfileAddressMailingForm: FormGroup;
  public states: string[];
  public vendorProfileAddAddressForm: FormGroup;
  addressViewData: any = [];
  isPoBoxError = false;
  public zipcodePattern: string;
  public streetPattern: string;
  public cityPattern: string;
  isAddrFormDisable = false;
  @Output() messageAddressEvent = new EventEmitter<Object>();
  isDisableBtn = false;
  @ViewChild(ContactpageAuditHistoryComponent) historyComponent: ContactpageAuditHistoryComponent;
  
  @Input() set contactData(newData) {
    console.log(newData);
    this.contactdata = newData;
    this.editloadPageAddress(this.contactdata);
  }

  constructor(public router: Router,
    public route: ActivatedRoute,
    private configService: ConfigService,
    public vendorservice: VendorSandbox,
    public $fb: FormBuilder,
    private dialogService: DialogsService) {
    this.vendorid = this.route.snapshot.params['id'];

  }

  ngOnInit() {
    console.log('Configuration ready: ' + this.configService.isReady);
    if (this.configService.isReady) {
     // this.loadVendorData(this.vendorid);

    } else {
      this.configService.settingsLoaded$.subscribe(x => {
     //   this.loadVendorData(this.vendorid);
      });
    }
  }
  editloadPageAddress(data) {
    this.zipcodePattern = '^00[5-9][0-9]{2}$|\^0[1-9][0-9]{3}$|\^[1-9][0-9]{4}$';
    this.streetPattern = '^([A-Za-z0-9-, .:/]{0,100})+$';
    this.cityPattern = '^([A-Za-z0-9 /]{0,100})+$';

    this.states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC',
      'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA',
      'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH',
      'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
      'TX', 'UT', 'VT', 'VA', 'WA', 'WI', 'WV', 'WY', 'AS', 'FM', 'GU', 'MH', 'MP',
      'PI', 'PW'];

    this.vendorProfileAddressPhysicalForm = this.$fb.group({      
      street: [, Validators.pattern(this.streetPattern)],
      city: [, Validators.pattern(this.cityPattern)],
      state: ['',],
      zipcode: [, [Validators.pattern(this.zipcodePattern)]],
      addressType: [],
      isMailingAddressDifferent: [],
      addressId: [],
      isDeleted: []
    });
    this.vendorProfileAddressMailingForm = this.$fb.group({   
      mstreet: [, Validators.pattern(this.streetPattern)],
      mcity: [, Validators.pattern(this.cityPattern)],
      mstate: ['',],
      mzipcode: [, [Validators.pattern(this.zipcodePattern)]],    
      addressType: [],
      isMailingAddressDifferent: [],
      addressId: [],
      isDeleted: [],
      chkmailbox: [false]
    });
       
    this.patchAddressForm();

    this.vendorProfileAddAddressForm = this.$fb.group({
      state: ['',],
      streetAddress: '',
      city: '',
      zipcode: [, [Validators.pattern(this.zipcodePattern)]],
      isPhysical: ['Physical',]
    });
  }
  patchAddressForm() {
   // let control = <FormArray>this.vendorProfileAddressPhysicalForm.controls.addressItems;
    if (this.contactdata && this.contactdata.vendorAddress) {
      this.addressViewData = this.contactdata.vendorAddress.filter(x => x.isDeleted === false);
      console.log(this.addressViewData);
      this.addressViewData.forEach(x => {
        if (x.addressType === 'Physical') {
          this.vendorProfileAddressPhysicalForm = this.$fb.group({
            street: [x.streetAddress, Validators.pattern(this.streetPattern)],
            city: [x.city, Validators.pattern(this.cityPattern)],
            state: [x.state, '',],
            zipcode: [x.zipcode, [Validators.pattern(this.zipcodePattern)]],
            addressType: [x.addressType, ''],
            isMailingAddressDifferent: [x.isMailingAddressDifferent, ''],
            addressId: x.addressId,
            isDeleted: x.isDeleted            
          });
        }
        if (x.addressType === 'Mailing') {
          this.vendorProfileAddressMailingForm = this.$fb.group({
            mstreet: [x.streetAddress, Validators.pattern(this.streetPattern)],
            mcity: [x.city, Validators.pattern(this.cityPattern)],
            mstate: [x.state,'',],
            mzipcode: [x.zipcode, [Validators.pattern(this.zipcodePattern)]],
            addressType: [x.addressType, ''],
            isMailingAddressDifferent: [x.isMailingAddressDifferent, ''],
            addressId: x.addressId,
            isDeleted: x.isDeleted,
            chkmailbox: [true]
          });
        }
      });      
      
    }    
  }
  onStateChange(event: any) {
    console.log(event.value);
    this.chckvalidations('state');
    this.chckmailingvalidations('mstate');
    this.chk();
  }
  onBlurMethod(value, e) {
    if (value) {
      this.vendorProfileAddressPhysicalForm.get(e).setValue(value.toString().trim());
    }    
    this.chckvalidations(e);
    this.chckmailingvalidations(e);
    this.chk();

    var valueStreet = this.vendorProfileAddressPhysicalForm.get('street').value;
    if (this.checkPOBox(valueStreet)) {
     // this.isdisable = true;
      this.isPoBoxError = true;
      this.vendorProfileAddressPhysicalForm.get('street').setErrors({ 'valid': false });
    } else {
     // this.isdisable = false;
    }
  }
  addressChecked(event) {   
    if (!this.vendorProfileAddressMailingForm.get('chkmailbox').value) {      
      this.vendorProfileAddressMailingForm.get('chkmailbox').setValue(false);
      this.isDisableBtn = false;
    } else {      
      this.vendorProfileAddressMailingForm.get('chkmailbox').setValue(true);
      this.isDisableBtn = true;
    }    
  }
  // all address fields required start
  chckvalidations = function (e) {
    if (this.checkAddressNullorEmpty() == true) {
      if (e == 'street' || e == 'city' || e == 'state' || e == 'zipcode') {
        this.checkaddressfiledsnullorempty();
      }
    } else {
      this.vendorProfileAddressPhysicalForm.get('street').setErrors(null);
      this.vendorProfileAddressPhysicalForm.get('state').setErrors(null);
      this.vendorProfileAddressPhysicalForm.get('city').setErrors(null);
      this.vendorProfileAddressPhysicalForm.get('zipcode').setErrors(null);
    }
  }

  chckmailingvalidations = function (e) {
    if (this.checkmaillingAddressNullorEmpty() == true) {
      if (e == 'mstreet' || e == 'mcity' || e == 'mstate' || e == 'mzipcode') {
        this.checkmallingaddressfiledsnullorempty();
      }
    } else {
      this.vendorProfileAddressMailingForm.get('mstreet').setErrors(null);
      this.vendorProfileAddressMailingForm.get('mstate').setErrors(null);
      this.vendorProfileAddressMailingForm.get('mcity').setErrors(null);
      this.vendorProfileAddressMailingForm.get('mzipcode').setErrors(null);
    }
  }

  chk = function () {
    if (this.checkAddressNullorEmpty() == false && this.checkmaillingAddressNullorEmpty() == false) {
      this.isdisable = true;
    } else {
      this.isdisable = false;
    }
  };
  checkAddressNullorEmpty = function () {
    if ((this.vendorProfileAddressPhysicalForm.get('city').value == '' || this.vendorProfileAddressPhysicalForm.get('city').value == null || this.vendorProfileAddressPhysicalForm.get('city').value == undefined) && (this.vendorProfileAddressPhysicalForm.get('street').value == '' || this.vendorProfileAddressPhysicalForm.get('street').value == null)
      && (this.vendorProfileAddressPhysicalForm.get('zipcode').value == '' || this.vendorProfileAddressPhysicalForm.get('zipcode').value == null) &&
      (this.vendorProfileAddressPhysicalForm.get('state').value == '' || this.vendorProfileAddressPhysicalForm.get('state').value == null) &&
      (this.vendorProfileAddressPhysicalForm.get('street').value == '' || this.vendorProfileAddressPhysicalForm.get('street').value == null)) {
      return false;
    } else {
      return true;
    }
  }
  checkmaillingAddressNullorEmpty = function () {
    if ((this.vendorProfileAddressMailingForm.get('mcity').value == '' || this.vendorProfileAddressMailingForm.get('mcity').value == null || this.vendorProfileAddressMailingForm.get('mcity').value == undefined) && (this.vendorProfileAddressMailingForm.get('mstreet').value == '' || this.vendorProfileAddressMailingForm.get('mstreet').value == null)
      && (this.vendorProfileAddressMailingForm.get('mzipcode').value == '' || this.vendorProfileAddressMailingForm.get('mzipcode').value == null) &&
      (this.vendorProfileAddressMailingForm.get('mstate').value == '' || this.vendorProfileAddressMailingForm.get('mstate').value == null) &&
      (this.vendorProfileAddressMailingForm.get('mstreet').value == '' || this.vendorProfileAddressMailingForm.get('mstreet').value == null)) {
      return false;
    }
    else {
      return true;
    }
  }

  checkaddressfiledsnullorempty = function () {
    if (this.vendorProfileAddressPhysicalForm.get('street').value !== '' && this.vendorProfileAddressPhysicalForm.get('street').value != null && this.vendorProfileAddressPhysicalForm.get('street').value !== undefined) {
      this.vendorProfileAddressPhysicalForm.get('street').setErrors(null);
    } else {
      this.vendorProfileAddressPhysicalForm.get('street').setErrors({ 'valid': false });
      this.vendorProfileAddressPhysicalForm.get('street').markAsTouched();
    }

    if (this.vendorProfileAddressPhysicalForm.get('city').value !== '' && this.vendorProfileAddressPhysicalForm.get('city').value != null && this.vendorProfileAddressPhysicalForm.get('city').value != undefined) {
      this.vendorProfileAddressPhysicalForm.get('city').setErrors(null);
    } else {
      this.vendorProfileAddressPhysicalForm.get('city').setErrors({ 'valid': false });
      this.vendorProfileAddressPhysicalForm.get('city').markAsTouched();
    }

    if (this.vendorProfileAddressPhysicalForm.get('zipcode').value != '' && this.vendorProfileAddressPhysicalForm.get('zipcode').value != null && this.vendorProfileAddressPhysicalForm.get('zipcode').value != undefined) {
      if (this.vendorProfileAddressPhysicalForm.get('zipcode').status == 'VALID') {
        this.vendorProfileAddressPhysicalForm.get('zipcode').setErrors(null);

      } else {

        this.vendorProfileAddressPhysicalForm.get('zipcode').setErrors({ 'valid': false });
        this.vendorProfileAddressPhysicalForm.get('zipcode').markAsTouched();
        this.isAllFieldsOfAddressRequired = false;
      }
    } else {
      this.vendorProfileAddressPhysicalForm.get('zipcode').setErrors({ 'valid': false });
      this.vendorProfileAddressPhysicalForm.get('zipcode').markAsTouched();
      this.isAllFieldsOfAddressRequired = true;
    }

    if (this.vendorProfileAddressPhysicalForm.get('state').value != '' && this.vendorProfileAddressPhysicalForm.get('state').value != null && this.vendorProfileAddressPhysicalForm.get('state').value != undefined) {
      this.vendorProfileAddressPhysicalForm.get('state').setErrors(null);

    } else {
      this.vendorProfileAddressPhysicalForm.get('state').setErrors({ 'valid': false });
      this.vendorProfileAddressPhysicalForm.get('state').markAsTouched();

    }
  }
  checkmallingaddressfiledsnullorempty = function () {
    if (this.vendorProfileAddressMailingForm.get('mstreet').value != '' && this.vendorProfileAddressMailingForm.get('mstreet').value != null && this.vendorProfileAddressMailingForm.get('mstreet').value != undefined) {
      this.vendorProfileAddressMailingForm.get('mstreet').setErrors(null);
      this.isDisableBtn = false;
    } else {
      this.vendorProfileAddressMailingForm.get('mstreet').setErrors({ 'valid': false });
      this.vendorProfileAddressMailingForm.get('mstreet').markAsTouched();
    }

    if (this.vendorProfileAddressMailingForm.get('mcity').value != '' && this.vendorProfileAddressMailingForm.get('mcity').value != null && this.vendorProfileAddressMailingForm.get('mcity').value != undefined) {
      this.vendorProfileAddressMailingForm.get('mcity').setErrors(null);

    } else {
      this.vendorProfileAddressMailingForm.get('mcity').setErrors({ 'valid': false });
      this.vendorProfileAddressMailingForm.get('mcity').markAsTouched();
    }

    if (this.vendorProfileAddressMailingForm.get('mzipcode').value != '' && this.vendorProfileAddressMailingForm.get('mzipcode').value != null && this.vendorProfileAddressMailingForm.get('mzipcode').value != undefined) {
      if (this.vendorProfileAddressMailingForm.get('mzipcode').status == 'VALID') {
        this.vendorProfileAddressMailingForm.get('mzipcode').setErrors(null);

      }
      else {
        this.vendorProfileAddressMailingForm.get('mzipcode').setErrors({ 'valid': false });
        this.vendorProfileAddressMailingForm.get('mzipcode').markAsTouched();
        this.isAllFieldsOfMailingAddressRequired = false;
      }
    } else {
      this.vendorProfileAddressMailingForm.get('mzipcode').setErrors({ 'valid': false });
      this.vendorProfileAddressMailingForm.get('mzipcode').markAsTouched();
      this.isAllFieldsOfMailingAddressRequired = true;
    }

    if (this.vendorProfileAddressMailingForm.get('mstate').value != '' && this.vendorProfileAddressMailingForm.get('mstate').value != null && this.vendorProfileAddressMailingForm.get('mstate').value != undefined) {
      this.vendorProfileAddressMailingForm.get('mstate').setErrors(null);

    } else {
      this.vendorProfileAddressMailingForm.get('mstate').setErrors({ 'valid': false });
      this.vendorProfileAddressMailingForm.get('mstate').markAsTouched();
    }
  }

  toTitleCase(str) {
    if (str != null || str != undefined) {
      if (str.includes("'") && str.split("'")[1].charAt(0).includes(" ")) {
        str = str.split(" ")[0] + str.split("'")[1].replace(/\s*/, '');
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      } else {
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
    }
  }
  editvendoraddressdetails() {
    this.iseditvendoraddressdetais = true;
    this.isvendoraddressdetails = false;
    this.isaddvendoraddress = false;
    //this.loadVendorData(this.vendorid);
    this.messageAddressEvent.emit({ 'isSuccess': true });
    this.editloadPageAddress(this.contactdata);
  }

  canceladdressupdate() {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.iseditvendoraddressdetais = false;
        this.isvendoraddressdetails = true;
        this.isaddvendoraddress = false;
      } else {

      }
    });
  }
  savevendoraddressdetails() {    
    let physicalForm = this.vendorProfileAddressPhysicalForm.value;
    let mailingForm = this.vendorProfileAddressMailingForm.value;
    let addressList = new Array();
    if (physicalForm) {
      const vendorAddress = {
        StreetAddress: physicalForm.street,
        City: physicalForm.city,
        State: physicalForm.state,
        Zipcode: physicalForm.zipcode
      };
      addressList.push({
        address: vendorAddress,
        addressType: 'Physical',
        isMailingAddressDifferent: this.vendorProfileAddressMailingForm.get('chkmailbox').value ? true : false
      });
    }
    
    if (this.vendorProfileAddressMailingForm.get('chkmailbox').value) {
      const vendorMailAddress = {
        StreetAddress: mailingForm.mstreet,
        City: mailingForm.mcity,
        State: mailingForm.mstate,
        Zipcode: mailingForm.mzipcode
      };
      addressList.push({
        address: vendorMailAddress,
        addressType: 'Mailing',
        isMailingAddressDifferent: true
      });
    }
    let vendorobj = {
      vendorId: this.vendorid,
      updatedVendorSection: 3,
      address: addressList
    };
    let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.vendorservice.updateVendorContactInfo(vendorobj);
        this.vendorservice.updateVendorContactInfo$.subscribe(
          data => {
            //this.toastr.success('Updated Vendor address Details Success', 'Success');
            this.iseditvendoraddressdetais = false;
            this.isvendoraddressdetails = true;
            this.isaddvendoraddress = false;
          //  this.updateContactNameDetails = data;
          //  this.loadVendorData(this.vendorid);
            this.messageAddressEvent.emit({ 'isSuccess': true });
            this.editloadPageAddress(data);
          },
          error => {
            // this.toastr.error('At least one method of contact should be present.', 'Major Error', {
            //   timeOut: 3000,
            // });
          },
          () => {
            //Observable.interval(2000).take(3).subscribe(() => {
            //  this.historyComponent.fetchHistoryDetails();
            //});
          });
      } else {
      }
    });

  }
  setErrorForPOBox(value, e, indx) {
    console.log(value, indx);
    if (indx != null) {
      const controlArray = <FormArray>this.vendorProfileAddressPhysicalForm.get('addressItems');
      if (controlArray.controls[indx].get('addressType').value == 'Physical') {
        if (e == 'streetAddress' && this.checkPOBox(value)) {
          controlArray.controls[indx].get('isPoBoxError').setValue(true);
        } else {
          controlArray.controls[indx].get('isPoBoxError').setValue(false);
        }
      } else {
        controlArray.controls[indx].get('isPoBoxError').setValue(false);
      }
      this.isAddrFormDisable = this.containsArr(controlArray.controls);
    } else {
      if (this.vendorProfileAddAddressForm.get('isPhysical').value == 'Physical') {
        if (e == 'streetAddress' && this.checkPOBox(value)) {
          this.isPoBoxError = true;
        } else {
          this.isPoBoxError = false;
        }
      } else {
        this.isPoBoxError = false;
      }
    }

  }
  containsArr(a) {
    for (var i = 0; i < a.length; i++) {
      if (a[i].get('isPoBoxError').value) {
        return true;
      }
    }
    return false;
  }
  checkPOBox(value) {
    var flag = false;
    var listPobox = ['po box', 'p.o box', 'p o box', 'pobox', 'po.box', 'p.o.box', 'p.o. box'];
    if (value != null || value != undefined || value != '') {
      for (var i = 0; i < listPobox.length; i++) {
        var toLower = value.toLowerCase();
        if (toLower.includes(listPobox[i])) { return true }
        else { flag = false }
      }
      return flag;
    }
  }
  addVendorAddress() {
    this.editloadPageAddress(this.contactdata);
    this.iseditvendoraddressdetais = false;
    this.isvendoraddressdetails = false;
    this.isaddvendoraddress = true;
  }  
  
  deletevendoraddressdetails(addressId) {
    let dref: any;
    let form = this.contactdata.vendorAddress;
    let addressList = new Array();
    for (let eachAddr of form) {
      addressList.push({
        address: {
          StreetAddress: eachAddr.streetAddress,
          City: eachAddr.city,
          State: eachAddr.state,
          Zipcode: eachAddr.zipcode,
          isDeleted: eachAddr.isDeleted
        },
        addressType: eachAddr.addressType,
        isMailingAddressSame: eachAddr.isMailingAddressSame,
        isDeleted: eachAddr.isDeleted,
        addressId: eachAddr.addressId
      });
    }
    for (let i = 0; i < addressList.length; i++) {
      if (addressId == addressList[i].addressId) {
        addressList[i].address.isDeleted = true;
        addressList[i].isDeleted = true;
        break;
      }
    }

    let count = form.filter(form => form.isDeleted == false).length;
    let IsPrimary = form.some(a => a.addressType.includes("Physical") && a.isDeleted == false);
    let test = false;
    if (count == 1) {
      dref = this.dialogService.showDialog('Please note, this is the last address on record. Are you sure you want to delete?', 'Yes', '500');
      dref.afterClosed().subscribe(result => {

        let vendorobj = {
          vendorId: this.vendorid,
          updatedVendorSection: 3,
          address: addressList
        };
        if (result) {
          this.vendorservice.updateVendorContactInfo(vendorobj);
          this.vendorservice.updateVendorContactInfo$.subscribe(
            data => {
              //this.toastr.success('Successfully deleted Vendor address ', 'Success');
              this.iseditvendoraddressdetais = false;
              this.isvendoraddressdetails = true;
              this.isaddvendoraddress = false;
            //  this.updateContactNameDetails = data;
             // this.loadVendorData(this.vendorid);
              this.messageAddressEvent.emit({ 'isSuccess': true });
            },
            error => {
              // this.toastr.error('At least one method of contact should be present.', 'Major Error', {
              //   timeOut: 3000,
              // });

            },
            () => {
             
            });
        } else {
         // this.loadVendorData(this.vendorid);
          this.messageAddressEvent.emit({ 'isSuccess': true });
          this.isaddvendoraddress = false;
          this.iseditvendoraddressdetais = true;
          this.isvendoraddressdetails = false;
        }
      });
    }
    else {
      dref = this.dialogService.showDialog('Are you sure you want to delete?', 'Yes', '400');
      dref.afterClosed().subscribe(result => {
        let vendorobj = {
          vendorId: this.vendorid,
          updatedVendorSection: 3,
          address: addressList
        };
        if (result) {
          this.vendorservice.updateVendorContactInfo(vendorobj);
          this.vendorservice.updateVendorContactInfo$.subscribe(
            data => {
              //this.toastr.success('Successfully deleted Vendor address ', 'Success');
              this.iseditvendoraddressdetais = false;
              this.isvendoraddressdetails = true;
              this.isaddvendoraddress = false;
            //  this.updateContactNameDetails = data;
            //  this.loadVendorData(this.vendorid);
              this.messageAddressEvent.emit({ 'isSuccess': true });
            },
            error => {
              // this.toastr.error('At least one method of contact should be present.', 'Major Error', {
              //   timeOut: 3000,
              // });

            },
            () => {
              
            });
        } else {
        //  this.loadVendorData(this.vendorid);
          this.messageAddressEvent.emit({ 'isSuccess': true });
          this.isaddvendoraddress = false;
          this.iseditvendoraddressdetais = true;
          this.isvendoraddressdetails = false;
        }
      });
    }
  }
  onBlurAddAddress(value, e) {

    if (e == 'streetAddress' || e == 'city' || e == 'state' || e == 'zipcode') {
      this.checkAddressvalidations(e);
    }
  }

  // add additional address Validations
  checkAddressvalidations = function (e) {


    if (this.checkAddAddressNullorEmpty() == true) {
      if (e == 'streetAddress' || e == 'city' || e == 'state' || e == 'zipcode') {
        this.checkAddaddressfiledsnullorempty();
        this.isAddAddressFormValid = true;
      }
    } else {
      this.isAddAddressFormValid = false;
      this.vendorProfileAddAddressForm.get('streetAddress').setErrors(null);
      this.vendorProfileAddAddressForm.get('state').setErrors(null);
      this.vendorProfileAddAddressForm.get('city').setErrors(null);
      this.vendorProfileAddAddressForm.get('zipcode').setErrors(null);
    }
  };
  checkAddAddressNullorEmpty = function () {
    if ((this.vendorProfileAddAddressForm.get('city').value == '' || this.vendorProfileAddAddressForm.get('city').value == null || this.vendorProfileAddAddressForm.get('city').value == undefined) && (this.vendorProfileAddAddressForm.get('streetAddress').value == '' || this.vendorProfileAddAddressForm.get('streetAddress').value == null)
      && (this.vendorProfileAddAddressForm.get('zipcode').value == '' || this.vendorProfileAddAddressForm.get('zipcode').value == null) &&
      (this.vendorProfileAddAddressForm.get('state').value == '' || this.vendorProfileAddAddressForm.get('state').value == null) &&
      (this.vendorProfileAddAddressForm.get('streetAddress').value == '' || this.vendorProfileAddAddressForm.get('streetAddress').value == null)) {
      return false;
    } else {
      return true;
    }
  }

  checkAddaddressfiledsnullorempty = function () {
    if (this.vendorProfileAddAddressForm.get('streetAddress').value !== '' && this.vendorProfileAddAddressForm.get('streetAddress').value != null && this.vendorProfileAddAddressForm.get('streetAddress').value !== undefined) {
      this.vendorProfileAddAddressForm.get('streetAddress').setErrors(null);
      this.vendorProfileAddAddressForm.get('streetAddress').markAsUntouched();
    } else {
      this.vendorProfileAddAddressForm.get('streetAddress').setErrors({ 'valid': false });
      this.vendorProfileAddAddressForm.get('streetAddress').markAsUntouched();
    }

    if (this.vendorProfileAddAddressForm.get('city').value !== '' && this.vendorProfileAddAddressForm.get('city').value != null && this.vendorProfileAddAddressForm.get('city').value != undefined) {
      this.vendorProfileAddAddressForm.get('city').setErrors(null);
      this.vendorProfileAddAddressForm.get('city').markAsUntouched();
    } else {
      this.vendorProfileAddAddressForm.get('city').setErrors({ 'valid': false });
      this.vendorProfileAddAddressForm.get('city').markAsUntouched();
    }

    if (this.vendorProfileAddAddressForm.get('zipcode').value != '' && this.vendorProfileAddAddressForm.get('zipcode').value != null && this.vendorProfileAddAddressForm.get('zipcode').value != undefined) {
      if (this.vendorProfileAddAddressForm.get('zipcode').status == 'VALID') {
        this.vendorProfileAddAddressForm.get('zipcode').setErrors(null);
        this.vendorProfileAddAddressForm.get('zipcode').markAsUntouched();
      } else {
        this.vendorProfileAddAddressForm.get('zipcode').setErrors({ 'valid': false });
      }
    } else {
      this.vendorProfileAddAddressForm.get('zipcode').setErrors({ 'valid': false });
      this.vendorProfileAddAddressForm.get('zipcode').markAsUntouched();
    }

    if (this.vendorProfileAddAddressForm.get('state').value != '' && this.vendorProfileAddAddressForm.get('state').value != null && this.vendorProfileAddAddressForm.get('state').value != undefined) {
      this.vendorProfileAddAddressForm.get('state').setErrors(null);
      this.vendorProfileAddAddressForm.get('state').markAsUntouched();
    } else {
      this.vendorProfileAddAddressForm.get('state').setErrors({ 'valid': false });
      this.vendorProfileAddAddressForm.get('state').markAsUntouched();
    }
  }
}
