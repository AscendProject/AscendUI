import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInput } from '@angular/material';
import { DialogsService } from '../../../shared/services/dialogs.service';
import {IAvailability} from '../../../shared/models/add-availability-models';
import { ICapacity, IVendorCapacityModel } from '../../../shared/models/add-vendor-model';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {
  @ViewChild('fromInput', {
    read: MatInput
  }) fromInput: MatInput;
  public vendorAvailabilityForm: FormGroup;
  public vendorCapacityForm: FormGroup;
  public reasons: string[];
  public textStartDatePattern: DateTimeFormat;
  public textAvailabilityDatePattern: DateTimeFormat;
  isreasonselected: boolean = true;
  selectedValue: string;
  currentDate: any;
  chkUntilFurtherNotice: boolean = false;
  avaiDate: Date;
  updateDate: Date;
  vaildatePlaceholder: string = 'Availability Date*';
  isOk: boolean = false;
  isreadOnly: boolean = false;
  public submitted: boolean = false;
  isdisable: boolean = false;
  vendorid: string;
  contactdata: any;
  isAddAvailabilityClicked: Boolean = false;
  isShowAvailability: Boolean = true;
  isAddCapacityClicked: Boolean = false;
  isShowCapacity: Boolean = true;
  vendorCapacity: number;
  capacityErrorMessage: string = 'Enter valid capacity.';
  constructor(public $fb: FormBuilder,
    public router: Router,
    private dialogService: DialogsService, private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler, public appComp: AppComponent,
    public route: ActivatedRoute, public snackBar: MatSnackBar) {
    this.vendorid = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.availabilityForm();
    this.capacityForm();
    this.loadVendorData(this.vendorid);
  }
  showAvailabilityInfo() {
    this.isAddAvailabilityClicked = true;
    this.isShowAvailability = false;
    this.vendorAvailabilityForm.get('Reasons').markAsUntouched();
  }
  showCapacityInfo() {
    this.isAddCapacityClicked = true;
    this.isShowCapacity = false;
  }
  availabilityForm() {
    this.reasons = ['At Capacity', 'Out of Office', 'Emergency', 'Request To Remove from Panel'];
    this.vendorAvailabilityForm = this.$fb.group({
      Reasons: ['', Validators.required],
      startDate: ['', Validators.required],
      avaiDate: [new Date(''), Validators.required],
      chkUntilFurtherNotice: [false]
    });
  }
  capacityForm() {
    this.vendorCapacityForm = this.$fb.group({ capacity: ['', Validators.required] })
  }
  onReasonChange() {
    console.log(this.selectedValue);
    if (this.selectedValue != undefined && this.selectedValue != null) {
      this.isreasonselected = false;
    }
    else if (this.selectedValue === undefined || this.selectedValue === null || this.selectedValue == "") {
      this.isreasonselected = true;
    }
    if (this.selectedValue === "At Capacity") {
      this.currentDate = new Date();
    }
    else if (this.selectedValue != "At Capacity") {
      this.currentDate = '';
    }
    if (this.selectedValue === "Request To Remove from Panel") {
      this.vendorAvailabilityForm.get('chkUntilFurtherNotice').setValue('true');
      this.vaildatePlaceholder = "Availability Date";
      //this.updateDate = new Date();
      // this.updateDate.setDate(this.updateDate.getDate() + 1);

      setTimeout(() => { this.updateDate = new Date(''); }, 50);

      this.vendorAvailabilityForm.get('startDate').markAsUntouched();
      this.vendorAvailabilityForm.get('avaiDate').setErrors(null);
      this.vendorAvailabilityForm.get('avaiDate').markAsUntouched();
      this.vendorAvailabilityForm.updateValueAndValidity();
      this.isOk = true;
      this.isreadOnly = true;
      if (new Date(this.vendorAvailabilityForm.get('startDate').value) == null) {
        this.isdisable = true;
      }
      // else if(new Date(this.vendorAvailabilityForm.get('startDate').value) != null)
      // {this.isdisable = false;}

    }
    else if (this.selectedValue != "Request To Remove from Panel") {
      this.vendorAvailabilityForm.get('chkUntilFurtherNotice').setValue('');
      this.isOk = false;
      this.isreadOnly = false;
      this.vendorAvailabilityForm.get('startDate').markAsUntouched();
      setTimeout(() => { this.updateDate = new Date(''); }, 50);
      this.vendorAvailabilityForm.get('avaiDate').setErrors(null);
      this.vendorAvailabilityForm.get('avaiDate').markAsUntouched();
      this.vendorAvailabilityForm.updateValueAndValidity();
      this.vaildatePlaceholder = 'Availability Date*';
      this.isdisable = false;
    }

  }


  onBlurMethod(value, e) {
    if (!moment(value, 'MM/DD/YYYY').isValid()) {
      this.vendorAvailabilityForm.get(e).setErrors(null);
    }
    var sss = moment(value).isValid();
    if (sss == false) {
      this.vendorAvailabilityForm.get(e).setErrors({ 'valid': false });
    } else {
      //var test = this.isAlphaNumeric(value);
      this.vendorAvailabilityForm.get(e).setErrors(null);
      // onBlurMethod(value,e){

      let etest = this.vendorAvailabilityForm.get('Reasons').value
      if (e == 'avaiDate' && etest == 'Out of Office' && value != null
        && this.vendorAvailabilityForm.get('startDate').value != null) {
        let startDateVal = new Date(this.vendorAvailabilityForm.get('startDate').value);
        let availabilityDateVal = new Date(value);
        var timeDiff = Math.abs(startDateVal.getTime() - availabilityDateVal.getTime());
        var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (dayDifference > 28 && (availabilityDateVal > startDateVal)) {
          let startDateVal = this.vendorAvailabilityForm.get('startDate').value;
          let dref = this.dialogService.showDialog('gap between the Start date and Availability date should not be more than 30 calendar days', 'Ok', '500');
          dref.afterClosed().subscribe(result => {
            if (result) {
              setTimeout(() => { this.updateDate = new Date(''); }, 50);
            }
          });
        }
      }
      if (e == 'startDate' && etest == 'Out of Office' && value != null &&
        this.vendorAvailabilityForm.get('avaiDate').value != null) {
        let startDateVal = new Date(value);
        let availabilityDateVal = new Date(this.vendorAvailabilityForm.get('avaiDate').value);
        var timeDiff = Math.abs(startDateVal.getTime() - availabilityDateVal.getTime());
        var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        console.log('dayDifference' + dayDifference);
        if (dayDifference > 28 && (startDateVal < availabilityDateVal)) {
          let startDateVal = this.vendorAvailabilityForm.get('startDate').value;
          let dref = this.dialogService.showDialog('gap between the Start date and Availability date should not be more than 30 calendar days', 'Ok', '500');
          dref.afterClosed().subscribe(result => {
            if (result) {
              setTimeout(() => { this.currentDate = new Date(''); }, 50);
            }
          });
        }
      }
      if (e == 'avaiDate' && value != null &&
        this.vendorAvailabilityForm.get('startDate').value != null) {
        let startDateVal = new Date(this.vendorAvailabilityForm.get('startDate').value);
        //debugger;
        let availabilityDateVal = new Date(value);
        if (availabilityDateVal < startDateVal) {
          let dref = this.dialogService.showDialog('Availability date should be later than the Start date', 'Ok', '500');
          dref.afterClosed().subscribe(result => {
            if (result) {
              setTimeout(() => { this.updateDate = new Date(''); }, 50);
            }
          });
        }
      }
      if (e == 'startDate' && value != null &&
        this.vendorAvailabilityForm.get('avaiDate').value != null) {
        // alert(new Date(value).toLocaleDateString());
        let startDateVal = new Date(value);
        let availabilityDateVal = new Date(this.vendorAvailabilityForm.get('avaiDate').value);
        if (startDateVal > availabilityDateVal) {
          let dref = this.dialogService.showDialog('Start date should be before availability date', 'Ok', '500');
          dref.afterClosed().subscribe(result => {
            if (result) {
              setTimeout(() => { this.currentDate = new Date(''); }, 50);
            }
          });
        }
      }
      if (e == 'startDate' && etest == 'Request To Remove from Panel' &&
        new Date(this.vendorAvailabilityForm.get('startDate').value) != null) {
        //debugger;
        this.isdisable = true;
      } else if (e == 'startDate' && etest != 'Request To Remove from Panel' &&
        new Date(this.vendorAvailabilityForm.get('startDate').value) != null) {
        this.isdisable = false;
      }

    }
  }

  omit_special_char(event) {
    const pattern = /[0-9\-\/]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  setFurtherNotice(event) {

    if (this.vendorAvailabilityForm.get('chkUntilFurtherNotice').value === true) {
      this.vendorAvailabilityForm.get('avaiDate').setErrors(null);
      this.vendorAvailabilityForm.get('avaiDate').markAsUntouched();
      this.vendorAvailabilityForm.updateValueAndValidity();
      this.vaildatePlaceholder = 'Availability Date';
      this.isOk = true;
      this.isreadOnly = true;
      this.isdisable = true;
      setTimeout(() => { this.updateDate = new Date(''); }, 50);
    } else {
      this.vaildatePlaceholder = 'Availability Date*';
      this.isOk = false;
      this.isreadOnly = false;
      this.isdisable = false;
    }
  }

  addAvailabilityDialog() {
    let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '500');
    dref.afterClosed().subscribe(result => {
      if (result) {
        this.addAvailability();
      } else {
      }
    });
  }

  addAvailability() {
    let availableDate: Date;
    let updatedVendorSection = 7;
    let form = this.vendorAvailabilityForm.value;
    if (form.chkUntilFurtherNotice === '') {
      form.chkUntilFurtherNotice = false;
    }
    if (form.avaiDate != null && form.avaiDate != "Invalid Date") {
      availableDate = form.avaiDate.toLocaleDateString();
    } else { availableDate = form.avaiDate; }
    let availability = <IAvailability>{
      vendorId: this.vendorid,
      updatedVendorSection: updatedVendorSection,
      vendorAvailability: [{
        availabilityId: "",
        startDate: form.startDate.toLocaleDateString(),
        //startDate: new Date(form.startDate),
        //availabilityDate:form.avaiDate.toLocaleDateString(),
        availabilityDate: availableDate,
        reasons: this.selectedValue,
        isUntilFurtherNotice: form.chkUntilFurtherNotice
      }]
    };
    console.log(JSON.stringify(availability));
    if ((form.startDate == null || form.startDate === '') &&
      (form.availabilityDate == null || form.availabilityDate === '') &&
      (this.selectedValue == null || this.selectedValue === '')
    ) {
      // this.isdisable = false;
      this.submitted = false;
    } else {
      this.vendorSandbox.addAvailabilityList(availability);
      this.vendorSandbox.addAvailability$.subscribe((data) => {
      }, (error) => {
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
          this.vendorAvailabilityForm.reset();
          //this.vendorAvailabilityForm.markAsUntouched();
          this.snackBar.open('Availability added successfully', 'Close', {
            duration: 3000,
          });
        });
      console.log('addAvailability' + JSON.stringify(availability));
    }
  }

  onCancelAvailability() {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel', 'Yes', '500');
    dref.afterClosed().subscribe(result => {
      if (result) {
        this.isAddAvailabilityClicked = false;
        this.isShowAvailability = true;
        this.loadVendorData(this.vendorid);
        //this.vendorAvailabilityForm.reset();
      } else {
      }
    });
  }

  loadVendorData(vendorid: string) {
    this.vendorSandbox.getVendorIdList(vendorid);
    this.vendorSandbox.getvendorIdList$.subscribe(
      data => {
        this.contactdata = data;
        if (this.contactdata && this.contactdata.vendorCapacityInformation) {
          this.vendorCapacity = this.contactdata.vendorCapacityInformation.capacity;
          this.vendorCapacityForm.get('capacity').setValue(this.vendorCapacity);
        }
      },
      error => {
        // this.$broadcast.exception('Please fill all the required details with right format.');
      },
      () => { });
  }
  addCapacityDialog() {
    let dref = this.dialogService.showDialog('Are you sure you want to Save', 'Yes', '500');
    dref.afterClosed().subscribe(result => {
      if (result) {
        const updatedVendorSection = 10;
        let form = this.vendorCapacityForm.value;
        let vCapacity = <ICapacity>{
          capacityId: '',
          capacity: form.capacity
        }
        let vendorCapacity = <IVendorCapacityModel>{
          vendorId: this.vendorid,
          updatedVendorSection: updatedVendorSection,
          VendorCapacityCommand: vCapacity
        }
        this.vendorSandbox.addCapacityList(vendorCapacity);
        this.vendorSandbox.addCapacity$.subscribe((data) => {
        }, (error) => {
          let errResponse = {};
          errResponse = JSON.parse(JSON.stringify(error));
          let dref = this.dialogService.showDialog(errResponse['error'], 'Ok', '500');
          dref.afterClosed().subscribe(result => {
            if (result) {
            } else {
            }
          });
          this.globalErrorHandler.handleError(error);
        },
          () => {
            this.isAddCapacityClicked = false;
            this.isShowCapacity = true;
            this.snackBar.open('Capacity updated successfully', 'Close', {
              duration: 3000,
            });
            this.loadVendorData(this.vendorid);
          });
      } else {
      }
    });    
  }
  onCancelCapacity() {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel', 'Yes', '500');
    dref.afterClosed().subscribe(result => {
      if (result) {
        this.isAddCapacityClicked = false;
        this.isShowCapacity = true;
        this.loadVendorData(this.vendorid);
      } else {
      }
    });
  }
  onKeyUp(value, controlName) {
    if (value > 100) {
      this.capacityErrorMessage = 'Capacity should be between 0 to 100';
      this.vendorCapacityForm.get(controlName).setErrors(new Error(this.capacityErrorMessage));
    } else if (value === '') {
      this.capacityErrorMessage = 'Enter valid capacity.';
    }

  }
}
