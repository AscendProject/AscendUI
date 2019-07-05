import { Component, OnInit, Input, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';

import {
  IVendorLicense, IVendorLicenseModel
} from '../../../shared/models/license-model';
import {
  IVendorHistory, SortCriteria
} from '../../../shared/models/insurances-model';

import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
import { ConfigService } from '../../../config.service';
import { debug } from 'util';
import { DataService } from '../../../shared/services/data.service';
import { Location } from '@angular/common';

import { AddDisciplinaryComponent } from '../add-disciplinary';
import { DialogsService } from '../../../shared/services/index';
import { BroadcastService } from '../../services/broadcast.service';
import { FileUploaderService, FileQueueObject } from '../../../shared/services/file-uploader.service';
import { saveAs } from 'file-saver';
import { MatSort, MatSortModule, MatTableDataSource, MatPaginator } from '@angular/material';
import { showDisciplinaryInfo, IShowDisciplinary, deleteDisciplinaryAction } from '../../../shared/models/disciplinary-model';


@Component({
  selector: 'app-licensedetails',
  templateUrl: './licensedetails.component.html',
  styleUrls: ['./licensedetails.component.scss']
})
export class LicensedetailsComponent implements OnInit {
  licenseId: string = '';
  licensedetailsdata: any;
  vendorname: string = '';
  contactdata: any; 
  historydata: any;
  pagesize: number = 5;
  historyFileData: any = [];
  deleteData: any;
  showDisciplinaryinfo: any = [];
  //pagesize: number = 5;
  disciplinaryColumns = ['disciplinaryAction', 'activeResolved', 'effectiveDate', 'expirationDate', 'comments', 'isDeleted'];
  disciplinaryActionData: any;
    //disciplinaryActionTableData: any;
  disciplinaryActionTableData = new MatTableDataSource<any>();
  public isdisciplinaryActionTable: boolean = true;
  @ViewChild('disciplinarySort') disciplinarySort: MatSort;
  @ViewChild('disciplinaryPaginator') disciplinaryPaginator: MatPaginator;
  dataSource: any;
  displayedColumns = ['propertyName', 'oldValue', 'newValue', 'changedBy', 'timestamp'];
  historytabledata = new MatTableDataSource<any>();
  @ViewChild('historySort') historySort: MatSort;

  public displayHistroyTable = true;
  @ViewChild(MatSort) sort: MatSort;
  isShowMore: boolean = true;
  tid: any;
  vendorId: String;
  constructor(private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    public router: Router,
    public appComp: AppComponent,
    public route: ActivatedRoute,
    private configService: ConfigService,
    public fileService: FileUploaderService,
    private ds: DataService,
      private _location: Location,
      private addDisciplinaryDialog: DialogsService,
      public broadService: BroadcastService, public zone: NgZone 
  ) {
    
    this.licenseId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.broadService.on<any>('adddisciplinarycallback').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
        console.log(obj);
        if (obj) {
          this.getDisciplinaryActionList();
          this.showDisciplinaryinfo  = [];
        }
      });
    });
    this.broadService.on<any>('editdisciplinarycallback').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
        console.log(obj);
        if (obj) {
          this.getDisciplinaryActionList();
          this.showDisciplinaryinfo  = [];
        }
      });
    });

    this.fetchHistoryDetails();
        this.getliciencedatabyid();
        this.getDisciplinaryActionList();
        //this.disciplinaryActionTableData.sort = this.disciplinarySort;
  }

  public deleteDisciplinaryDialog(diciplinaryActionId): void {
    let dialogRef = this.addDisciplinaryDialog.showDialog('Are you sure you want to delete this Disciplinary Action ?', 'Yes', '600');
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.deleteDisciplinaryAction(diciplinaryActionId,this.vendorId);
      }
    });
  }
  private deleteDisciplinaryAction(vendorId, diciplinaryActionId): void {
    this.vendorSandbox.deleteDisciplinaryActionList(diciplinaryActionId, vendorId);
    this.vendorSandbox.deleteDisciplinaryActionList$.subscribe((data) => {
        this.deleteData = data;
        if (this.deleteData.isSuccessful == true) {
          this.getDisciplinaryActionList();
         
        }
      }, error => this.globalErrorHandler.handleError(error));
  }

  private getDisciplinaryActionList(): void {
    this.showDisciplinaryinfo = [];
    this.vendorSandbox.showDisciplinaryActionList(this.licenseId);
    this.vendorSandbox.showDisciplinaryActionList$.subscribe(
      data => {
        if (data) {
        this.disciplinaryActionData = data; 
        for (let i = 0; i < this.disciplinaryActionData.length; i++) {
          let obj = <showDisciplinaryInfo>{
            diciplinaryActionId:this.disciplinaryActionData[i].diciplinaryActionId,
            disciplinaryAction: this.disciplinaryActionData[i].diciplinaryAction.disciplinaryAction,
            activeResolved: this.disciplinaryActionData[i].diciplinaryAction.activeResolved,
            effectiveDate: this.disciplinaryActionData[i].diciplinaryAction.effectiveDate,
            expirationDate: this.disciplinaryActionData[i].diciplinaryAction.expirationDate,
            comments: this.disciplinaryActionData[i].diciplinaryAction.comments,
             isDeleted: this.disciplinaryActionData[i].diciplinaryAction.isDeleted
            }
          this.showDisciplinaryinfo.push(obj);
          //console.log(this.showDisciplinaryinfo);
        }
        this.disciplinaryActionTableData = new MatTableDataSource<IShowDisciplinary>(this.showDisciplinaryinfo);
        if(this.disciplinaryActionTableData.filteredData.length){
          this.isdisciplinaryActionTable = true;
        }
        else {this.isdisciplinaryActionTable = false; }
        this.disciplinaryActionTableData.sort = this.disciplinarySort;

        this.disciplinaryActionTableData.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }
          return data[sortHeaderId];
        };

        this.disciplinaryActionTableData.paginator = this.disciplinaryPaginator;
      }
      
    }, error => this.globalErrorHandler.handleError(error));
  }

  downloadFile(docKey, fileName) {
    this.fileService.getFile(docKey, fileName)
      .subscribe(blob => { saveAs(blob, fileName.split(".", 1) + ".pdf", { type: 'text/plain;charset=windows-1252' }) })
  }
  
   getliciencedatabyid() {
    
    this.vendorSandbox.getVendorIdList(this.licenseId);
    this.vendorSandbox.getLicienceDatabyID(this.licenseId).subscribe(
      data => {
      
        this.licensedetailsdata = data;
        this.historyFileData = this.licensedetailsdata.licenseFileInfo;
        this.vendorId = this.licensedetailsdata.vendorId;
        this.vendorSandbox.getVendorIdList(this.licensedetailsdata.vendorId);
        this.vendorSandbox.getvendorIdList$.subscribe(
          data => {
            this.contactdata = data;
            if (this.contactdata != undefined) {
              if (this.contactdata.vendorName.preferredName != '' && this.contactdata.vendorName.preferredName != null && this.contactdata.vendorName.preferredName != undefined) {
                this.vendorname = this.contactdata.vendorName.preferredName + " " + this.contactdata.vendorName.lastName + " " + this.contactdata.vendorName.suffix;
              } else {
                this.vendorname = this.contactdata.vendorName.firstName + " " + this.contactdata.vendorName.lastName + " " + this.contactdata.vendorName.suffix;
              }
            }
          },
          error => {
            this.globalErrorHandler.handleError(error);
          },
          () => {
            //this.submitted = false;
          });

      },
      error => {
        this.globalErrorHandler.handleError(error)
      },
      () => {
        // this.submitted = false;
      });
  }

   fetchHistoryDetails() {
     this.vendorSandbox.getHistory(this.licenseId, 100000).subscribe(
       data => {
         this.historydata = data;
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
    debugger;
     var sortCriteria: SortCriteria = {
       sortDirection: this.historySort.direction,
       sortColumn: this.historySort.active,
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


  editLicense() {
    const id = this.licenseId;
    
    this.router.navigate(['vendor/license', id]);

  
    this.ds.sendData({ 'formType': 'licenseEdit', 'value': this.licenseId });
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

  public goBack() {
    this._location.back();
    }
    addDisciplinary() {
        this.addDisciplinaryDialog.showAddDisciplinaryDialog
          (this.vendorId, this.licenseId, 'Save', '800');

  }
  onClickHyperLink(disciplinaryActionId){
      this.addDisciplinaryDialog.viewDisciplinaryDialog
      (this.vendorId, this.licenseId, disciplinaryActionId, '800');
  }
}

