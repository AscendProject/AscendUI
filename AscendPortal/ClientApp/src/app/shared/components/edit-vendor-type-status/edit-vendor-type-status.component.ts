import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogsService } from '../../services/dialogs.service';
import { VendorSandbox } from '../../../vendor/vendor.sandbox';
import { BroadcastService } from '../../../vendor/services';
import { IVendorProfileModelResponse } from '../../models/add-vendor-model';


@Component({
  selector: 'app-edit-vendor-type-status',
  templateUrl: './edit-vendor-type-status.component.html',
  styleUrls: ['./edit-vendor-type-status.component.scss']
})
export class EditVendorTypeStatusComponent implements OnInit {


  btnText: any;
  title: string;
  vendorTypeAndStatusId: string[];
  vendorStatusTypes: any;
  vendorStatusTypesDetails: any;
  selectedStatus: any;
  selectedStatusDetails: any;
  selectedVendorType: any;

// Drop down lists for the page
vendorTypes = [
  { value: 'Vendor', viewValue: 'Vendor' },
  { value: 'Prospect', viewValue: 'Prospect' }
];


  vendorTypesDefault = [
{ value: 'Active', viewValue: 'Active' },
{ value: 'Inactive', viewValue: 'Inactive' },
    { value: 'Do Not Contact', viewValue: 'Do Not Contact' },
{ value: 'Initial', viewValue: 'Initial' }
];

  prospectTypesDefault = [
  { value: 'New', viewValue: 'New' },
  { value: 'Not at this time', viewValue: 'Not at this time' },
  { value: 'Do Not Contact', viewValue: 'Do Not Contact' },
  { value: 'Vetting', viewValue: 'Vetting' }
  ];

  // Vendor Status Details DropDown Lists
 prospectNotAtThisTimeDetails= [
  { value: 'At Vendor Request', viewValue: 'At Vendor Request' },
  { value: 'Internal Request', viewValue: 'Internal Request' }
];

 prospectNewDetails = [
   { value: 'Never Contacted', viewValue: 'Never Contacted' },
   { value: 'Contacted', viewValue: 'Contacted' }
 ];

 prospectDoNotUseDetails=[
 { value: 'Deceased', viewValue: 'Deceased' },
 { value: 'Disciplinary Action', viewValue: 'Disciplinary Action' },
 { value: 'Vendor Requested', viewValue: 'Vendor Requested' },
 { value: 'Other', viewValue: 'Other' }
 ];

 prospectVettingDetails = [
   { value: 'Info.Doc Requirements', viewValue: 'Info.Doc Requirements' }
 ];

 vendorIntialDetails = [
 { value: 'Pending Initial Assignment', viewValue: 'Pending Initial Assignment' },
 { value: 'Pending Initial Order Completion', viewValue: 'Pending Initial Order Completion' },
 { value: 'Pending Compliance Review', viewValue: 'Pending Compliance Review' }
 ];

  vendorActiveDetails = [
 { value: 'Active', viewValue: 'Active' },
 { value: 'Pending Info - Active Services(s)', viewValue: 'Pending Info - Active Services(s)' },
 { value: 'Pending Info - Updated Lic/E&O', viewValue: 'Pending Info - Updated Lic/E&O' },
 ];

  vendorInactiveDetails = [
  { value: 'Temporarily Unavailable', viewValue: 'Temporarily Unavailable' },
  { value: 'Pending Info - No Active Service', viewValue: 'Pending Info - No Active Service' },
  { value: 'Pending Offboard', viewValue: 'Pending Offboard' },
  { value: 'Offboarded', viewValue: 'Offboarded' },
  { value: 'Disciplinary Action', viewValue: 'Disciplinary Action' }
  ];

