import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorSandbox } from '../../vendor.sandbox';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DataService } from '../../../shared/services/index';

@Component({
  selector: 'app-activeinsurancelicense',
  templateUrl: './activeinsurancelicense.component.html',
  styleUrls: ['./activeinsurancelicense.component.scss']
})
export class ActiveinsurancelicenseComponent implements OnInit {

  constructor(public router: Router, public route: ActivatedRoute, private vendorSandbox: VendorSandbox, private ds: DataService) {
    this.vendorId = this.route.snapshot.params['id'];
  }
  vendorId: string = '';
  insData: Array<any>;
  licData: Array<any>;
  todaydate = new Date();
  sortingInsData: Array<any> = [];
  sortingLicData: Array<any> = [];
  activeIns: Array<any> = [];
  activeLic: Array<any> = [];
  ifShowMoreLic: boolean = false;
  ifShowMoreIns: boolean = false;

  private insuranceDataList = [];
  private insuranceFilteredDataList = [];
  private licenseDataList = [];
  private licenseFilteredDataList = [];
  public activeInsuranceList = new MatTableDataSource<any[]>();
  public activeLicenseList = new MatTableDataSource<any[]>();
  public insuranceDisplayedColumns = ['policyNumber', 'insuranceType', 'effectiveDate', 'expirationDate', 'lastVerifiedResult'];
  public licenseDisplayedColumns = ['licenseNumber', 'licenseType', 'effectiveDate', 'expirationDate', 'lastVerifiedResult'];
  @ViewChild('insuranceSort') insuranceSort: MatSort;
  @ViewChild('licenseSort') licenseSort: MatSort;
  @ViewChild('insurancePaginator') insurancePaginator: MatPaginator;
  @ViewChild('licensePaginator') licensePaginator: MatPaginator;
  public displayLicenseTable: boolean = true;
  public displayInsuranceTable: boolean = true;
  ngOnInit() {
      this.getInsuranceList();
      this.getLicenseList();
  }

  private getInsuranceList(): void {

    this.vendorSandbox.showInsuranceList(this.vendorId);
    this.vendorSandbox.showInsurancesList$.subscribe((insuranceDataList) => {
      if (insuranceDataList) {     
        for (var i = 0; i < insuranceDataList.length; i++) {
          let newExpirationDate = new Date(insuranceDataList[i].expirationDate);
          let newEffectiveDate = new Date(insuranceDataList[i].effectiveDate)
          if ((newExpirationDate > this.todaydate) && (newEffectiveDate < this.todaydate)) {
            this.insuranceFilteredDataList.push(insuranceDataList[i]);
          }
        }
        debugger;
        this.activeInsuranceList = new MatTableDataSource(this.insuranceFilteredDataList);
        this.activeInsuranceList.paginator = this.insurancePaginator;
        this.activeInsuranceList.sort = this.insuranceSort;
        this.displayInsuranceTable = this.insuranceFilteredDataList.length > 0 ? true : false;
      } else {
        this.displayInsuranceTable = false;
      }
    });
  }

  private getLicenseList(): void {
    this.vendorSandbox.showLicenseList(this.vendorId);
    this.vendorSandbox.showLicensesList$.subscribe((licenseDataList) => {
      if (licenseDataList) {
        for (var i = 0; i < licenseDataList.length; i++) {
          let newExpirationDate = new Date(licenseDataList[i].expirationDate);
          let newEffectiveDate = new Date(licenseDataList[i].effectiveDate)
          if ((newExpirationDate > this.todaydate) && (newEffectiveDate <= this.todaydate)) {
            this.licenseFilteredDataList.push(licenseDataList[i]);
          }
        }
        this.activeLicenseList = new MatTableDataSource(this.licenseFilteredDataList);
        this.activeLicenseList.paginator = this.licensePaginator;
        this.activeLicenseList.sort = this.licenseSort;
        this.displayLicenseTable = this.licenseFilteredDataList.length > 0 ? true : false;
      } else {
        this.displayLicenseTable = false;
      }
    });
  }

  public addLicense(): void {
    this.ds.sendData({ 'formType': 'license', 'value': null });
  }

  public addInsurances(): void {
    this.ds.sendData({ 'formType': 'insurance', 'value': null });
  }

  public chipColor(color): string {
    switch (color) {
      case 'Pass':
        return 'text-success';
      case 'Fail':
        return 'text-danger';
      case 'Pending':
        return 'text-warning';
      default:
        break;
    }
  }

}
