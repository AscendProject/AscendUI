import { Component, OnInit, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AddvendorComponent } from '../addvendor/addvendor.component';
import { BroadcastService } from '../../services/broadcast.service';
import { DialogsService, SessionService } from '../../../shared/services/index';
import { ConfigService } from '../../../config.service';
import { VendorSerchQuery } from '../../../shared/models/vendor.model';
@Component({
  selector: 'vendorlist',
  templateUrl: './vendor_list.component.html',
  styleUrls: ['./vendor_list.component.scss']

})
export class VendorListComponent implements OnInit {
  @Output() details = new EventEmitter<object>();
  @Output() pageDetails = new EventEmitter<object>();
  getVendorsdata: any[] = undefined;
  selectedRow: number;
  name: string = '';
  vendorid: string = '';
  contactdata: any
  cdata: any = [];
  vendorname: string;
  selectedOrder: any;
  isAdded: boolean = false;
  public pageNumber: number = 1;
  public pageSize: number = 10;
  public totalCount: number;
  public totalPages: number;
  searchkey: string = '';
  public message: string;
  public isSearchClicked = false;
  public skip: number;
  public isNewAddVendor:boolean;
  public searchkeychange:string='';

  constructor(public router: Router, public route: ActivatedRoute,
    private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    public sessionservice: SessionService,
    public broadService: BroadcastService,
    private configService: ConfigService,
    public zone: NgZone,
  ) {


  }
  ngOnInit() {   
    this.isNewAddVendor = false;
    this.broadService.on<any>('addvendordata').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
        console.log(obj);
        if (obj) {
          this.isServiceReady();
          this.isNewAddVendor = true;
        }
      });
    });

    this.broadService.on<any>('isserviceschanged').subscribe((item) => {
      this.zone.run(() => {

      });
    });
    this.isServiceReady();

  }
  isServiceReady() {
    if (this.configService.isReady) {
      this.getVendorList(this.pageNumber, this.pageSize);
    } else {
      this.configService.settingsLoaded$.subscribe(x => {
        this.getVendorList(this.pageNumber, this.pageSize);
      });
    }
  }

  /* Click vendor list to get Data */
  setClickedRow(i, item) {
    this.selectedRow = i;
    this.selectedOrder = item;
    this.details.emit(item);
    this.isAdded = false;
    this.broadService.broadcast('isserviceschanged', false);
    this.router.navigate(['vendor', 'summary', item.vendorId,]);
  }

  /* Getting all the vendors list */

  getVendorList(pageno, size) {
    this.getVendorsdata=undefined;
    this.message = 'Please Wait...';
    this.vendorSandbox.getVendorList(pageno, size);
    this.vendorSandbox.getvendorList$.subscribe(
      data => {
        console.log(data);
        var vendordata = [];
        data.records.forEach(item => {
          if (item.vendorName.preferredName !== '' && item.vendorName.preferredName != null && item.vendorName.preferredName !== undefined) {
            item.Name = item.vendorName.preferredName + " " + item.vendorName.lastName;
          } else {
            item.Name = item.vendorName.firstName + " " + item.vendorName.lastName;
          }
          if (item.vendorServiceType != null) {
            if ((item.vendorServiceType.serviceType !== '') && (item.vendorServiceType.serviceType != null) && (item.vendorServiceType.serviceType !== undefined)) {
              item.servicetypes = item.vendorServiceType.serviceType;
            }
          }


          if (item.vendorAddress != null) {

            item.vendorAddress.forEach(item1 => {
              if (item1.addressType === 'Physical') {
                item.state = item1.state;
              }
              else if(item1.addressType === 'Mailing'){
                item.state = item1.state;
              }
              else {
                item.state=item.vendorCompany.state
              }
            })
          }
          vendordata.push(item);
        });
         if(vendordata.length>0)
         {
        this.getVendorsdata = vendordata;
         }
         else{
           this.getVendorsdata=undefined;
           this.message="No Vendors Found"
         }
        this.totalCount = data.pagingResult.totalCount;
        this.totalPages = data.pagingResult.totalPages;
        this.isSearchClicked=false;
        this.pageDetails.emit({'totalCount':this.totalCount,'totalPages':this.totalPages,'pageNumber':this.pageNumber,'pageSize':this.pageSize});
      },
      error => { },
      () => {
        if (this.isNewAddVendor) {
          this.setClickedRow(0, this.getVendorsdata[0]);
        }
      });
  }

  vendorSearch(key) {
    if(this.isSearchClicked==false){
    this.searchkeychange=key;
      this.pageNumber=1;
    }
    else if(this.searchkeychange != key){
      this.pageNumber=1;
    }
    this.getVendorsdata=undefined;
     this.message = 'Please Wait...';
     this.searchkey=key;
     let queryData = <VendorSerchQuery>{
      search: key,
      searchFields: "firstName,lastName,preferredName,id",
      select: "firstName,middleName,preferredName,vendorId,serviceTypes,lastName,companyState,vendorState",
      top: this.pageNumber * this.pageSize,
      skip: (this.pageNumber * this.pageSize) - this.pageSize,
      count: true
    }

    this.vendorSandbox.getVendorSearchResults(queryData);
    this.vendorSandbox.getVendorSearchResults$.subscribe(
      data => {
        var vendordata = [];
        data.value.forEach(item => {
          if (item.preferredName !== '' && item.preferredName != null && item.preferredName !== undefined) {
            item.Name = item.preferredName + " " + item.lastName;
          } else {
            item.Name = item.firstName + " " + item.lastName;
          }
          if (item.serviceTypes.length > 0) {
            if ((item.serviceTypes !== '') && (item.serviceTypes != null) && (item.serviceTypes !== undefined)) {
              item.servicetypes = item.serviceTypes;
            }
          }

          if (item.vendorState != null) {
            item.state = item.vendorState;
          }
          else{
            item.state = item.companyState;
          }
          vendordata.push(item);
        });
        if(vendordata.length>0)
         {
        this.getVendorsdata = vendordata;
        this.setClickedRow(0, this.getVendorsdata[0]);
         }
         else{
           this.getVendorsdata=undefined;
           this.message="No Vendors Found"
         }
        this.totalCount = data['@odata.count'];
        if (this.totalCount > this.pageSize) {
          this.totalPages = Math.round(this.totalCount / this.pageSize);
        }
        else {
          this.totalPages = 1;
        }
        this.isSearchClicked = true;
        this.pageDetails.emit({'totalCount':this.totalCount,'totalPages':this.totalPages,'pageNumber':this.pageNumber,'pageSize':this.pageSize});
      }
    )
    
  }

  getPaging(pagenumber: number) {
    if (pagenumber >= 1 && pagenumber <= this.totalPages) {
      this.pageNumber = pagenumber;
      if (this.isSearchClicked && this.searchkey != '') {
        this.vendorSearch(this.searchkey);
      }
      else {
        this.getVendorList(this.pageNumber, this.pageSize);
      }
    } else {
      this.message = 'Entered page number should be less than or equal to the total number of pages'
    }
    this.pageDetails.emit({'totalCount':this.totalCount,'totalPages':this.totalPages,'pageNumber':this.pageNumber,'pageSize':this.pageSize});
  }

  changePage(pagesize: number) {
    this.pageSize = pagesize;
    this.pageNumber = 1;
   if (this.isSearchClicked && this.searchkey != '') {
        this.vendorSearch(this.searchkey);
      }
      else {
        this.getVendorList(this.pageNumber, this.pageSize);
      }
    this.pageDetails.emit({'totalCount':this.totalCount,'totalPages':this.totalPages,'pageNumber':this.pageNumber,'pageSize':this.pageSize});
  }
}
