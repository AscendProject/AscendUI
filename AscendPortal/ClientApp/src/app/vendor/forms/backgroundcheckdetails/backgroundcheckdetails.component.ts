import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Location } from '@angular/common';
import { DialogsService, SessionService } from '../../../shared/services/index';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { BroadcastService } from '../../services/broadcast.service';
import { ConfigService } from '../../../config.service';

@Component({
  selector: 'app-backgroundcheckdetails',
  templateUrl: './backgroundcheckdetails.component.html',
  styleUrls: ['./backgroundcheckdetails.component.scss']
})

export class BackgroundcheckdetailsComponent implements OnInit {

  @Output() closeToggle = new EventEmitter();
  id: string;
  viewBgItem: any;
  vendorId: string;

  constructor(private ds: DataService, public router: Router, public route: ActivatedRoute,
    private _location: Location, private dialogService: DialogsService,
    private vendorSandbox: VendorSandbox, private globalErrorHandler: GlobalErrorHandler,
    public broadService: BroadcastService, public zone: NgZone,
    private configService: ConfigService, ) {
    this.vendorId = this.route.snapshot.params['id'];    
    this.id = this.route.snapshot.params['bid'];        
    //this.vendorId = obj;   

  }
  ngOnInit() {   
    if (this.configService.isReady) {
      this.viewBackgroundCheckItem();
    } else {
      this.viewBackgroundCheckItem();
    }
  }

  

  private viewBackgroundCheckItem(): void {
    console.log(this.vendorId);  
    this.vendorSandbox.viewBackgroundCheckItem(this.id, this.vendorId);
    this.vendorSandbox.viewBackgroundCheckItem$.subscribe(
      data => {        
        this.viewBgItem = data;
        console.log("view bg item ==",this.viewBgItem)
      }, error => this.globalErrorHandler.handleError(error));

  }
  public editBackgroundCheck(): void {
    this.ds.sendData({ 'formType': 'backgroundcheckEdit', 'value': this.id});
  }

  reset() {
    //if (this.insuranceId != undefined) {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {        
        //this.router.navigate(['insurances', this.vendorid]);
        this.router.navigate(['vendor', 'listinsuranceslicenses', this.viewBgItem.vendorId])
        
        this.closeToggle.emit(true);
      } else {
      }
    });

  } 
  //public goBack() {
  //  this._location.back();
  //}
}
