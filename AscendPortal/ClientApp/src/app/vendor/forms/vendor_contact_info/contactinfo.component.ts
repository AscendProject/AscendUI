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
  selector: 'app-contactinfo',
  templateUrl: './contactinfo.component.html',
  styleUrls: ['./contactinfo.component.scss']
})
export class ContactinfoComponent implements OnInit {
  vendorid: any;
  contactdata: any;
  public vendorProfileEmailForm: FormGroup;
  public vendorProfileAddEmailForm: FormGroup;
  isvendoremaildetais = true;
  isaddvendoremail = false;
  isaddaddtionalemailenable = true;
  iseditvendoremaildetais = false;
  pemail: any;
  semail: any;

  public vendorProfilePhoneForm: FormGroup;
  public vendorProfileAddPhoneForm: FormGroup;
  phoneViewData: any = [];
  pphone: any;
  isAddVendorPhone = false;
  iseditvendorphonedetais = false;
  isvendorphonedetails = true;
  phonetypes = ['MOBILE', 'WORK'];
  vendorPhonePrimary: IVendorPhone;
  primaryNumber: any;
  addedNumberType: string = 'Secondary';
  isAddNumberprimary = false;
  max: any = 10;
  modifiedNumber: string;
  isPrimarydefault = false;
  @ViewChild(ContactpageAuditHistoryComponent) historyComponent: ContactpageAuditHistoryComponent;
  isPhonePreferred = true;
  preferredRadio: any;
  preferredPhoneRadio: any;
  preferredEmailRadio: any;
  isPhoneAddFormButton = false;
  isPhoneButtonDisable = false;


  @Input() set contactData(newData) {
    console.log(newData);
    this.contactdata = newData;
    this.editLoadPageContact(this.contactdata);
  }
  @Output() messageAddressEvent = new EventEmitter<Object>();

  constructor(public router: Router,
    public route: ActivatedRoute,
    private configService: ConfigService,
    public vendorservice: VendorSandbox,
    public $fb: FormBuilder,
    private dialogService: DialogsService) {
    this.vendorid = this.route.snapshot.params['id'];

  }

  ngOnInit() {

  }
  editLoadPageContact(data) {
    this.vendorProfileEmailForm = this.$fb.group({
      primaryemail: [],
      type: [],
      pid: [],
      pIsDeleted: [],
      secondaryemail: [],
      stype: [],
      sid: [],
      sIsDeleted: []
    });
    this.patchEmailForm();


    this.vendorProfileAddEmailForm = this.$fb.group({
      primaryemail: [,]
    });
    this.vendorProfilePhoneForm = this.$fb.group({
      phoneInfo: this.$fb.array([
      ])
    });
    this.vendorProfileAddPhoneForm = this.$fb.group({
      phoneInfo: this.$fb.array([
        this.initPhone(),
      ])
    });
    this.patchForm();
    if (this.contactdata) {
      this.preferredPhoneRadio = this.contactdata.prefferedContactMethod;
      this.preferredEmailRadio = this.contactdata.prefferedContactMethod;
      if (this.contactdata.prefferedContactMethod === 'Email') {
        this.isPhonePreferred = false;
      }

    }
  }
  initPhone() {
    return this.$fb.group({
      phoneRadio: [''],
      phoneType: ['',],
      mySwitch: [],
      phoneNumber: [],
      delete: [],
      phoneExtension: [],
    });
  }

  patchForm() {
    this.pphone = '';
    if (this.contactdata && this.contactdata.vendorPhone) {
      let control = <FormArray>this.vendorProfilePhoneForm.controls.phoneInfo;
      this.phoneViewData = this.contactdata.vendorPhone.filter(x => x.isDeleted === false);
      this.phoneViewData.sort(this.compare);
      //this.contactdata.vendorPhone = this.contactdata.vendorPhone.filter(
      //  y => y.isDeleted === false);
      ////this.vendorPhoneDeleted.vendorPhone = this.contactdata.vendorPhone.filter(
      ////  y => y.isDeleted === true);
      this.phoneViewData.forEach(x => {
        control.push(this.$fb.group({ phoneNumberId: x.phoneId, phoneNumber: x.phone, phoneExtension: x.phoneExtension, phoneRadio: x.numberType, phoneType: x.phoneType, mySwitch: x.allowTexts, delete: x.isDeleted, phoneId: x.phoneId }))
      })

      this.phoneViewData.forEach(phone => {
        if (phone.numberType === "Primary") {
          this.pphone = phone.phone;
        }
      })
    }


  }
  compare(a, b) {
    if (a.numberType > b.numberType) {
      return 1;

    }
  }

