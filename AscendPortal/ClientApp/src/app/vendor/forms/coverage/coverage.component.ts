import { Component, OnInit, Output, NgZone, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { DialogsService } from '../../../shared/services/dialogs.service';
import { ConfigService } from '../../../config.service';
import { AddcoverageComponent } from './addcoverage.component';
import { BroadcastService } from '../../services/broadcast.service';
import { VendorServiceList, Dictionary } from '../../../shared/models/vendor-service-model';

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.scss']
})

export class CoverageComponent implements OnInit {
  vendorid: any;
  data: Dictionary;
  servicesData: Array<any> = [];
  step = 0;
  addservicesInfoarray = new Array();
  isHVR = false;
  isExteriorInspection = false;
  totalCoveragesData: Array<any> = [];
  isSelectH = false;
  isSelectEx = false;
  @Output() coverageHvrServiceData: any;
  @Output() coverageExteriorServiceData: any;
  @Output() coverageHvrAccordianData: any;
  @Output() coverageExteriorAccordianData: any;
  isopenH = false;
  isopenEx = false;
  resultCoverages: any = [];
  serviceName: any;
  @Input() vendorID: any;
  @Input() isServiceChangedFromService: any;
  isServiceItem = false;
  detailsdata: any;
  @Output() closeToggle = new EventEmitter();
  @Input() set receiveData(newData) {
    console.log(newData);
    this.detailsdata = newData;
  }
  isServiceClickedFromService = '';

