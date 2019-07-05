import { Component, OnInit, Output, EventEmitter, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router'
import { DialogsService } from '../../../shared/services/dialogs.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AdvansearchModel } from '../../../shared/models/advansearch-model';
import { BroadcastService } from '../../services/broadcast.service';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { VendorAdvSearchQuery, showAdvancedSearchInfo, IAdvancedSearchResponse } from '../../../shared/models/vendor.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-vendor-advanced-search',
  templateUrl: './vendor-advanced-search.component.html',
  styleUrls: ['./vendor-advanced-search.component.scss']
})
export class VendorAdvancedSearchComponent implements OnInit {
  @Output() closeToggle = new EventEmitter();
  panelOpenState = false;
  public states: string[];
  public services: string[];
  @ViewChild('advanceSearchSort') advanceSearchSort: MatSort;
  @ViewChild('advanceSearchPaginator') advanceSearchPaginator: MatPaginator;

  //advancesearchtabledata = new MatTableDataSource<any>();
  advancesearchtabledata = new MatTableDataSource([]);
  advancedSearchData: any;
  showAdvancedSearchinfo: any = [];
  public isAdvanceSearchTableData: boolean = true;
  vendorAdvSearchColumns = ['vendorId',  'firstName', 'middleName', 'lastName',
    'preferredName'];
  advSearchTableLength: number = 0;
  vendorparamId: string ='';
  public advanceSearchFormGroup: FormGroup;
  stateArr = [];
  serviceTypeArr = [];
  key: string;
  keystart: string;
  keyend : string;
  
  constructor(public dialog: DialogsService, public $fb: FormBuilder,
    public broadService: BroadcastService,
    public zone: NgZone, private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler, 
    public router: Router, public activeRoute: ActivatedRoute) {
      this.vendorparamId = this.activeRoute.snapshot.params['id'];
  }
  
  ngOnInit() {
    this.broadService.on<any>('vendoradvancesearch').subscribe((itemId) => {
      this.zone.run(() => {
        //this.isAdded = item;
      });
    });
    this.inilizationcalls();
  }
  
