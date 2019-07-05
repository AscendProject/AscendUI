import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BroadcastService } from '../../services/broadcast.service';
import { DialogsService } from '../../../shared/services/dialogs.service';

@Component({
  selector: 'ascend-vendor-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() details: any;
  rating: number = 4;
  starCount: number = 5;
  starColor: string = 'accent';
  vendorid: string;
  vendorname: string = '';
  servicetypes: string;
  vendordata: any;
  vendorTypeAndStatusId: string[];
 
  constructor(public broadService: BroadcastService,
    public zone: NgZone,
    public dialog: DialogsService) {
    console.log('vendordata', this.details);
  }
  ngOnInit() {
    this.broadService.on<any>('vendorstatuschanged').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
        if (obj) {
          this.onVendorStatusChangeFun(obj);
        }
      });
    });
    this.vendordata = this.details;
    if (this.vendordata != undefined) {
      // this.vendordata.vendorStatus.vendorStatus = 'New';
      if (this.vendordata.vendorName.preferredName !== '' && this.vendordata.vendorName.preferredName != null && this.vendordata.vendorName.preferredName !== undefined) {
        this.vendorname = this.vendordata.vendorName.preferredName + " " + this.vendordata.vendorName.lastName;
      } else {
        this.vendorname = this.vendordata.vendorName.firstName + " " + this.vendordata.vendorName.lastName;
      }

      if ((this.vendordata.vendorServiceType.serviceType !== '') && (this.vendordata.vendorServiceType.serviceType != null) && (this.vendordata.vendorServiceType.serviceType !== undefined)) {
        this.servicetypes = this.vendordata.vendorServiceType.serviceType;
      }
    }
  }
  onVendorStatusChangeFun(vendorData: any) {
    console.log(vendorData);
    this.vendordata = vendorData;
  }
  onRatingChanged = (score) => {
    this.rating = score;
  }

  chipColor(scolor) {
    switch (scolor) {
        case 'New':
            return 'bg-primary font-weight-bold text-white';
        case 'Inactive':
            return 'bg-warning font-weight-bold text-white';
        case 'Active':
          return 'bg-success font-weight-bold text-white';
        case 'Not at this time':
        return 'bg-dark font-weight-bold text-white';
         case 'Do not use':
        return 'bg-danger font-weight-bold text-white';

        default:
            break;
    }
}

  editVendorTypeAndStatus() {
    this.vendorTypeAndStatusId = [this.vendordata.vendorTypeStatus.vendorType, this.vendordata.vendorTypeStatus.vendorStatus, this.vendordata.vendorId, this.vendordata.vendorTypeStatus.vendorStatusDetails];
    this.dialog.showVendorTypeAndStatustDialog(this.vendorTypeAndStatusId, 'Update Vendor Status', 'Save', '700');
}
}
