import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { ConfigService } from '../../../config.service';
import { BroadcastService } from '../../services/broadcast.service';
import { DialogsService } from '../../../shared/services/index';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {RatingCommunicationScore} from '../../../shared/components/rating-communication-score/rating-communication-score';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  vendorname: string = '';
  vendorid: string = '';
  contactdata: any;
  communicationscore: number = 0;
  showCommunicationScore: boolean = false;
  starCount = 5;
  starColor: string = 'accent';
  title: string = "Update Communication Score";
  saveButton: string = "Submit";
  cancelButton: string = "Cancel";

  constructor(public router: Router,
    public route: ActivatedRoute,
    private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    private configService: ConfigService,
    public broadService: BroadcastService,
    public zone: NgZone, private dialogService: DialogsService) {
    this.vendorid = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    //this.broadService.on<any>('addvendordata').subscribe((obj) => {
    //  this.zone.run(() => {
    //    // Angular2 Issue
    //    if (obj) {
    //      this.loadVendorData(obj.createdVendorId);
    //    }
    //  });
    //});
    this.broadService.on<any>('editVendorRatingcallback').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
        console.log(obj);
        if (obj) {
          this.loadVendorData(this.vendorid);
        }
      });
    });
    if (this.configService.isReady) {
      this.loadVendorData(this.vendorid);
    } else {
      this.configService.settingsLoaded$.subscribe(x => {
        this.loadVendorData(this.vendorid);
      });
    }
  }

  loadVendorData(vendorId: string) {
    this.vendorSandbox.getVendorIdList(this.vendorid);
    this.vendorSandbox.getvendorIdList$.subscribe(
      data => {        
        this.contactdata = data;
        console.log("summary Data === ", this.contactdata);
        if(this.contactdata && this.contactdata.vendorCommunicationScore){
          this.communicationscore = this.contactdata.vendorCommunicationScore.communicationScore;
        }
        
        console.log("this.communicationscore=== "+ this.communicationscore);
        if(this.communicationscore !== undefined || this.communicationscore !== null)
        {
          this.showCommunicationScore = false;
          //this.communicationscore = this.contactdata.vendorCommunicationScore.communicationScore;
        } else if (this.communicationscore === null || this.communicationscore === undefined){
          this.showCommunicationScore = true; 
          //this.communicationscore = 0;
        }

        if (this.contactdata !== undefined) {
          if (this.contactdata.vendorName.preferredName !== '' && this.contactdata.vendorName.preferredName != null && this.contactdata.vendorName.preferredName !== undefined) {
            this.vendorname = this.contactdata.vendorName.preferredName + " " + this.contactdata.vendorName.lastName;
          } else {
            this.vendorname = this.contactdata.vendorName.firstName + " " + this.contactdata.vendorName.lastName;
          }
        }

      },
      error => {
        // this.$broadcast.exception('Please fill all the required details with right format.');
      },
      () => {
        //this.submitted = false;
      });
  }

  /* Navigaion to Add License Page */
  addlicense() {   
    ///this.router.navigate(['vendoraddinsurance', id]);
    this.router.navigate(['vendor', 'license', this.vendorid]);
  }

  /* Navigaion to Add Insurance Page */
  addinsurances() {
    ///this.router.navigate(['vendoraddinsurance', id]);
    this.router.navigate(['vendor', 'insurances', this.vendorid]);
  }
  updateRating(){
    console.log("update clicked");
    //this.dialogService.updateRatingDialog(this.vendorid, 'Submit', '500');
    this.dialogService.updateRatingDialog(this.vendorid, this.title, this.saveButton, this.cancelButton);
  }
}
