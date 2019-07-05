import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IVendorAddress, IVendorInsurance, IVendorName, IVendorInsuranceModel, IVendorHistory, SortCriteria
} from '../../../shared/models/insurances-model';
import { VendorSandbox } from '../../vendor.sandbox';
import { ConfigService } from '../../../config.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSort, MatTableDataSource  } from '@angular/material';

@Component({
  selector: 'app-contactpage-audit-history',
  templateUrl: './contactpage-audit-history.component.html',
  styleUrls: ['./contactpage-audit-history.component.css']
})


export class ContactpageAuditHistoryComponent implements OnInit {
  dataSource: any;
  displayedColumns = ['propertyName', 'newValue', 'oldValue','timestamp'];
  historydata: any;
  historytabledata: any;
  pagesize: number = 5;
  insuranceId: any;
  @ViewChild(MatSort) sort: MatSort;
  isShowMore: boolean = true;
  tid: any;
 

  
  constructor(private vendorSandbox: VendorSandbox, private configService: ConfigService, public route: ActivatedRoute) {
    this.insuranceId = this.route.snapshot.params['id'];
  }
  
  ngOnInit() {
    console.log('Configuration ready: ' + this.configService.isReady);
    if (this.configService.isReady) {      
      this.fetchHistoryDetails();
    
    } else {
      this.configService.settingsLoaded$.subscribe(x => {
        //debugger

       this.fetchHistoryDetails();
       
      
      });
    }
  }

  addSpaces(input) {
    var result = input.replace(/([A-Z]+)/g, " $1").replace(/^ /, " ");
    return result;
  }

  fetchHistoryDetails() {    
    this.vendorSandbox.getHistory(this.insuranceId, 100000).subscribe(
      data => {        
        this.historydata = data;
        console.log(this.historydata);
        this.historytabledata = new MatTableDataSource<IVendorHistory>(this.historydata.historyLogs.slice(0, this.pagesize));

      }, error => { },
      () => {        
        
       
      });
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
     // this.historytabledata.sort = this.sort;
      //this.isShowMore = false;
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


  

getRecord()
{

  var sortCriteria: SortCriteria = {
    sortDirection: this.sort.direction,
    sortColumn: this.sort.active,
  };  
  this.sortinsuranceData(sortCriteria);  
  this.historytabledata = new MatTableDataSource<IVendorHistory>(this.historydata.historyLogs.slice(0, this.pagesize)); 
  }
}