 vendorDonNotUseDetails = [
  { value: 'Deceased', viewValue: 'Deceased' },
  { value: 'Disciplinary Action', viewValue: 'Disciplinary Action' },
  { value: 'Offboarded', viewValue: 'Offboarded' },
  { value: 'Other', viewValue: 'Other' }
  ];

 
// Form group
public editVendorTypeAndStatus: FormGroup;
 // public dialogService: DialogsService;
  constructor(private fb: FormBuilder,
    public dialogService: DialogsService,
    public dialogRef: MatDialogRef<EditVendorTypeStatusComponent>,    
    private vendorSandbox: VendorSandbox,
    public broadService: BroadcastService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public zone: NgZone) {
    console.log(data);
    this.btnText = data.buttonName;
    this.title = data.title;
    this.vendorTypeAndStatusId = data.msg;
  }


  ngOnInit() {
    /* broadcast servive to details change*/
    this.broadService.on<any>('vendorstatuschanged').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
      });
    });

    this.editVendorTypeAndStatus = this.fb.group({
      vendorType: ['', Validators.required],
      vendorStatus: ['', Validators.required],
      vendorStatusDetail: ['', Validators.required]
    });
 
    this.selectedVendorType = this.vendorTypeAndStatusId[0];
    this.selectedStatus = this.vendorTypeAndStatusId[1];
    this.selectedStatusDetails = this.vendorTypeAndStatusId[3];

    if (this.vendorTypeAndStatusId[0] === 'Vendor') {
      this.vendorStatusTypes = this.vendorTypesDefault;
    }

    if (this.selectedStatus === 'Initial') {
      this.vendorStatusTypesDetails = this.vendorIntialDetails;
    }
    if (this.selectedStatus === 'Active') {
      this.vendorStatusTypesDetails = this.vendorActiveDetails;
    }
    if (this.selectedStatus === 'Inactive') {
      this.vendorStatusTypesDetails = this.vendorInactiveDetails;
    }
    if (this.selectedStatus === 'Do Not Contact') {
      this.vendorStatusTypesDetails = this.vendorDonNotUseDetails;
    }

      if (this.vendorTypeAndStatusId[0] === 'Prospect') {
        this.vendorStatusTypes = this.prospectTypesDefault;
    }
      if (this.selectedStatus === 'New') {
        this.vendorStatusTypesDetails = this.prospectNewDetails;
      }
      if (this.selectedStatus === 'Not at this time') {
        this.vendorStatusTypesDetails = this.prospectNotAtThisTimeDetails;
      }
      if (this.selectedStatus === 'Do Not Contact') {
        this.vendorStatusTypesDetails = this.prospectDoNotUseDetails;
      }
      if (this.selectedStatus === 'Vetting') {
        this.vendorStatusTypesDetails = this.prospectVettingDetails;
      }
  }


  close() {
    this.dialogRef.close(false);
}

  changeVendorStatusList(event) {
  if (event.value === 'Vendor') {
    this.vendorStatusTypes = this.vendorTypesDefault;
  this.selectedStatus = this.vendorStatusTypes[1].value;
  
  this.vendorStatusTypesDetails = this.vendorInactiveDetails;
  this.selectedStatusDetails = '';
  this.editVendorTypeAndStatus.get('vendorStatusDetail').setErrors({ 'valid': false });
  this.editVendorTypeAndStatus.get('vendorStatusDetail').markAsTouched();
  } else if (event.value === 'Prospect') {
    this.vendorStatusTypes = this.prospectTypesDefault;
    this.selectedStatus = '';
    this.selectedStatusDetails = '';
    this.editVendorTypeAndStatus.get('vendorStatus').setErrors({ 'valid': false });
    this.editVendorTypeAndStatus.get('vendorStatus').markAsTouched();
  }
  }

  // Change vendor status details

  changeVendorStatusDetailsList(event) {
    if (event.value === 'New') {
      this.vendorStatusTypesDetails = this.prospectNewDetails;
      this.selectedStatusDetails = this.vendorStatusTypesDetails[0].value;
    } else if (event.value === 'Not at this time') {
      this.vendorStatusTypesDetails = this.prospectNotAtThisTimeDetails;
      this.selectedStatusDetails = '';
      this.editVendorTypeAndStatus.get('vendorStatusDetail').setErrors({ 'valid': false });
      this.editVendorTypeAndStatus.get('vendorStatusDetail').markAsTouched();
    } else if (this.editVendorTypeAndStatus.get('vendorType').value === 'Prospect' && event.value === 'Do Not Contact') {
      this.vendorStatusTypesDetails = this.prospectDoNotUseDetails;
      this.selectedStatusDetails = '';
      this.editVendorTypeAndStatus.get('vendorStatusDetail').setErrors({ 'valid': false });
      this.editVendorTypeAndStatus.get('vendorStatusDetail').markAsTouched();
    } else if (event.value === 'Vetting') {
      this.vendorStatusTypesDetails = this.prospectVettingDetails;
      this.selectedStatusDetails = this.vendorStatusTypesDetails[0].value;
      this.editVendorTypeAndStatus.get('vendorStatusDetail').setErrors({ 'valid': false });
      this.editVendorTypeAndStatus.get('vendorStatusDetail').markAsTouched();
    } else if (event.value === 'Initial') {
      this.vendorStatusTypesDetails = this.vendorIntialDetails;
      this.selectedStatusDetails = '';
      this.editVendorTypeAndStatus.get('vendorStatusDetail').setErrors({ 'valid': false });
      this.editVendorTypeAndStatus.get('vendorStatusDetail').markAsTouched();
    }
    else if (event.value === 'Active') {
      this.vendorStatusTypesDetails = this.vendorActiveDetails;
      this.selectedStatusDetails = '';
      this.editVendorTypeAndStatus.get('vendorStatusDetail').setErrors({ 'valid': false });
      this.editVendorTypeAndStatus.get('vendorStatusDetail').markAsTouched();
    } else if (event.value === 'Inactive') {
      this.vendorStatusTypesDetails = this.vendorInactiveDetails;
      this.selectedStatusDetails = '';
      this.editVendorTypeAndStatus.get('vendorStatusDetail').setErrors({ 'valid': false });
      this.editVendorTypeAndStatus.get('vendorStatusDetail').markAsTouched();
    } else if (this.editVendorTypeAndStatus.get('vendorType').value === 'Vendor' && event.value === 'Do Not Contact') {
      this.vendorStatusTypesDetails = this.vendorDonNotUseDetails;
      this.selectedStatusDetails = '';
      this.editVendorTypeAndStatus.get('vendorStatusDetail').setErrors({ 'valid': false });
      this.editVendorTypeAndStatus.get('vendorStatusDetail').markAsTouched();
    }
  }


  //  Button Click Event
  saveTypeAndStatus() {
    const form = this.editVendorTypeAndStatus.value;

    const vendorTypeAndStatusUpdateObj = {
      vendorId: this.vendorTypeAndStatusId[2],
      updatedVendorSection: 8,
      vendorType: {
        vendorType: form.vendorType,
        vendorStatus: form.vendorStatus,
        vendorStatusDetail: form.vendorStatusDetail
      }
    }

    this.vendorSandbox.updateVendorList(vendorTypeAndStatusUpdateObj);
    this.vendorSandbox.updateVendor$.subscribe((updatedVendorDetails: IVendorProfileModelResponse) => {
      if (updatedVendorDetails && updatedVendorDetails.isSuccessful) {
    
        const dialogRef = this.dialogService.showDialog('Vendor Type and Status updated successfully!', 'Ok', '400');
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.vendorSandbox.getVendorIdList(updatedVendorDetails.createdVendorId);
            this.vendorSandbox.getvendorIdList$.subscribe(
              data => {
                this.broadService.broadcast('addvendordata', data);
                this.broadService.broadcast('vendorstatuschanged', data);
        
              });
          }
        });
        this.dialogRef.close(true);
      }
      });
}
}