  private inilizationcalls(): void {
    this.advanceSearchForm();
    //this.onClickAdvancedSearch();
  }
  advanceSearchForm() {
    this.states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC',
      'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA',
      'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH',
      'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
      'TX', 'UT', 'VT', 'VA', 'WA', 'WI', 'WV', 'WY', 'AS', 'FM', 'GU', 'MH', 'MP',
      'PI', 'PW'];
    this.services = ['Appraisal', 'Broker'];
    this.advanceSearchFormGroup = this.$fb.group({
      vendorId: [],
      licenseNumbers:[],
      firstName: [],
      lastName: [],
      middleName: [],
      preferredName: [],
      emails: [],
      phoneNumbers: [],
      streetAddresses: [],
      zipcodes: [],
      cities:[],
      states: [],
      serviceTypes: []
    });
  }


  /* Cancel Button Click Event */
  AdvanceSearchToggleClose() {
    let dref = this.dialog.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      //console.log(`Dialog closed: ${result}`);
      if (result) {
        //this.myForm.resetForm();
        // this.ngOnInit();
        this.closeToggle.emit(true);
      } else {
      }
    });
  }
  
  getStates(stateValue){
    this.stateArr = stateValue;
  }
  getServiceTypes(serviceTypeValue){
    this.serviceTypeArr = serviceTypeValue;
  }
  /* Function to display table data */
  onClickAdvancedSearch(){
    this.showAdvancedSearchinfo =[];
    this.getAdvancedSearchInfo();
  }
  isColumnValid(columnName){
    let columnValue=this.advanceSearchFormGroup.get(columnName).value
      return  (columnValue != null) && (columnValue != "undefined") && (columnValue != '')
  }
  formSearchString(columnName){
    if(!this.isColumnValid(columnName)) return;
     if ( this.keystart.slice(-1) != "["){this.keystart = this.keystart + " and "; }
    this.keystart = this.keystart + columnName + " eq '" + this.advanceSearchFormGroup.get(columnName).value + "'";
  }
  formSearchStringForCollection(columnName){
    if(!this.isColumnValid(columnName)) return;
    if (  this.keystart.slice(-1) != "["){this.keystart = this.keystart + " and "; }
    //this.keystart = this.keystart + "(" + columnName + "/any(em:em " + "eq '" + this.advanceSearchFormGroup.get(columnName).value + "'))";
    this.keystart = this.keystart + this.frameODataParam(columnName,this.advanceSearchFormGroup.get(columnName).value);
  }
  frameODataParam(filter,filterValue){
    return "(" + filter + "/any(em:em " + "eq '" + filterValue + "'))"
  }
  getAdvancedSearchInfo(){
    this.keystart = "["; this.keyend = "]";
    this.formSearchString("vendorId");
    this.formSearchString("firstName");
    this.formSearchString("middleName");
    this.formSearchString("lastName");
    this.formSearchString("preferredName");
        
    this.formSearchStringForCollection("emails");
    this.formSearchStringForCollection("phoneNumbers");
    this.formSearchStringForCollection("streetAddresses");
    this.formSearchStringForCollection("zipcodes");
    this.formSearchStringForCollection("cities");
    this.formSearchStringForCollection("licenseNumbers");
   
    if(this.isColumnValid("states")){
      for(let stateIndex=0;stateIndex<this.stateArr.length;stateIndex++){
      var lastChar = this.keystart.slice(-1);
      if ( lastChar != "["){this.keystart = this.keystart + " and "; }
      this.keystart = this.keystart + this.frameODataParam("states",this.stateArr[stateIndex]);
      }
    }
    if(this.isColumnValid("serviceTypes")){
      for(let servicetypeIndex=0;servicetypeIndex<this.serviceTypeArr.length;servicetypeIndex++){
      var lastChar = this.keystart.slice(-1);
      if ( lastChar != "["){this.keystart = this.keystart + " and "; }
      this.keystart = this.keystart + this.frameODataParam("serviceTypes",this.serviceTypeArr[servicetypeIndex]);;
      }
    }
    
    this.key = this.keystart + this.keyend;
    this.key = this.key.substring(1, this.key.length-1);
    //console.log('search key: ' + this.key);

    let queryData = <VendorAdvSearchQuery>{
      search: "*",
      searchFields: "vendorId,licenseNumbers,firstName,middleName,lastName,preferredName,emails,phoneNumbers",
      select: "vendorId,licenseNumbers,firstName,middleName,lastName,preferredName,emails,phoneNumbers,streetAddresses,cities,states,company,companyState,zipcodes,serviceTypes",
      filter : this.key
    }

      this.vendorSandbox.getVendorAdvancedSearchResults(queryData);
      this.vendorSandbox.getVendorAdvancedSearchResults$.subscribe(
        data => {
        if (data) {
          this.advancedSearchData = data.value; 
          //console.log('this.advancedSearchData: ' + JSON.stringify(this.advancedSearchData));
          //console.log('length' + this.advancedSearchData.length);
          for (let advsearchIndex = 0; advsearchIndex < this.advancedSearchData.length; advsearchIndex++) {
            let obj = <showAdvancedSearchInfo>{
              vendorId:this.advancedSearchData[advsearchIndex].vendorId,
              firstName: this.advancedSearchData[advsearchIndex].firstName,
              middleName: this.advancedSearchData[advsearchIndex].middleName,
              lastName: this.advancedSearchData[advsearchIndex].lastName,
              preferredName: this.advancedSearchData[advsearchIndex].preferredName
            }
            this.showAdvancedSearchinfo.push(obj);
          }
          this.advancesearchtabledata = new MatTableDataSource<IAdvancedSearchResponse>(this.showAdvancedSearchinfo);
          this.advSearchTableLength = this.advancesearchtabledata.filteredData.length;
          //if(this.advancedSearchData.length > 0 ){
            if(this.advancesearchtabledata.filteredData.length){
            this.isAdvanceSearchTableData = false;
            //this.advanceSearchFormGroup.reset();
          }
          else {this.isAdvanceSearchTableData = true; }
          this.advancesearchtabledata.sort = this.advanceSearchSort;
  
          this.advancesearchtabledata.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
            if (typeof data[sortHeaderId] === 'string') {
              return data[sortHeaderId].toLocaleLowerCase();
            }
  
            return data[sortHeaderId];
          };
  
           this.advancesearchtabledata.paginator = this.advanceSearchPaginator;
        }
        
      }, error => this.globalErrorHandler.handleError(error))
  }
  onClickHyperLink(vendorid){
    this.closeToggle.emit(true);
    this.broadService.broadcast('vendoradvancesearch', vendorid);
  }
}
