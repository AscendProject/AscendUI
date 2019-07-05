import { Component, OnInit, Input, ViewChild, EventEmitter, Output, NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router'
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { AppComponent } from '../../../app.component';
import { ConfigService } from '../../../config.service';
import { DetailsComponent } from '../details/details.component';
import { MatSnackBar } from '@angular/material';
import { DataService } from '../../../shared/services/data.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { BackgroundcheckModel, backgroundCheckInfo } from '../../../shared/models/backgroundcheck-model';
import { BroadcastService } from '../../services/broadcast.service';
import { Subscription } from 'rxjs';
import { DialogsService, SessionService } from '../../../shared/services/index';

import {
   SortCriteria
} from '../../../shared/models/insurances-model';

@Component({
  selector: 'app-list-insurances-licenses',
  templateUrl: './list-insurances-licenses.component.html',
  styleUrls: ['./list-insurances-licenses.component.scss'],
  providers: [DetailsComponent]
})
export class ListInsurancesLicensesComponent implements OnInit {

  title = '';
  vendorid: string = '';
  insData: Array<any>;
  licData: Array<any>;
  @Input() isFromVendorService = true;
  public closeInsuranceToggleEvent = false;
  subscription: Subscription;
  isShowMore: boolean = true;
  sortList: backgroundCheckInfo;
  deleteData: any;
  //public bgCheckid;

  /* Mat Table */
  backgroundCheckList: any = [];
  backgroundCheckinfo: any = [];
  dataSource: any;
  displayedColumns = ['referenceID', 'reportDate', 'expirationDate', 'bgCompanyName', 'typeOfbgCheck', 'resultType','isDeleted'];
  backgroundChecktabledata = new MatTableDataSource<any>();
  @ViewChild('bgchechkSort') bgchechkSort: MatSort;
  @ViewChild('backgroundcheckPaginator') backgroundcheckPaginator: MatPaginator;
  public backgroundCheckTable: boolean = true;
  pagesize: number = 5;

  public insuranceDataList = new MatTableDataSource<any[]>();
  public licenseDataList = new MatTableDataSource;
  public insuranceDisplayedColumns = ['policyNumber', 'insuranceType', 'effectiveDate', 'expirationDate', 'lastVerifiedResult'];
  public licenseDisplayedColumns = ['licenseNumber', 'licenseType', 'effectiveDate', 'expirationDate', 'lastVerifiedResult','licenseState'];
  @ViewChild('insuranceSort') insuranceSort: MatSort;
  @ViewChild('licenseSort') licenseSort: MatSort;
  @ViewChild('insurancePaginator') insurancePaginator: MatPaginator;
  @ViewChild('licensePaginator') licensePaginator: MatPaginator;
  public displayLicenseTable: boolean = true;
  public displayInsuranceTable: boolean = true;
  

  constructor(private vendorSandbox: VendorSandbox, private globalErrorHandler: GlobalErrorHandler,
    public router: Router, public activeRoute: ActivatedRoute,
    public appComp: AppComponent, private ds: DataService, public snackBar: MatSnackBar,
    private configService: ConfigService, private detailsComponent: DetailsComponent,
    public broadService: BroadcastService,
    public zone: NgZone,
    private dialogService: DialogsService
  ) {
    this.vendorid = this.activeRoute.snapshot.params['id'];
    this.subscription = this.ds.getData().subscribe(formPageEvent => {
      if (formPageEvent && formPageEvent.formType === 'updateDataList') {
        switch (formPageEvent.value) {
          case "insuranceData":
            this.getInsuranceList();
            break;
          case "licenseData":
            this.getLicenseList();
            break;
        }
      }
    });
    
  }

  ngOnInit() {   
    this.broadService.on<any>('addBackgroundCheckItems').subscribe((obj) => {
      this.zone.run(() => {
        // Angular2 Issue
        console.log(obj);
        if (obj) {
          this.inilizationcalls();
          this.backgroundCheckinfo = [];
        }
      });
    });

    this.inilizationcalls();
    this.backgroundCheckinfo = [];
  }

  private inilizationcalls(): void {
    this.getInsuranceList();
    this.getLicenseList();
    this.getBackgroundCheckList();
    
  }

  public deleteBackgroundCheckDialog(bgCheckid, vendorid): void {
    let dialogRef = this.dialogService.showDialog('Deleting Background Check will remove it from the Vendor profile entirely. Would you like to continue?', 'Yes', '600');
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.deleteBackgroundCheck(bgCheckid, vendorid);
      }
    });
  }
  private deleteBackgroundCheck(bgCheckid, vendorid): void {    
    this.vendorSandbox.deleteBackgroundCheckList(bgCheckid, vendorid);
    this.vendorSandbox.deleteBackgroundCheckList$.subscribe(
      data => {
        this.deleteData = data;
        if (this.deleteData.isSucessful == true) {
          this.getBackgroundCheckList();
        }
      }, error => this.globalErrorHandler.handleError(error));
  }
  

  private getBackgroundCheckList(): void {    
    this.backgroundCheckinfo = [];
    this.vendorSandbox.showBackgroundCheckList(this.vendorid);
    this.vendorSandbox.showBackgroundCheckList$.subscribe(
      data => {
        if (data) {
          this.backgroundCheckList = data;
          for (let bgIndex = 0; bgIndex < this.backgroundCheckList.length; bgIndex++) {
            let obj = <backgroundCheckInfo>{
              backgroundCheckId: this.backgroundCheckList[bgIndex].backgroundCheckId,
              referenceID: this.backgroundCheckList[bgIndex].vendorBackgroundCheck.referenceID,
              bgCompanyName: this.backgroundCheckList[bgIndex].vendorBackgroundCheck.bgCompanyName,
              expirationDate: this.backgroundCheckList[bgIndex].vendorBackgroundCheck.expirationDate,
              reportDate: this.backgroundCheckList[bgIndex].vendorBackgroundCheck.reportDate,
              typeOfbgCheck: this.backgroundCheckList[bgIndex].vendorBackgroundCheck.typeOfbgCheck,
              resultType: this.backgroundCheckList[bgIndex].vendorBackgroundCheck.backgroundCheckResult,
              isDeleted: this.backgroundCheckList[bgIndex].vendorBackgroundCheck.isDeleted,

            }
            this.backgroundCheckinfo.push(obj);
          }          
          this.backgroundChecktabledata = new MatTableDataSource<BackgroundcheckModel>(this.backgroundCheckinfo);
          this.backgroundChecktabledata.sort = this.bgchechkSort;

          this.backgroundChecktabledata.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
            if (typeof data[sortHeaderId] === 'string') {
              return data[sortHeaderId].toLocaleLowerCase();
            }

            return data[sortHeaderId];
          };

          this.backgroundChecktabledata.paginator = this.backgroundcheckPaginator;
          this.backgroundCheckTable = true;



        } else {
          this.backgroundCheckTable = false;
        }
      }, error => this.globalErrorHandler.handleError(error));
    
  }


  private getInsuranceList(): void {
    this.vendorSandbox.showInsuranceList(this.vendorid);
    this.vendorSandbox.showInsurancesList$.subscribe((insuranceDataList) => {
      if (insuranceDataList) {
        this.insuranceDataList = new MatTableDataSource(insuranceDataList);
        this.insuranceDataList.sort = this.insuranceSort;

        this.insuranceDataList.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }

          return data[sortHeaderId];
        };


        this.insuranceDataList.paginator = this.insurancePaginator;
        this.displayInsuranceTable = true;

      } else {
        this.displayInsuranceTable = false;
      }

    }, error => this.globalErrorHandler.handleError(error));
  }

  private getLicenseList(): void {
    this.vendorSandbox.showLicenseList(this.vendorid);
    this.vendorSandbox.showLicensesList$.subscribe((licenseDataList) => {
      if (licenseDataList) {
        this.licenseDataList = new MatTableDataSource(licenseDataList);
        this.licenseDataList.sort = this.licenseSort;

        this.licenseDataList.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }

          return data[sortHeaderId];
        };


        this.licenseDataList.paginator = this.licensePaginator;
        this.displayLicenseTable = true;
      } else {
        this.displayLicenseTable = false;
      }
    }, error => this.globalErrorHandler.handleError(error));
  }


  public addlicense(): void {
    this.ds.sendData({ 'formType': 'license', 'value': null });
  }

  public addinsurances(): void {
    this.ds.sendData({ 'formType': 'insurance', 'value': null });
  }
  public addbackgroundcheck(): void {
    this.ds.sendData({ 'formType': 'backgroundcheck', 'value': null });
  }
  public navigativeBackgrounddetails(backgroundCheckId): void {    
  //  alert(this.vendorid);   
    this.router.navigate(['vendor', 'backgroundcheckdetails', this.vendorid, backgroundCheckId]);
  }

  chipColor(scolor) {
    switch (scolor) {
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
