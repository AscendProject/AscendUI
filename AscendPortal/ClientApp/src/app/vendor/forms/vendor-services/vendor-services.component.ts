import { Component, OnInit, Output, NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
import { ConfigService } from '../../../config.service';
import {
  IVendorName, IVendorAddress, IVendorAddressInfo, IServiceType, IVendorEmail,
  IVendorPhone, ICompanyInformation, IVendorProfileModel, IVendorProfileModelResponse
} from '../../../shared/models/add-vendor-model';
import { DialogsService } from '../../../shared/services/dialogs.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { BroadcastService } from '../../services/broadcast.service';
import { RatingDialogComponent } from '../../../shared/components/index';
import { VendorServiceList, RatingResponse } from '../../../shared/models/vendor-service-model';

@Component({
  selector: 'app-vendor-services',
  templateUrl: './vendor-services.component.html',
  styleUrls: ['./vendor-services.component.scss']
})
export class VendorServicesComponent implements OnInit {
  vendorid = '';
  serviceFilteredData: any = [];
  public vendorServices: FormGroup;
  services = ['Appraisal', 'Broker'];
  public disableButton = false;
  serviceTypes: any;
  @Output() isFromVendorService = true;
  closeToggleEvent = false;


  constructor(private vendorSandbox: VendorSandbox, private globalErrorHandler: GlobalErrorHandler,
    public router: Router,
    public appComp: AppComponent,
    private _configService: ConfigService,
    public route: ActivatedRoute,
    public $fb: FormBuilder,
    public dialog: DialogsService,
    public matDialog: MatDialog,
    public snackBar: MatSnackBar,
    public broadService: BroadcastService,
    public zone: NgZone) {
  }
  private rating: number;
  private serviceId: string;
  private ratingAction: string;

  ngOnInit() {
    this.vendorid = this.route.snapshot.params['id'];
    console.log(this.vendorid);
    this.broadService.on<any>('isserviceclicked').subscribe((item) => {
      this.zone.run(() => {
      });
    });

    this.broadService.on<any>('isservicechanged').subscribe((item) => {
      this.zone.run(() => {
        if (item) {

        }
      });
    });

    const defaultServices = [];
    this.vendorServices = this.$fb.group({
      services: this.$fb.array(this.services.map(x => defaultServices.indexOf(x) > -1))
    });

    if (this._configService.isReady) {
      this.vendorServices = this.$fb.group({
        services: this.$fb.array(this.services.map(x => defaultServices.indexOf(x) > -1))
      });
      this.loadVendorData(this.vendorid);
      this.loadServiceInfo();
    } else {
      this._configService.settingsLoaded$.subscribe(x => {
        //  const defaultServices = [];
        this.vendorServices = this.$fb.group({
          services: this.$fb.array(this.services.map((serv) => defaultServices.indexOf(serv) > -1))
        });
        this.loadVendorData(this.vendorid);
        this.loadServiceInfo();
      });
    }

  }
  toggleClose() {
    if (!this.closeToggleEvent) {
      this.snackBar.open('Vendor data not saved', 'Close', {
        duration: 3000,
      });
    }
    this.closeToggleEvent = false;
  }
  convertToValue(key: string) {
    return this.vendorServices.value[key].map((x, i) => x && this[key][i]).filter(x => !!x);
  }

  // update service type based on selection
  updateServiceType() {
    const selectedServiceTypes = this.convertToValue('services');
    const vendorServiceType = <IServiceType>{
      ServiceType: selectedServiceTypes
    };
    const vendorobj = {
      vendorId: this.vendorid,
      updatedVendorSection: 5,
      serviceType: vendorServiceType
    };
    // this.spinner.show();
    this.vendorSandbox.updateVendorList(vendorobj);
    this.vendorSandbox.updateVendor$.subscribe((data) => {

    }, error => this.globalErrorHandler.handleError(error),
      () => {
        this.loadServiceInfo();
      });

  }
  // sorting the table
  onServiceSorted($event) {
    this.getSortedServicesData($event);
  }
  getSortedServicesData(criteria) {
    console.log(criteria);
    return this.serviceFilteredData.sort((a, b) => {
      if (criteria.sortDirection === 'asc') {
        if (a[criteria.sortColumn] < b[criteria.sortColumn]) {
          return -1;
        } else if (a[criteria.sortColumn] > b[criteria.sortColumn]) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (a[criteria.sortColumn] < b[criteria.sortColumn]) {
          return 1;
        } else if (a[criteria.sortColumn] > b[criteria.sortColumn]) {
          return -1;
        } else {
          return 0;
        }
      }
    });
  }
  // Add a new service and coverages call
  redirectAddNewServices() {
    const selectedServiceTypes = this.convertToValue('services');
    if (selectedServiceTypes.length > 0) {
      //  this.router.navigate(['vendor/services/addnewservice', this.vendorid]);
      this.broadService.broadcast('isserviceclicked', true);
      // this.broadService.broadcast('isservicechanged', this.vendorid);
      return;
    } else {
      const dialogRef = this.dialog.showDialog('Please indicate the type of service(s) you are willing to perform', 'Ok', '400');
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {
        }
      });
      // alert("Please indicate the type of service(s) you are willing to perform");
      return;
    }
  }
  loadVendorData(vendorId: string) {
    // this.spinner.show();
    this.vendorSandbox.getVendorIdList(this.vendorid);
    this.vendorSandbox.getvendorIdList$.subscribe((data) => {
      console.log(data);
      this.serviceTypes = data;
      if (this.serviceTypes.vendorServiceType.serviceType.length > 0) {
        this.vendorServices = this.$fb.group(
          {
            services: this.$fb.array([true, true])
          });

        if (this.serviceTypes.vendorServiceType.serviceType.length === 1) {
          if (this.serviceTypes.vendorServiceType.serviceType[0] === 'Appraisal') {
            this.vendorServices = this.$fb.group(
              {
                services: this.$fb.array([true, false])
              });
          }
          if (this.serviceTypes.vendorServiceType.serviceType[0] === 'Broker') {
            // console.log('appraisal');
            this.vendorServices = this.$fb.group(
              {
                services: this.$fb.array([false, true])
              });
          }
        }
      }
      console.log(this.vendorServices);
    }, error => this.globalErrorHandler.handleError(error));

  }

  // getting list of active serviceas data
  loadServiceInfo() {
    // this.spinner.show();
    let infoData: VendorServiceList;
    this.vendorSandbox.getVendorServicesInfo(this.vendorid).subscribe((serviceList: VendorServiceList) => {
      if (serviceList) {
        this.filterServiceData(serviceList);
        infoData = serviceList;
      }
    }, error => this.globalErrorHandler.handleError(error),
      () => {

      });
  }

  // Filter services data
  filterServiceData(infoData: VendorServiceList) {
    if (infoData && infoData.dictionary) {
      this.serviceFilteredData = [];
      if (infoData.dictionary.IsAppraisalInsuranceValid === 'true' && infoData.dictionary.IsAppraisalLicenseValid === 'true') {
        this.serviceFilteredData.push({ 'serviceName': 'HVR+', 'rating': 0, 'serviceId': '' });
        //this.addRating('HVR+');
      }
      if (infoData.dictionary.IsBrokerInsuranceValid === 'true' && infoData.dictionary.IsBrokerLicenseValid === 'true') {
        this.serviceFilteredData.push({ 'serviceName': 'Exterior Inspection', 'rating': 0, 'serviceId': '' });
        //this.addRating('Exterior Inspection');
      }
    }
    if (infoData.listservices && infoData.listservices.length > 0) {
      for (let i = 0, ilen = infoData.listservices.length; i < ilen; i++) {
        if (infoData.dictionary.IsAppraisalInsuranceValid === 'true' && infoData.dictionary.IsAppraisalLicenseValid === 'true' && infoData.listservices[i].serviceName === 'HVR+') {
          let indx = this.serviceFilteredData.map((el) => el.serviceName).indexOf(infoData.listservices[i].serviceName);
          this.serviceFilteredData[indx].rating = infoData.listservices[i].rating;
          this.serviceFilteredData[indx].serviceId = infoData.listservices[i].id;
        }
        if (infoData.dictionary.IsBrokerInsuranceValid === 'true' && infoData.dictionary.IsBrokerLicenseValid === 'true' && infoData.listservices[i].serviceName === 'Exterior Inspection') {
          let indx = this.serviceFilteredData.map((el) => el.serviceName).indexOf(infoData.listservices[i].serviceName);
          this.serviceFilteredData[indx].rating = infoData.listservices[i].rating;
          this.serviceFilteredData[indx].serviceId = infoData.listservices[i].id;
        }
      }
    }

  }

  public addRating(service): void {   
    const dialogRef = this.matDialog.open(RatingDialogComponent, {
      width: '500px',
      height: '270px',
      data: { title: 'Add Service Score', saveButton: 'Submit', cancelButton: 'Cancel' }
    });

    dialogRef.afterClosed().subscribe((rating: number) => {
      if (rating) {
        let data = {
          "vendorServices": [
            {
              "vendorId": this.vendorid,
              "serviceName": service.serviceName,
              "id": service.serviceId,
              "rating": rating,
              "updatedVendorSection": 1
            }]
        }
        this.vendorSandbox.addServiceRating(data).subscribe((ratingResponse: RatingResponse) => {
          if (ratingResponse && ratingResponse.isSuccessful === true) {
            this.snackBar.open('Rating updated successfully', 'Close', {
              duration: 3000,
            });
            this.loadServiceInfo();
          }
        })
      }
    });
  }

  public updateRating(service): void {
    const dialogRef = this.matDialog.open(RatingDialogComponent, {
      width: '500px',
      height: '270px',
      data: { title: 'Update Service Score', saveButton: 'Submit', cancelButton: 'Cancel' }
    });

    dialogRef.afterClosed().subscribe((rating: number) => {
      if (rating) {
        let data = {
          "vendorServices": [
            {
              "vendorId": this.vendorid,
              "serviceName": service.serviceName,
              "id": service.serviceId,
              "rating": rating,
              "updatedVendorSection": 1
            }]
        }
        this.vendorSandbox.updateServiceRating(data).subscribe((ratingResponse: RatingResponse) => {
          if (ratingResponse && ratingResponse.isSuccessful === true) {
            this.snackBar.open('Rating updated successfully', 'Close', {
              duration: 3000,
            });
            this.loadServiceInfo();
          }
        })
      }
    });
  }
  goToServiceCoverage(servicename) {
    this.broadService.broadcast('isservicechanged', servicename);
    this.broadService.broadcast('isserviceclicked', true);    
  }
}
