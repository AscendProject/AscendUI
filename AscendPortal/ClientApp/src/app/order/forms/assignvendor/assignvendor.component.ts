import { Component, OnInit, Inject,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { VendorDetailsList } from '../../../shared/models/vendor.model';
import { WorkOfferModel, WorkOffer, Link } from '../../../shared/models/workoffer.model';
import { DialogsService } from '../../../shared/services/index';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { WorkofferComponent } from '../workoffers/index';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';

import 'rxjs/add/observable/interval';

@Component({
    selector: 'assignvendor',
    templateUrl: './assignvendor.component.html',
    styleUrls: ['./assignvendor.component.scss']
})
export class AssignVendorComponent implements OnInit,OnDestroy  {
    VendorsList: VendorDetailsList;
    workorderid: string;
    vendorIdToBeAssigned: string;
    workofferid: string = null;
    workOffer: any;
    routeLinks: any[];
    WOInfo: any;
    alive:boolean;
    assignemntStatusLink:any;
    showSpinner:boolean;

    selectionUrl: string;
    selectedstatusUrl = "http://orderfulfillment-vendorselectionorchestration.azurewebsites.net/admin/extensions/DurableTaskExtension/instances/3163ca1ef4004c52934bcb7811ad2f65?taskHub=VendorSelectionHub&connection=Storage&code=JK6U9umT70LAmMT/HRqpHJJJinFIq3b2lF4WtufF5b/AekHVZzC9Bg==";

    constructor(private http: HttpClient, private orderSandbox: OrderSandbox, private globalErrorHandler: GlobalErrorHandler,
        public dialogservice: DialogsService, public dialogRef: MatDialogRef<WorkofferComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        //this.dialogRef.

        this.workofferid = data.workofferId;
        this.workorderid = data.workorderId;
        this.workOffer=data.workOfferData;
        this.WOInfo=data.workOrderData;
        this.getRankedVendorsByWorkOfferId(this.workorderid);
        //this.getWorkOrderInfo(this.workorderid);
        //this.getWorkOffer();
        console.log(data);
    }
    ngOnInit() {
        this.alive=true;
        this.showSpinner=false;
    }
    getWorkOffer() {
        this.orderSandbox.getWorkOfferDetails(this.workofferid);
        this.orderSandbox.workofferInfo$.subscribe((response) => {
            debugger
            if (response) {
                this.workOffer = response;
            }
        }, error => this.globalErrorHandler.handleError(error));

    }
    getRankedVendorsByWorkOfferId(workorderid) {

        this.orderSandbox.getVendorListByWorkOrderID(workorderid);
        this.orderSandbox.vendorDetails$.subscribe((response) => {
            if (response) {
                this.VendorsList = response;
            }
        }, error => this.globalErrorHandler.handleError(error));
    }
    getWorkOrderInfo(workorderid) {
        if (workorderid != null) {
            this.orderSandbox.getWorkOrderDataByID(workorderid);
            this.orderSandbox.workorderInfo$.subscribe((response) => {
                if (response) {
                    this.WOInfo = response;
                    console.log(response);
                }
            }, error => this.globalErrorHandler.handleError(error));
        }
    }
    assignedVendor(vendor:any) {
        debugger
        const msg:string=`Are you sure you want to assign ${vendor.firstName} (${vendor.vendorId}) to Work Order ${this.WOInfo.id}?`
        const title:string=vendor.autoSelect==false?'Vendor is in Exclusion List':null;
        /*const result = this.dialogservice.confirm(title,msg, 'yes');
        result.subscribe((data) => {
            debugger
            if (data === true) {
                
                if (this.workOffer.links != null) {
                    
                    let selectionUrl=null;
                    this.workOffer.links.forEach(function (value) {
                        if (value.type == 'selectionStatus') {
                            debugger
                            selectionUrl=value.url;
                           
                        }
                    });
                    //selectionUrl="http://localhost:7071/admin/extensions/DurableTaskExtension/instances/6a8314f9c3dc4a469b924f5f5e1079d1?taskHub=VendorSelectionHub&connection=Storage&code=h1XgrQZK0MrZK8QENUkn42mWCJVm3j6AOdR9VtOhlrV9fCWG1JLEJg==";
                    this.getSelectionStatus(selectionUrl, vendor.vendorId);                    
                    // if(selectionUrl!=null)
                    //     this.getSelectionStatus(selectionUrl, vendor.vendorId);
                    // else{
                    //     //show error
                    //     console.log('No Selection URL');
                    // }
                }

            }
        }, error => this.globalErrorHandler.handleError(error));*/

    }


    getSelectionStatus(url: string, vendorid: string) {
        //debugger
        this.vendorIdToBeAssigned=vendorid;
        this.orderSandbox.getWorkOfferSelectStatus(url);
        this.orderSandbox.workofferSelectStatus$.subscribe((response) => {
            //debugger
            if (response) {
                console.log(response);
                if(response.runtimeStatus=="Running"){
                    let linksCol:Array<any>=this.workOffer.links;
                    let selectionLink=linksCol.find((link)=>{
                        return link.type == 'selection';
                    });
                    // selectionLink={
                    //     url:"http://localhost:7071/admin/extensions/DurableTaskExtension/instances/6a8314f9c3dc4a469b924f5f5e1079d1/raiseEvent/ManualAssignment?taskHub=VendorSelectionHub&connection=Storage&code=h1XgrQZK0MrZK8QENUkn42mWCJVm3j6AOdR9VtOhlrV9fCWG1JLEJg=="
                    // }
                    if(selectionLink!=null && selectionLink!=undefined){
                        this.showSpinner=true;
                        this.AssignVendorToWorkOffer(selectionLink.url,vendorid);
                    }                    
                }
                else{
                    this.vendorIdToBeAssigned=undefined;
                    //show error
                   /* if(response.runtimeStatus=="Completed"){
                        this.dialogservice.errorAlert("Vendor Assignment Error","Vendor assignment is already completed for this offer");
                    }
                    else{
                        this.dialogservice.errorAlert("Vendor Assignment Error","Error occured during Vendor assignemnt. Please contact administrator.");
                    }*/
                }
                //if(response.RuntimeStatus)
                // this.workOffer.links.forEach(function (value) {
                //     if (value.type == 'selection') {
                //         this.AssignVendorToWorkOffer(value.url, vendorid);
                //     }
                // });
            }
        }, error => this.globalErrorHandler.handleError(error));
    }

    AssignVendorToWorkOffer(url: string, vendorid: string) {
        //this.selectionUrl = url; // "http:/ / orderfulfillment - vendorselectionorchestration.azurewebsites.net / admin / extensions / DurableTaskExtension / instances / 3163ca1ef4004c52934bcb7811ad2f65 / raiseEvent / ManualAssignment ? taskHub = VendorSelectionHub & connection=Storage & code=JK6U9umT70LAmMT / HRqpHJJJinFIq3b2lF4WtufF5b / AekHVZzC9Bg == ";
        //debugger
        
        this.orderSandbox.AssignVendorToWorkOffer(this.workofferid, vendorid, url).subscribe((response) => {
            //debugger
            if (response) {
                if(response.status==202){
                    let linksCol:Array<any>=this.workOffer.links;
                        this.assignemntStatusLink=linksCol.find((link)=>{
                            return link.type == 'selectionStatus';
                        });
                        IntervalObservable.create(2000)
                        .takeWhile(() => this.alive)
                        .subscribe( ()=>{
                            this.orderSandbox.getWorkOfferSelectStatus(this.assignemntStatusLink.url);
                            this.orderSandbox.workofferSelectStatus$.subscribe((response) => {
                                if(response.runtimeStatus=="Completed"){
                                    this.showSpinner=false;
                                    this.alive=false;
                                  /*  this.dialogservice.errorAlert("Vendor Assignment Success","Vendor Assignment Completed").subscribe((userCLickedOkay)=>{
                                        console.log(userCLickedOkay);                                        
                                        this.dialogRef.close({assignment:'success'});                       
                                       
                                    });*/
                                  
                                }
                                if(response.runtimeStatus=="Failure"){
                                    this.showSpinner=false;
                                   // this.dialogservice.errorAlert("Vendor Assignment Error","Error occured during Vendor assignemnt. Please contact administrator.")
                                    this.alive=false;
                                    this.dialogRef.close({assignment:'error'});
                                 }
                                
                            });
                        });
                    
                   
                }
                else if(response.status==410){
                    this.showSpinner=false;
                   /* this.dialogservice.errorAlert("Vendor Assignment Error","Vendor assignment is already completed for this offer").subscribe((userCLickedOkay)=>{
                        console.log(userCLickedOkay);
                        this.dialogRef.close({assignment:'alreadyAssigned'});
                    })*/
                }

            }
        }, error => this.globalErrorHandler.handleError(error));
        //this.orderSandbox.workofferSelectStatus$
        
    }

    checkForAssignmentProcessCompletion(statusUrl:string){
        
    }


    onCancelClick(): void {
        this.dialogRef.close({assignment:'cancel'});
    }

    ngOnDestroy(){
        this.alive = false; // switches IntervalObservable off
    }
}