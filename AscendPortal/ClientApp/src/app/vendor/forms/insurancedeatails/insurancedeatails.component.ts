import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';

import {
  IVendorAddress, IVendorInsurance, IVendorName, IVendorInsuranceModel, IVendorHistory, SortCriteria
} from '../../../shared/models/insurances-model';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
import { ConfigService } from '../../../config.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { DataService } from '../../../shared/services/data.service';
import { Location } from '@angular/common';
import { FileUploaderService, FileQueueObject } from '../../../shared/services/file-uploader.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-insurancedeatails',
  templateUrl: './insurancedeatails.component.html',
  styleUrls: ['./insurancedeatails.component.scss']
})
export class InsurancedeatailsComponent implements OnInit {

  insuranceId: string = '';
  insurancedetailsdata: any;
  vendorname: string = '';
  contactdata: any;
  coveragePerClaim: any;
  coveragePerYear: any;
  historydata: any;
  pagesize: number = 5;
  historyFileData: any = [];
  dataSource: any;
  displayedColumns = ['propertyName', 'oldValue', 'newValue', 'changedBy', 'date'];
  historytabledata: any;
  @ViewChild(MatSort) sort: MatSort;
  isShowMore: boolean = true;
  tid: any;
  @ViewChild('historySort') historySort: MatSort;

  constructor(private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    public router: Router,
    public appComp: AppComponent,
    public route: ActivatedRoute,
    private ds: DataService,
    private _location: Location,
    public fileService: FileUploaderService,
    private configService: ConfigService) {
    this.insuranceId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getinsurancedatabyid();
    this.fetchHistoryDetails();
  }
 
  fetchHistoryDetails() {
    this.vendorSandbox.getHistory(this.insuranceId, 100000).subscribe(
      data => {
        this.historydata = data;
        console.log(this.historydata);
        this.historytabledata = new MatTableDataSource<IVendorHistory>(this.historydata.historyLogs.slice(0, this.pagesize));
        this.historytabledata.sort = this.historySort;
        this.historytabledata.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }

          return data[sortHeaderId];
        };

      }, error => { },
      () => {
      });
  }

  addSpaces(input) {
    var result = input.replace(/([A-Z]+)/g, " $1").replace(/^ /, " ");
    return result;
  }

  showmore(value) {
    if (value == 'more') {
      this.pagesize += 5;
      if (this.pagesize <= this.historydata.historyLogs.length) {
        this.isShowMore = true;
      }
      else {
        this.isShowMore = false;
      }
      if (this.pagesize > this.historydata.historyLogs.length) {
        this.pagesize = this.historydata.historyLogs.length;
      }
      this.historytabledata = new MatTableDataSource<IVendorHistory>(this.historydata.historyLogs.slice(0, this.pagesize));
    }
    else {
      this.pagesize -= 5;
      if (this.pagesize < 5) {
        this.pagesize = 5;
        this.isShowMore = true;
      }
      else {
        this.isShowMore = false;
      }
      this.historytabledata = new MatTableDataSource<IVendorHistory>(this.historydata.historyLogs.slice(0, this.pagesize));    
    }

  }

  sortinsuranceData(criteria: SortCriteria): IVendorHistory[] {
    return this.historydata.historyLogs.sort((a, b) => {
      if (criteria.sortDirection === 'asc') {
        if (a[criteria.sortColumn] == null) { a[criteria.sortColumn] = ''; }
        if (b[criteria.sortColumn] == null) { b[criteria.sortColumn] = ''; }
        if (a[criteria.sortColumn].toLowerCase() < b[criteria.sortColumn].toLowerCase()) {
          return -1;
        }
        else if (a[criteria.sortColumn].toLowerCase() > b[criteria.sortColumn].toLowerCase()) {
          return 1;
        }
        else {
          return 0;
        }
      } else {
        if (a[criteria.sortColumn] == null) { a[criteria.sortColumn] = ''; }
        if (b[criteria.sortColumn] == null) { b[criteria.sortColumn] = ''; }
        if (a[criteria.sortColumn].toLowerCase() < b[criteria.sortColumn].toLowerCase()) {
          return 1;
        } else if (a[criteria.sortColumn].toLowerCase() > b[criteria.sortColumn].toLowerCase()) {
          return -1;
        } else {
          return 0;
        }
      }
    });
  }

  getRecord() {
    var sortCriteria: SortCriteria = {
      sortDirection: this.sort.direction,
      sortColumn: this.sort.active,
    };
    this.sortinsuranceData(sortCriteria);
    this.historytabledata = new MatTableDataSource<IVendorHistory>(this.historydata.historyLogs.slice(0, this.pagesize));
  }

  checkMaxDate(value) {
    if (value == '12/31/9999 11:59:59 PM')
      return null;
    else if (/^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{1,2}:\d{1,2} \w{2}$/.test(value)) {
      return value.substring(0, 9);
    }
    else
      return value;
  }
  dollar(value) {
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    let number = formatter.format(value);
    return number;
  }
  
  getinsurancedatabyid() {
    this.vendorSandbox.getInsuranceDatabyID(this.insuranceId).subscribe(
      data => {
        this.coveragePerClaim = this.dollar((data.vendorInsurance.coveragePerClaim))
        this.coveragePerYear = this.dollar((data.vendorInsurance.coveragePerYear))
        this.insurancedetailsdata = data;
        this.historyFileData = this.insurancedetailsdata.insuranceFileInfo;
        this.insurancedetailsdata.coveragePerClaim = this.coveragePerClaim;
        this.vendorSandbox.getVendorIdList(this.insurancedetailsdata.vendorId);
        this.vendorSandbox.getvendorIdList$.subscribe(
          data => {
       debugger
       this.contactdata = data;
       console.log(this.contactdata);
            if (this.contactdata != undefined) {
              if (this.contactdata.vendorName.preferredName != '' && this.contactdata.vendorName.preferredName != null &&
                this.contactdata.vendorName.preferredName != undefined) {
                this.vendorname = this.contactdata.vendorName.preferredName + " " + this.contactdata.vendorName.lastName + " " + this.contactdata.vendorName.suffix;
              } else {
                this.vendorname = this.contactdata.vendorName.firstName + " " + this.contactdata.vendorName.lastName + " " + this.contactdata.vendorName.suffix;
              }
            }
          },
          error => {
            //this.$broadcast.exception('Please fill all the required details with right format.');
          },
          () => {
            //this.submitted = false;
          });

      },
      error => {
        //this.$broadcast.exception('Please fill all the required details with right format.');
      },
      () => {
        //this.submitted = false;
      });
  }

  public editInsurance(): void {
    this.ds.sendData({'formType': 'insuranceEdit', 'value' : this.insuranceId });
  }

  toTitleCase(str) {
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
  downloadFile(docKey, fileName) {
    this.fileService.getFile(docKey, fileName)
      .subscribe(blob => { saveAs(blob, fileName.split(".", 1) + ".pdf", { type: 'text/plain;charset=windows-1252' }) })
  }
  public goBack() {
    this._location.back();
  }
}
