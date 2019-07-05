import { Component, OnInit, NgZone, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { VendorSandbox } from './vendor.sandbox';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { VendorListComponent } from './forms/index';
import { BroadcastService } from './services/broadcast.service';
import { MatSnackBar, MatDrawer } from '@angular/material';
import { DataService } from '../shared/services/data.service';
import { Subscription } from 'rxjs';
import { DialogsService } from '../shared/services/dialogs.service';
import {VendorSerchQuery} from '../shared/models/vendor.model';


@Component({
  selector: 'vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
  providers: [VendorListComponent]
})
export class VendorComponent implements OnInit {
  routeLinks: any[];
  activeLinkIndex = -1;
  getVendorsdata;
  vendorid: string;
  detailsdata: any;
  isAdded: boolean = false;
  closeToggleEvent: boolean = false;
  subscription: Subscription;
  public insuranceId: string;
  public selectedFormValue: string;
  public selectedFormPage: string = 'addVendor';
  @ViewChild('addFormToggle') addFormToggle: MatDrawer;
  addVendorFlag: boolean = false;
  @Output() reloadDataList = new EventEmitter();
  isServiceClicked = false;
  // @ViewChild('addServiceToggle') addServiceToggle;
  public pageNumber: number = 1;
  public pageSize: number = 10;
  public totalCount: number;
  public totalPages: number;
  public isSearchClicked = false;
  public searchkey: string = '';
  public message: string;
  @ViewChild(VendorListComponent) list: VendorListComponent;
  @Output() isServiceClickedFromService = '';

  constructor(private router: Router, public vendorlistComponent: VendorListComponent, public snackBar: MatSnackBar,
    private vendorSandbox: VendorSandbox, private configService: ConfigService, public broadService: BroadcastService,
    public zone: NgZone, private ds: DataService, public dialog: DialogsService,) {
    this.subscription = this.ds.getData().subscribe(formPageEvent => {
      if (formPageEvent && formPageEvent.formType !== 'updateDataList') {
        this.changeText(formPageEvent);
      }
    });
  }

  ngOnInit() {
    this.broadService.on<any>('isservicechanged').subscribe((item) => {
      this.zone.run(() => {
        if (item) {
          console.log(item);
          this.isServiceClickedFromService = item;          
        }
      });
    });
    this.broadService.on<any>('isserviceclicked').subscribe((item) => {
      this.zone.run(() => {
        if (item) {          
          this.openDrawer();
        }
      });
    });
    this.broadService.on<any>('isserviceclickchanged').subscribe((item2) => {
      this.zone.run(() => {
      });
    });
    this.broadService.on<any>('vendoradvancesearch').subscribe((itemId) => {
      this.zone.run(() => {
        if(itemId) {          
          this.searchkey = itemId;
          this.list.vendorSearch(itemId);
        }
      });
    });
  }

  public openAdvanceSearch() {
    this.changeText({ 'formType': 'advanceSearch', 'value': null })
  }
  public changeText(selectedFormPage): void {
    if (selectedFormPage) {
      this.selectedFormPage = selectedFormPage.formType;
      this.selectedFormValue = selectedFormPage.value
      this.addFormToggle.open();
    }
  }
  //changePage() {
  //  this.router.navigate(["advancedsearch"]);
  //}
  //openDrawer() {
  //  this.addServiceToggle.open();
  //  this.broadService.broadcast('isserviceclickchanged', this.vendorid);
  //}

  closeToggleConfirm() {
    let dref = this.dialog.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.addFormToggle.close();
      } else {
      }
    });
  }

  public toggleClose(): void {
    this.selectedFormPage = 'addVendor';
    this.isServiceClicked = false;
  }

  public refreshDataList(dataList): void {
    this.addFormToggle.close();
    this.closeToggleEvent = true;
    this.isServiceClicked = false;
    this.ds.sendData({ 'formType': 'updateDataList', 'value': dataList });
  }

  detailsLoad(obj) {
    this.detailsdata = undefined;
    this.vendorid = obj.vendorId;
    this.routedata();
    this.vendorSandbox.getVendorIdList(obj.vendorId);
    this.vendorSandbox.getvendorIdList$.subscribe(
      data => {
        this.detailsdata = data;
      }, error => { },
      () => { });
  }

  getpagedetails(obj)
  {
    this.totalCount=obj.totalCount;
    this.totalPages=obj.totalPages;
    this.pageNumber=obj.pageNumber;
    this.pageSize=obj.pageSize;
  }

  getPaging(pagenumber: number) {
    this.list.getPaging(pagenumber);
  }


  changePage(pagesize: number) {
    this.list.changePage(pagesize);
  }

  vendorSearch() {
    this.list.vendorSearch(this.searchkey);
  }
   openDrawer() {   
    // this.addServiceToggle.open();     
     this.selectedFormPage = 'vendorservice';
     this.isServiceClicked = true;
     this.addFormToggle.open();
    this.broadService.broadcast('isserviceclickchanged', this.vendorid);
  }

 

  routedata() {
    this.routeLinks = [
      {
        label: 'Summary',
        link: 'summary/' + this.vendorid,
        index: 0
      },
      {
        label: 'Contact Info',
        link: 'info/' + this.vendorid,
        index: 1
      },
      {
        label: 'List Insurances/ Licenses',
        link: 'listinsuranceslicenses/' + this.vendorid,
        index: 2
      },     
      {
        label: 'Orders',
        link: 'orders/' + this.vendorid,
        index: 3
      },
      {
        label: 'Services',
        link: 'services/' + this.vendorid,
        index: 4
      },
      {
        label: 'Financial Information',
        link: 'financialinformation/' + this.vendorid,
        index: 5
      },
      {
        label: 'Availability',
        link: 'availability/' + this.vendorid,
        index: 6
      }
    ];
  }
}