  constructor(private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    public dialogService: DialogsService,
    public router: Router,
    public route: ActivatedRoute,
    public $fb: FormBuilder,
    private configService: ConfigService,
    public broadService: BroadcastService,
    public zone: NgZone) {
    this.vendorid = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.isServiceItem = false;       
    console.log(this.vendorID);
    if (this.isServiceChangedFromService) {
      this.isServiceClickedFromService = this.isServiceChangedFromService;
    }
    if (this.vendorID) {
      this.vendorid = this.vendorID;
    }
    if (this.configService.isReady) {
      this.getEligibleInfo();
    } else {
      this.configService.settingsLoaded$.subscribe(x => {
        this.getEligibleInfo();
      });
    }
  }
  addServiceToggleClose() {
    const dref = this.dialogService.showDialog('Are you sure want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.closeToggle.emit(true);
      }
    });

  }
  // Recieving message from add coverage component.
  receiveMessage($event) {
    console.log($event.isSuccess);
    if ($event.isSuccess) {
      if ($event.isaccordian) {
        this.getEligibleInfo();
      } else {
        this.getEligibleInfo();
      }

    }
  }

  // Receiving accordian success from add coverage component.
  receiveAccordianSuccess(event) {
    console.log(event.service);
    if (!event.isSuccess) {
      if (event.service === 'HVR+') {
        this.isopenEx = false;
        this.isopenH = true;
      } else {
        this.isopenEx = true;
        this.isopenH = false;
      }
    } else {
      this.accordianViewCall(event.service);
    }
  }

  // checking array contains duplicates or not
  deepIndexOf(arr, obj, abbr) {
    return arr.findIndex(function (cur) {
      return obj === cur.abbr;
    });
  }

  accordianClickFunc(sname: any) {
    let fieldchanged;
    let coveragechaged;
    console.log(localStorage);
    if (localStorage) {
      fieldchanged = localStorage.getItem('formchange') ? JSON.parse(localStorage.getItem('formchange')) : false;
      coveragechaged = localStorage.getItem('coveragechange') ? JSON.parse(localStorage.getItem('coveragechange')) : false;
    }
    console.log(coveragechaged.finalcoverage, fieldchanged.isfieldchanged);
    if (coveragechaged.finalcoverage || fieldchanged.isfieldchanged) {
      if (sname === 'HVR+' && this.isopenEx) {
        this.coverageHvrAccordianData = { 'service': sname, 'isopenh': false, 'isopenex': true };
      } else if (sname === 'Exterior Inspection' && this.isopenH) {
        this.coverageExteriorAccordianData = { 'service': sname, 'isopenh': true, 'isopenex': false };
      }
    } else {
      this.accordianViewCall(sname);
    }

  }
  // accordian hover function
  accordianClickFuncHover(sname: any) {
    let fieldchanged;
    let coveragechaged;
    console.log(localStorage);
    if (localStorage) {
      fieldchanged = localStorage.getItem('formchange') ? JSON.parse(localStorage.getItem('formchange')) : false;
      coveragechaged = localStorage.getItem('coveragechange') ? JSON.parse(localStorage.getItem('coveragechange')) : false;
    }
    console.log(coveragechaged.finalcoverage, fieldchanged.isfieldchanged);
    if (coveragechaged.finalcoverage || fieldchanged.isfieldchanged) {
      if (sname === 'HVR+' && this.isopenEx) {
        this.coverageHvrAccordianData = { 'service': sname, 'isopenh': false, 'isopenex': true };
      } else if (sname === 'Exterior Inspection' && this.isopenH) {
        this.coverageExteriorAccordianData = { 'service': sname, 'isopenh': true, 'isopenex': false };
      }
    }

  }

  // Checking is Object is empty or not.
  isEmptyObject(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  // accordian click function
  accordianViewCall(sname) {
    console.log(sname);
    let acordianData = {};
    if (this.servicesData.length > 0) {
      // let totdata = this.resultCoverages.vendorServices;
      this.servicesData.forEach(eachservice => {
        if (eachservice.serviceName === sname) {
          acordianData = eachservice;
        } else {

        }
      });
      localStorage.clear();
      localStorage.setItem('formchange', '');
      localStorage.setItem('coveragechange', '');
      localStorage.setItem('coverageareadata', '');
      localStorage.setItem('finalcoveragedata', '');
    }
    if (sname === 'HVR+') {
      if (!this.isEmptyObject(acordianData)) {
        this.coverageHvrServiceData = acordianData;
      }
      this.serviceName = 'HVR+';
      this.isopenH = !this.isopenH;
      this.isopenEx = false;
    }
    if (sname === 'Exterior Inspection') {      
      if (!this.isEmptyObject(acordianData)) {
        this.coverageExteriorServiceData = acordianData;
      }
      // this.coverageServiceData = acordianData;
      this.serviceName = 'Exterior Inspection';
      this.isopenEx = !this.isopenEx;
      this.isopenH = false;
    }
    // this.eventService.broadcast('servicedatachanged', this.coverageServiceData);

    // console.log(this.coverageServiceData);
    console.log(this.isopenEx, this.isopenH);
  }

  // Getting list of eligible services api call.
  getEligibleInfo() {
   // this.spinner.show();
    this.vendorSandbox.getVendorServicesInfo(this.vendorid).subscribe((serviceList: VendorServiceList) => {
      this.data = serviceList.dictionary;
      console.log(this.data);
    }, error => this.globalErrorHandler.handleError(error),
    () => {
        this.getAllCoverageData();
     });
  }

  getAllCoverageData() {
    // this.spinner.show();
    this.vendorSandbox.getVendorAllServices(this.vendorid);
    this.vendorSandbox.getVendorAllServicesList$.subscribe((data) => {
      this.servicesData = data;
    }, error => this.globalErrorHandler.handleError(error),
      () => {
        if (this.servicesData.length > 0) {
          this.servicesData.forEach(eachservice => {
            if (eachservice.serviceName === 'HVR+' && eachservice.isSelected) {
              this.isSelectH = true;
            } else if (eachservice.serviceName === 'Exterior Inspection' && eachservice.isSelected) {
              this.isSelectEx = true;
            }
          });
          // this.isopenH = false;
          // this.isopenEx = false;
          console.log(this.isServiceClickedFromService);
          if (this.isServiceClickedFromService != '') {
            this.accordianViewCall(this.isServiceClickedFromService);
          } else {
            this.accordianViewCall('HVR+');
          }
         
        } else {          
          if (this.isServiceClickedFromService != '') {
            this.accordianViewCall(this.isServiceClickedFromService);
          } else {
            this.accordianViewCall('HVR+');
          }
        }
        // this.spinner.hide();
   });
  }

  setseletctedServices($event, value) {
    if ($event.target.checked) {
      this.addservicesInfoarray.push(value);
    } else {

    }
  }

  // addServicesInfo() {
  //  let addServiceObj = {
  //    vendorId: this.vendorid,
  //    servicesList: this.addservicesInfoarray,
  //    id: this.vendorid
  //  }
  //  this.$api.addServicesInfo(addServiceObj).subscribe(
  //    data => { },
  //    err => { },
  //    () => {
  //    });
  //  this.router.navigate(['services', this.vendorid]);
  // }

  cancelCoverage() {
    const dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {

      } else {

      }
    });
  }
}