  canceladdphoneupdate() {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.iseditvendorphonedetais = false
        this.isAddVendorPhone = false;
        this.isvendorphonedetails = true;
      } else { }
    });
  }

  editvendorphonedetails() {
    this.editLoadPageContact(this.contactdata);
    this.iseditvendorphonedetais = true;
    this.isvendorphonedetails = false;
    this.isAddVendorPhone = false;
  }
  changePreferredMethod(preferredVal, event) {
    let dref = this.dialogService.showDialog('Are you sure you want to change preferred method of contact?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        let vendorData = {
          vendorId: this.vendorid,
          name: null,
          address: null,
          servicetype: null,
          company: null,
          email: null,
          phone: null,
          communicationScore: null,
          prefferedContactMethod: preferredVal
        };
        this.vendorservice.updateVendorContactInfo(vendorData);
        this.vendorservice.updateVendorContactInfo$.subscribe(
          data => {
            this.messageAddressEvent.emit({ 'isSuccess': true });
            this.contactdata = data;
          },
          error => {

          },
          () => {
            this.isPhonePreferred = preferredVal === 'Email' ? false : true;
            if (preferredVal === 'Phone') {
              this.preferredPhoneRadio = 'Phone';
              this.preferredEmailRadio = 'Phone'
            } else {
              this.preferredPhoneRadio = 'Email';
              this.preferredEmailRadio = 'Email'
            }
          });
      } else {
        this.isPhonePreferred = preferredVal === 'Email' ? true : false;
        if (preferredVal === 'Email') {
          this.preferredPhoneRadio = 'Phone';
          this.preferredEmailRadio = 'Phone'
        } else {
          this.preferredPhoneRadio = 'Email';
          this.preferredEmailRadio = 'Email'
        }

      }
    });
  }
  checkEmailHasData() {
    let found = false;
    if (this.contactdata && this.contactdata.vendorEmail) {
      for (let i = 0, lent = this.contactdata.vendorEmail.length; i < lent; i++) {
        if (this.contactdata.vendorEmail[i].IsDeleted === false) {
          found = true;
          break;
        }
      }
    }
    return found;
  }
  savevendorphonedetails() {
    let formArr = this.vendorProfilePhoneForm.get('phoneInfo') as FormArray;
    let phoneList = new Array();
    let numType: string;
    let finalphone: string;
    let phonevalue: string
    let phoneNumberId: string;
    let IsValueempty = false;
    let item = false;
    let test = false;
    let InitialphoneList = this.contactdata.vendorPhone;
    let dref: any;
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

      // numType = formArr.at(i).get('phoneRadio').value;
      finalphone = formArr.at(i).get('phoneNumber').value;
      // if (finalphone !== null && finalphone !== '') {
      this.vendorPhonePrimary = <IVendorPhone>{
        Phone: finalphone.replace(/[^0-9a-zA-Z]/g, ''),
        numberType: numType,
        phoneType: formArr.at(i).get('phoneType').value,
        allowTexts: formArr.at(i).get('mySwitch').value,
        IsDeleted: formArr.at(i).get('delete').value,
        phoneExtension: formArr.at(i).get('phoneExtension').value,
      };
      phoneList.push(this.vendorPhonePrimary);
      //test = true;

    }
    for (let i = 0; i < formArr.length; i++) {
      phonevalue = formArr.at(i).get('phoneNumber').value;
      if (phonevalue == '') {
        IsValueempty = true;
        phoneNumberId = formArr.at(i).get('phoneNumberId').value
        break;
      }
    }


    let count = InitialphoneList.filter(InitialphoneList => InitialphoneList.isDeleted == false).length;
    let IsPrimary = InitialphoneList.some(a => a.numberType.includes("Primary") && a.isDeleted == false);
    if (count == 1) {
      if (IsPrimary && phonevalue === '') {
        dref = this.dialogService.showDialog('Please note, this is the last phone on record. Are you sure you want to delete?', 'Yes', '500');
        item = true;
      }
    }
    else if (phoneNumberId == InitialphoneList.filter(InitialphoneList => InitialphoneList.isDeleted == false && InitialphoneList.numberType === "Primary")[0].phoneId) {

      dref = this.dialogService.showDialog('Please select another Primary phone before deleting', 'Ok', '400');
      item = true;
      test = true;

    }

    else if (IsValueempty) {
      dref = this.dialogService.showDialog('Are you sure you want to delete?', 'Yes', '400');
      item = true;
    }
    else {
      dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
      item = true;
    }
    if (phonevalue == '') {
      for (let i = 0; i < InitialphoneList.length; i++) {
        if (InitialphoneList[i].phoneId == phoneNumberId) {
          InitialphoneList[i].IsDeleted = true;
          phoneList = InitialphoneList;
        }
      }
    }

    if (!test) {
      let vendorobj = {
        vendorId: this.vendorid,
        vendorPhone: phoneList,
        updatedVendorSection: 4
      }
      if (item == false) {
        dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
      }

      dref.afterClosed().subscribe(result => {

        if (result) {
          this.vendorservice.updateVendorContactInfo(vendorobj);
          this.vendorservice.updateVendorContactInfo$.subscribe(
            data => {
              //this.toastr.success('Updated Vendor Phone Details Success', 'Success');
              this.iseditvendorphonedetais = false;
              // this.loadVendorData(this.vendorid);
              this.messageAddressEvent.emit({ 'isSuccess': true });
              this.isvendorphonedetails = true;
              this.isAddVendorPhone = false;
              // this.updateContactNameDetails = data;
              this.contactdata.vendorPhone = data.phone;


            },
            error => {
              this.iseditvendorphonedetais = false;
              this.isvendorphonedetails = true;
              // this.toastr.error('At least one method of contact should be present.', 'Major Error', {
              //   timeOut: 3000,
              // });

            },
            () => {

            });
        } else {

        }
      });
    }
    else {
      this.messageAddressEvent.emit({ 'isSuccess': true });
      //this.patchForm();
      this.iseditvendorphonedetais = true;
      this.isvendorphonedetails = false;
      this.isAddVendorPhone = false;
    }
  }

  savevendoraddphonedetails() {
    //if (this.isPrimarydefault) {
    //  this.addedNumberType = "Primary";
    //  this.isPrimarydefault = false;
    //}
    let formArr = this.vendorProfileAddPhoneForm.get('phoneInfo') as FormArray;
    let phoneList = new Array();
    let finalphone: string;
    if (this.contactdata.vendorPhone.length === 0) {
      this.addedNumberType = 'Primary';
    }
    let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      for (let i = 0; i < formArr.length; i++) {
        finalphone = formArr.at(i).get('phoneNumber').value;
        if (finalphone !== null && finalphone !== '') {
          this.vendorPhonePrimary = <IVendorPhone>{
            Phone: finalphone.replace(/[^0-9a-zA-Z]/g, ''),
            numberType: this.addedNumberType,
            phoneType: formArr.at(i).get('phoneType').value,
            allowTexts: formArr.at(i).get('mySwitch').value,
            phoneExtension: formArr.at(i).get('phoneExtension').value

          };
          phoneList.push(this.vendorPhonePrimary);
        }
      }
      if (this.contactdata.vendorPhone.filter(x => x.numberType === "Primary").length > 0 && this.addedNumberType === 'Primary') {
        this.contactdata.vendorPhone.filter(x => {
          if (x.numberType === "Primary") {
            x.numberType = "Secondary";
          }
        });
      }
      this.contactdata.vendorPhone.forEach(x => {
        phoneList.push(x)
      })
      let vendorobj = {
        vendorId: this.vendorid,
        vendorPhone: phoneList,
        updatedVendorSection: 4
      }
      if (result) {
        this.vendorservice.updateVendorContactInfo(vendorobj);
        this.vendorservice.updateVendorContactInfo$.subscribe(
          data => {
            //this.toastr.success('Updated Vendor Phone Details Success', 'Success');
            this.messageAddressEvent.emit({ 'isSuccess': true });
            this.iseditvendorphonedetais = false;
            this.isvendorphonedetails = true;
            this.isAddVendorPhone = false;
            // this.updateContactNameDetails = data;
            this.contactdata.vendorPhone = data.phone;
            this.isAddNumberprimary = false;
            this.addedNumberType = 'Secondary';
            this.vendorProfileAddPhoneForm = this.$fb.group({
              phoneInfo: this.$fb.array([
                this.initPhone(),
              ])
            });
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
  addPhone() {
    this.isvendorphonedetails = false;
    this.isAddVendorPhone = true;
    this.iseditvendorphonedetais = false;
  }


  handleChange(evt, i) {
    let control = this.vendorProfilePhoneForm.get('phoneInfo') as FormArray;
    for (var j = 0, lent = control.length; j < lent; j++) {
      control.at(j).get('phoneRadio').setValue('Secondary');
    }

    this.primaryNumber = i;
    let formArr = this.vendorProfilePhoneForm.get('phoneInfo') as FormArray;
    if (formArr.at(i).get('phoneNumber').value < 10 || formArr.at(i).get('phoneType').value === '') {
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
      formArr.at(i).get('phoneType').setErrors({ 'valid': false });
    }

    formArr.controls[i].get('phoneRadio').setValue('Primary');

    console.log(this.vendorProfilePhoneForm);
  }
  handlePhoneAddChange(evt, i, ) {
    let formArr = this.vendorProfileAddPhoneForm.get('phoneInfo') as FormArray;
    if (evt.value == 'Primary') {
      this.addedNumberType = "Primary";
      this.isAddNumberprimary = true;
      if (formArr.at(i).get('phoneNumber').value < 10) {
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
      }
      if (formArr.at(i).get('phoneType').value === '') {
        formArr.at(i).get('phoneType').setErrors({ 'valid': false });
      }
    }
  }
  primaryNumberFormatChange(number: string, i, formGroupName) {
    let formArr;
    if (formGroupName == 'vendorProfilePhoneForm') {
      formArr = this.vendorProfilePhoneForm.get('phoneInfo') as FormArray;
    } else {
      formArr = this.vendorProfileAddPhoneForm.get('phoneInfo') as FormArray;
    }
    if (number.length < 10 && number.length != 0) {
      if (formArr.at(i).get('phoneType').untouched && (formArr.at(i).get('phoneType').value === '' || formArr.at(i).get('phoneType').value === undefined)) {
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
    }

    if (number.length === 10) {

    }

    if (number.length === 0) {
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

  primaryNumFoucusIn(number: String, i, formGroupName) {

    let formArr;
    if (formGroupName == 'vendorProfilePhoneForm') {
      formArr = this.vendorProfilePhoneForm.get('phoneInfo') as FormArray;
    } else {
      formArr = this.vendorProfileAddPhoneForm.get('phoneInfo') as FormArray;
      this.isPhoneAddFormButton = true;
    }
    if (formArr.at(i).get('phoneNumber').value) {
      let len = formArr.at(i).get('phoneNumber').value.length;
      if (len < 10 && len != 0) {
        formArr.at(i).get('phoneNumber').setValidators(Validators.maxLength(10))
        this.modifiedNumber = number.replace(/[^0-9a-zA-Z]/g, '');
        formArr.at(i).get('phoneNumber').setValue(this.modifiedNumber);
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        this.isPhoneAddFormButton = false;
        this.isPhoneButtonDisable = true;
      } else {
        formArr.at(i).get('phoneNumber').setValidators(Validators.maxLength(10))
        this.modifiedNumber = number.replace(/[^0-9a-zA-Z]/g, '');
        formArr.at(i).get('phoneNumber').setValue(this.modifiedNumber);
        this.isPhoneButtonDisable = false;
      }
    }

  }
  out(number: string, i, formGroupName) {
    let formArr;
    if (formGroupName == 'vendorProfilePhoneForm') {
      formArr = this.vendorProfilePhoneForm.get('phoneInfo') as FormArray;
    } else {
      formArr = this.vendorProfileAddPhoneForm.get('phoneInfo') as FormArray;
      this.isPhoneAddFormButton = true;
    }
    debugger
    let trimmedNum = number.toString().trim()
    if (trimmedNum.length == 10 && /^\d+$/.test(trimmedNum)) {
      formArr.at(i).get('phoneNumber').setValidators(Validators.maxLength(14))
      this.modifiedNumber = '(' + trimmedNum.substr(0, 3) + ') ' + trimmedNum.substr(3, 3) + '-' + trimmedNum.substr(6, 4);
      formArr.at(i).get('phoneNumber').setValue(this.modifiedNumber);
      this.isPhoneButtonDisable = false;
    } else if (trimmedNum.length < 10 && trimmedNum.length != 0) {
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
      this.isPhoneButtonDisable = true;
    } else if (/^\d+$/.test(trimmedNum) === false && trimmedNum.length === 10) {
      formArr.at(i).get('phoneNumber').setErrors(null);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
      this.isPhoneButtonDisable = false;
    } else if (trimmedNum.length === 0 && formArr.at(i).get('phoneRadio').pristine === false) {
      formArr.at(i).get('phoneNumber').setErrors(null);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
      this.isPhoneAddFormButton = false;
      this.isPhoneButtonDisable = true;
    } else if (trimmedNum === '') {
      formArr.at(i).get('phoneNumber').setErrors(null);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
      this.isPhoneAddFormButton = false;
      this.isPhoneButtonDisable = true;
    } else {
      formArr.at(i).get('phoneNumber').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': true });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
      this.isPhoneAddFormButton = false;
      this.isPhoneButtonDisable = false;
    }

  }

  onTypeChange(value, i, formGroupName) {
    let formArr;
    if (formGroupName == 'vendorProfilePhoneForm') {
      formArr = this.vendorProfilePhoneForm.get('phoneInfo') as FormArray;
    } else {
      formArr = this.vendorProfileAddPhoneForm.get('phoneInfo') as FormArray;
      this.isPhoneAddFormButton = true;
    }
    let len = formArr.at(i).get('phoneNumber').value;

    if (value === 'MOBILE') {
      if (len === null || (len.length < 10 && len.length != 0) || len === '') {
        formArr.at(i).get('phoneNumber').setErrors(null);
        formArr.at(i).get('phoneNumber').setValidators(Validators.required);
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        this.isPhoneAddFormButton = false;
        this.isPhoneButtonDisable = true;
      }
      formArr.at(i).get('mySwitch').setValue(true);
    } else if (value === 'WORK') {
      if (len === null || (len.length < 10 && len.length != 0) || len === '') {
        formArr.at(i).get('phoneNumber').setErrors(null);
        formArr.at(i).get('phoneNumber').setValidators(Validators.required);
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        this.isPhoneAddFormButton = false;
        this.isPhoneButtonDisable = true;
      }
      formArr.at(i).get('mySwitch').setValue(false);
    } else if (len === null || len.length === 0) {

      formArr.at(i).get('phoneNumber').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': true });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
      formArr.at(i).get('mySwitch').setValue(false);
      this.isPhoneAddFormButton = false;
      this.isPhoneButtonDisable = true;

    } else if ((len != null || (len.length < 10 && len.length != 0))) {

      formArr.at(i).get('phoneNumber').setValidators(Validators.required);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
      formArr.at(i).get('phoneType').setValidators(Validators.required);
      formArr.at(i).get('phoneType').setErrors({ 'valid': false });
      formArr.at(i).get('phoneType').updateValueAndValidity();
      this.isPhoneAddFormButton = true;
      this.isPhoneButtonDisable = false;
    } else if ((len === null || len.length === 0) && value === '') {
      formArr.at(i).get('phoneNumber').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneNumber').setErrors({ 'valid': true });
      formArr.at(i).get('phoneNumber').updateValueAndValidity();
      formArr.at(i).get('phoneType').setValidators(Validators.nullValidator);
      formArr.at(i).get('phoneType').setErrors({ 'valid': true });

      formArr.at(i).get('phoneType').updateValueAndValidity();
      formArr.at(i).get('mySwitch').setValue(false);
      this.isPhoneAddFormButton = false;
      this.isPhoneButtonDisable = true;

    }

  }

  changeSwitch(e, i, formGroupName) {
    let formArr;
    if (formGroupName == 'vendorProfilePhoneForm') {
      formArr = this.vendorProfilePhoneForm.get('phoneInfo') as FormArray;
    } else {
      formArr = this.vendorProfileAddPhoneForm.get('phoneInfo') as FormArray;
      this.isPhoneAddFormButton = true;
    }
    if (e === true) {
      if (formArr.at(i).get('phoneNumber').value < 10 || formArr.at(i).get('phoneType').value === '') {
        formArr.at(i).get('phoneNumber').setValidators(Validators.required);
        formArr.at(i).get('phoneNumber').setErrors({ 'valid': false });
        formArr.at(i).get('phoneNumber').updateValueAndValidity();
        formArr.at(i).get('phoneType').setValidators(Validators.required);
        formArr.at(i).get('phoneType').setErrors({ 'valid': false });
        formArr.at(i).get('phoneType').updateValueAndValidity();
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
  cancelphoneupdate() {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.iseditvendorphonedetais = false
        this.isvendorphonedetails = true;
      } else { }
    });
  }
  cancelAddPhone() {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.iseditvendorphonedetais = false;
        this.isAddVendorPhone = false;
        this.isvendorphonedetails = true;
        this.vendorProfileAddPhoneForm = this.$fb.group({
          phoneInfo: this.$fb.array([
            this.initPhone(),
          ])
        });
      } else { }
    });
  }
  deletevendorphonedetails(phoneId: string) {
    let dref: any;
    let numType: string;
    let InitialphoneList = this.contactdata.vendorPhone;
    let count = InitialphoneList.filter(InitialphoneList => InitialphoneList.isDeleted == false).length;
    let IsPrimary = InitialphoneList.some(a => a.numberType.includes("Primary") && a.isDeleted == false);
    let test = false;
    if (count == 1) {
      if (IsPrimary) {
        dref = this.dialogService.showDialog('Please note, this is the last phone on record. Are you sure you want to delete?', 'Yes', '500');
        dref.afterClosed().subscribe(result => {
          for (let index = 0; index < InitialphoneList.length; index++) {
            if (InitialphoneList[index].phoneId === phoneId) {
              InitialphoneList[index].isDeleted = true;
              break;
            }
          }
          ; console.log(InitialphoneList);
          let vendorobj = {
            vendorId: this.vendorid,
            vendorPhone: InitialphoneList,
            updatedVendorSection: 4
          }
          if (result) {
            this.vendorservice.updateVendorContactInfo(vendorobj)
            this.vendorservice.updateVendorContactInfo$.subscribe(
              data => {
                //this.toastr.success('Successfully deleted Vendor Phone ', 'Success');
                this.iseditvendorphonedetais = false;
                this.isvendorphonedetails = true;
                this.isAddVendorPhone = false;
                // this.updateContactNameDetails = data;
                this.contactdata.vendorPhone = data.phone;
                this.phoneViewData = this.contactdata.vendorPhone.filter(x => x.isDeleted === false);
                //this.isAddNumberprimary = false;
                //this.addedNumberType = 'Secondary';
                //this.vendorProfileAddPhoneForm = this.$fb.group({
                //  phoneInfo: this.$fb.array([
                //    this.initPhone(),
                //  ])
                //});
              },
              error => {
                // this.toastr.error('At least one method of contact should be present.', 'Major Error', {
                //   timeOut: 3000,
                // });

              },
              () => {

              });
          } else {
            this.messageAddressEvent.emit({ 'isSuccess': true });
            this.isAddVendorPhone = false;
            this.iseditvendorphonedetais = false;
            this.isvendorphonedetails = true;
          }
        });
      }

      else {
        dref = this.dialogService.showDialog('Are you sure you want to delete?', 'Yes', '400');
        dref.afterClosed().subscribe(result => {
          for (let index = 0; index < InitialphoneList.length; index++) {
            if (InitialphoneList[index].phoneId === phoneId) {
              InitialphoneList[index].isDeleted = true;
              break;
            }
          }
          let vendorobj = {
            vendorId: this.vendorid,
            vendorPhone: InitialphoneList,
            updatedVendorSection: 4
          }
          if (result) {
            this.vendorservice.updateVendorContactInfo(vendorobj);
            this.vendorservice.updateVendorContactInfo$.subscribe(
              data => {
                //this.toastr.success('Successfully deleted Vendor Phone ', 'Success');
                this.iseditvendorphonedetais = false;
                this.isvendorphonedetails = true;
                this.isAddVendorPhone = false;
                //this.updateContactNameDetails = data;
                this.contactdata.vendorPhone = data.phone;
                this.phoneViewData = this.contactdata.vendorPhone.filter(x => x.isDeleted === false);
                //this.isAddNumberprimary = false;
                //this.addedNumberType = 'Secondary';
                //this.vendorProfileAddPhoneForm = this.$fb.group({
                //  phoneInfo: this.$fb.array([
                //    this.initPhone(),
                //  ])
                //});
              },
              error => {
                // this.toastr.error('At least one method of contact should be present.', 'Major Error', {
                //   timeOut: 3000,
                // });

              },
              () => {

              });
          } else {
            this.messageAddressEvent.emit({ 'isSuccess': true });
            this.isAddVendorPhone = false;
            this.iseditvendorphonedetais = false;
            this.isvendorphonedetails = true;
          }
        });
      }
    }
    else if (phoneId == InitialphoneList.filter(InitialphoneList => InitialphoneList.isDeleted == false && InitialphoneList.numberType === "Primary")[0].phoneId) {
      dref = this.dialogService.showDialog('Please select another Primary Phone before deleting', 'Ok', '400');
      test = true;
      // this.loadVendorData(this.vendorid);
      this.isAddVendorPhone = false;
      this.iseditvendorphonedetais = true;
      this.isvendorphonedetails = false;
    }
    else {
      dref = this.dialogService.showDialog('Are you sure you want to delete?', 'Yes', '400');
      for (let index = 0; index < InitialphoneList.length; index++) {
        if (InitialphoneList[index].phoneId === phoneId) {
          InitialphoneList[index].isDeleted = true;
          break;
        }
      }
      dref.afterClosed().subscribe(result => {
        let vendorobj = {
          vendorId: this.vendorid,
          vendorPhone: InitialphoneList,
          updatedVendorSection: 4
        }
        if (result) {
          this.vendorservice.updateVendorContactInfo(vendorobj);
          this.vendorservice.updateVendorContactInfo$.subscribe(
            data => {
              //this.toastr.success('Successfully deleted Vendor Phone ', 'Success');
              this.iseditvendorphonedetais = false;
              this.isvendorphonedetails = true;
              this.isAddVendorPhone = false;
              // this.updateContactNameDetails = data;
              this.contactdata.vendorPhone = data.phone;
              this.phoneViewData = this.contactdata.vendorPhone.filter(x => x.isDeleted === false);
              //this.isAddNumberprimary = false;
              //this.addedNumberType = 'Secondary';
              //this.vendorProfileAddPhoneForm = this.$fb.group({
              //  phoneInfo: this.$fb.array([
              //    this.initPhone(),
              //  ])
              //});
            },
            error => {
              // this.toastr.error('At least one method of contact should be present.', 'Major Error', {
              //   timeOut: 3000,
              // });

            },
            () => {

            });
        } else {
          this.messageAddressEvent.emit({ 'isSuccess': true });
          this.isAddVendorPhone = false;
          this.iseditvendorphonedetais = false;
          this.isvendorphonedetails = true;
        }
      });
    }
  }

  patchEmailForm() {
    this.pemail = '';
    this.semail = '';
    let primaryId = '';
    let secondaryId = '';
    let pisdeleted = false;
    let sisdeleted = false;

    console.log(this.contactdata.vendorEmail);
    for (let emailObj of this.contactdata.vendorEmail) {
      if (emailObj.type == 'Primary' && emailObj.IsDeleted != true && (emailObj.email != null || emailObj.email != '')) {
        this.pemail = emailObj.email;
        primaryId = emailObj.emailId;
        pisdeleted = emailObj.IsDeleted;
      } //else if (emailObj.type == 'Secondary' && emailObj.email != null && emailObj.IsDeleted != true) {
      else if (emailObj.type == 'Secondary' && emailObj.email != null && emailObj.IsDeleted != true) {
        this.semail = emailObj.email;
        secondaryId = emailObj.emailId;
        sisdeleted = emailObj.IsDeleted;
      }
    }

    this.vendorProfileEmailForm.patchValue({
      primaryemail: this.pemail,
      type: true,
      pid: primaryId,
      pIsDeleted: pisdeleted,
      secondaryemail: this.semail,
      stype: false,
      sid: secondaryId,
      sIsDeleted: sisdeleted
    })
    //this.createItem();
  }
  createItem() {
    // console.log(this.semail);
    let control = <FormArray>this.vendorProfileEmailForm.controls.items;
    this.semail.forEach(x => {
      control.push(this.$fb.group({ secondaryemail: x.email, id: x.emailId, stype: false }))
    });
    console.log(control)
    // console.log(control);
    //return this.$fb.group({
    //  secondaryemail: semail
    //});
  }
  // primary email change event
  typeChangeEvent(event, typeval) {
    console.log(event);
    // let control = <FormArray>this.vendorProfileEmailForm.controls.items;
    if (typeval === 'primary') {
      this.vendorProfileEmailForm.get('type').setValue(true);
      this.vendorProfileEmailForm.get('stype').setValue(false);
      this.savevendoremaildetails('toggle');
    } else {
      this.vendorProfileEmailForm.get('type').setValue(false);
      this.vendorProfileEmailForm.get('stype').setValue(true);
      this.savevendoremaildetails('toggle');
    }
  }
  addVendorEmail() {
    let AdditionalemailList: Array<Object> = []
    for (let emailObj of this.contactdata.vendorEmail) {
      if (emailObj.IsDeleted != true) {
        AdditionalemailList.push(emailObj);
      }
    }
    if (AdditionalemailList.length >= 2) {
      let dref = this.dialogService.showDialog('Only one Primary and One Secondary email can be added', 'Ok', '400');
      return false;
    }

    this.vendorProfileAddEmailForm.reset();
    this.vendorProfileEmailForm.reset();
    this.isaddvendoremail = true;
    this.iseditvendoremaildetais = false;
    this.isvendoremaildetais = false;
  }
  existFunc() {
    return this.contactdata.vendorEmail.some(a => a.type.includes("Primary") && a.IsDeleted != true);
  }

  onBlurAddEmailMethod(value, e) {

    if (value == '') {
      this.isaddaddtionalemailenable = true;
    }
    else {
      this.isaddaddtionalemailenable = false;
    }
    this.vendorProfileAddEmailForm.get(e).setValue(value.toString().trim());

  }
  saveEmailDetails() {
    let form = this.vendorProfileAddEmailForm.value;
    let type = 'Secondary';
    let res = this.existFunc();
    if (!res) {
      type = 'Primary';
    }
    //Email Object
    let vendorEmailPrimary = {
      email: form.primaryemail,
      type: type
    };
    let emailList: Array<Object> = []
    //Email Array
    if (type === 'Primary') {
      emailList.push(vendorEmailPrimary);
    }

    for (let emailObj of this.contactdata.vendorEmail) {
      emailList.push(emailObj);
    }
    if (type === 'Secondary') {
      emailList.push(vendorEmailPrimary);
    }

    let vendorobj = {
      vendorId: this.vendorid,
      vendorEmail: emailList,
      updatedVendorSection: 2
    }
    let totalEmails: Array<object> = [];
    for (let emailObj of this.contactdata.vendorEmail) {
      if (emailObj.IsDeleted != true)
        totalEmails.push()
    }

    if (totalEmails.length > 2) {
      let dref = this.dialogService.showDialog('Only one Primary and One Secondary email can be added', 'OK', '400');
      return false;
    }

    let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.vendorservice.updateVendorContactInfo(vendorobj);
        this.vendorservice.updateVendorContactInfo$.subscribe(
          data => {
            // this.toastr.success('Email added successfully!', 'Success');
            this.isaddvendoremail = false;
            this.iseditvendoremaildetais = false;
            this.isvendoremaildetais = true;
            // this.updateContactNameDetails = data;
            this.contactdata.vendorEmail = data.email;
            this.vendorProfileAddEmailForm.reset();
            // this.loadVendorData(this.vendorid);
            this.messageAddressEvent.emit({ 'isSuccess': true });
          },
          error => {
            // this.toastr.error('Failed to add vendor email.', 'Major Error', {
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
  onBlurEmailMethod(value, e) {
    this.vendorProfileEmailForm.get(e).setValue(value.toString().trim());
  }

  savevendoremaildetails(isToggle) {

    let form = this.vendorProfileEmailForm.value;
    let isOnlyEamil = false;
    let dref: any;
    let initialEmailList = this.contactdata.vendorEmail;
    let emailList = new Array();

    let vendorEmailPrimary = {
      email: form.primaryemail,
      type: form.type ? 'Primary' : 'Secondary',
      emailId: form.pid
    };
    emailList.push(vendorEmailPrimary);

    if (initialEmailList.length > 1) {
      let vendorEmailSecondary = {
        email: form.secondaryemail,
        type: form.stype ? 'Primary' : 'Secondary',
        emailId: form.sid
      };
      emailList.push(vendorEmailSecondary);
    }
    //for (let eachEmail of form.items) {
    //  emailList.push({
    //    email: eachEmail.secondaryemail,
    //    type: 'Secondary',
    //    emailId: this.contactdata.vendorEmail[1].emailId
    //  });
    //}

    let vendorobj = {
      vendorId: this.vendorid,
      vendorEmail: emailList,
      updatedVendorSection: 2
    }
    let count = initialEmailList.filter(initialEmailList => initialEmailList.IsDeleted == false).length;
    let IsPrimary = emailList.some(a => a.type === 'Primary');

    if (form.primaryemail == "" || emailList[0].secondaryemail == '') {
      if (IsPrimary && emailList[0].email == '' && count == 1) {
        dref = this.dialogService.showDialog('Please note, this is the last email on record. Are you sure you want to delete?', 'Yes', '500');
      } else {
        if (IsPrimary && emailList[0].email == '') {
          dref = this.dialogService.showDialog('Please select another Primary E-mail before deleting', 'Ok', '400');
          this.isaddvendoremail = false;
          this.iseditvendoremaildetais = true;
          this.isvendoremaildetais = false;
          return false;
        } else {
          if (emailList[1].email == '') {
            dref = this.dialogService.showDialog('Are you sure you want to delete?', 'Yes', '400');
          }

        }
      }
    } else {
      dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
    }
    dref.afterClosed().subscribe(result => {
      if (result) {
        this.vendorservice.updateVendorContactInfo(vendorobj);
        this.vendorservice.updateVendorContactInfo$.subscribe(
          data => {
            //this.toastr.success('Updated Vendor email Details Success', 'Success');

            this.isaddvendoremail = false;
            this.iseditvendoremaildetais = false;
            this.isvendoremaildetais = false;
            // this.updateContactNameDetails = data;
            if (data.email !== null || data.email !== undefined || data.email !== '') {
              for (let item in data.email) {
                if (data.email[item].isDeleted == true) {
                  data.email.splice(item, 1);
                }
              }
            }
            // this.loadVendorData(this.vendorid);
            this.messageAddressEvent.emit({ 'isSuccess': true });
            this.contactdata.vendorEmail = data.email;
            if (isToggle === 'toggle') {
              this.isvendoremaildetais = false
              this.isaddvendoremail = false;
              this.iseditvendoremaildetais = true;
            } else {
              this.isvendoremaildetais = true
              this.isaddvendoremail = false;
              this.iseditvendoremaildetais = false;
            }

          },
          error => {
            this.iseditvendoremaildetais = false;
            this.isvendoremaildetais = true;
            // this.toastr.error('At least one method of contact should be present.', 'Major Error', {
            //   timeOut: 3000,
            // });
          },
          () => {

          });
      } else {

      }
    });
  }

  editvendoremaildetails() {
    this.iseditvendoremaildetais = true;
    //.vendorProfileEmailForm.reset();
    this.vendorProfileEmailForm.controls['primaryemail'].setValue('');
    //this.clearFormArray(<FormArray>this.vendorProfileEmailForm.controls['items']);
    // this.loadVendorData(this.vendorid);
    this.messageAddressEvent.emit({ 'isSuccess': true });
    this.iseditvendoremaildetais = true;
    this.isvendoremaildetais = false;
    this.isaddvendoremail = false;
  }

  cancelEmailDetails() {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.isaddvendoremail = false;
        this.iseditvendoremaildetais = false;
        this.isvendoremaildetais = true;
      } else {

      }
    });
    // (contactdata.vendorEmail | orderby: 'Primary')
    //if (confirm('Are you sure you want cancel?')) {
    //  this.isaddvendoremail = false;
    //  this.iseditvendoremaildetais = false;
    //  this.isvendoremaildetais = true;
    //} else {

    //}
  }
  DeleteEmail(Id) {
    this.iseditvendoremaildetais = true;
    let requiredtoshow: any;
    let mailId: any;
    let emailList = new Array();
    emailList = this.contactdata.vendorEmail;
    let dref: any;
    let count = emailList.filter(emailList => emailList.IsDeleted == false).length;
    let IsPrimary = emailList.some(a => a.type.includes("Primary"));
    let isPrimaryDeleted;
    if (count == 1) {
      if (IsPrimary) {
        dref = this.dialogService.showDialog('Please note, this is the last email on record. Are you sure you want to delete?', 'Yes', '500');
        isPrimaryDeleted = true;
      }
    }
    else if (Id == emailList.filter(emailList => emailList.IsDeleted == false && emailList.type == "Primary")[0].emailId) {
      dref = this.dialogService.showDialog('Please select another Primary E-mail before deleting', 'Ok', '400');
      requiredtoshow = false;
      this.isvendoremaildetais = false;
      return false;
    }
    else {
      dref = this.dialogService.showDialog('Are you sure you want to delete?', 'Yes', '400');

    }

    dref.afterClosed().subscribe(result => {
      if (result) {
        for (let index = 0; index < emailList.length; index++) {
          if (Id == emailList[index].emailId) {
            emailList[index].IsDeleted = true;
          }
        }
        let vendorobj = {
          vendorId: this.vendorid,
          vendorEmail: emailList,
          updatedVendorSection: 2
        }
        this.vendorservice.updateVendorContactInfo(vendorobj);
        this.vendorservice.updateVendorContactInfo$.subscribe(
          data => {
            //this.toastr.success('Deleted Vendor email  Success', 'Success');
            if (isPrimaryDeleted) {
              this.iseditvendoremaildetais = false;
            }
            else {
              this.iseditvendoremaildetais = true;
            }
            // this.loadVendorData(this.vendorid);
            this.messageAddressEvent.emit({ 'isSuccess': true });
            this.contactdata.vendorEmail = data.email;
            this.isvendoremaildetais = true
            this.isaddvendoremail = false;
            this.iseditvendoremaildetais = false;
          },
          error => {
            // this.toastr.error('At least one method of contact should be present.', 'Major Error', {
            //   timeOut: 3000,
            // });

          },
          () => {

          });
      } else {


        this.iseditvendoremaildetais = true;
        // this.loadVendorData(this.vendorid);
      }
    });

  }
}
