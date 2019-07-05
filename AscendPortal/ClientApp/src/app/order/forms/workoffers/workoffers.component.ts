import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { AssignVendorComponent } from '../assignvendor/index';
import { WorkOffer } from '../../../shared/models/workoffer.model';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'workoffers',
    templateUrl: './workoffers.component.html',
    styleUrls: ['./workoffers.component.scss']
})
export class WorkofferComponent {
    @Input() loaddata: any;
    OrderInfo: any;
    WorkOffers: any;
    WorkOrderId: string;
    routeLinks: any[];
    panelOpenState: boolean = false;
    message: string = "Please Wait...";
    workoffer:any;
    constructor(private orderSandbox: OrderSandbox, public route: ActivatedRoute, 
        private globalErrorHandler: GlobalErrorHandler, private dialog: MatDialog,
        private sanitizer:DomSanitizer) {
        this.route.parent.params.subscribe((params) => {
            this.OrderInfo = undefined;
            this.WorkOffers = undefined;
            this.message = "Please Wait..."
            this.WorkOrderId = params['id'];
            this.getOrderInfo(this.WorkOrderId);

        });
    }

    getWorkOffer(workorderid) {
       // debugger
        if (workorderid != null) {
            this.orderSandbox.getWorkOffersList(workorderid)
            this.orderSandbox.workoffersListForWorkOrder$
                .finally(() => {
                    console.log('unable to get work offer details');
                    //this.message=`No Offers found for Work Order ${this.WorkOrderId}`;
                })
                .subscribe((response) => {
                    if (response) {
                      //  debugger
                        this.WorkOffers = response;
                    }
                }, error => { this.globalErrorHandler.handleError(error); this.message = error.error; });
        }
    }

    getOrderInfo(workorderid) {
        if (workorderid != null) {

            this.orderSandbox.getWorkOrderDataByID(workorderid);
            this.orderSandbox.workorderInfo$
                .finally(() => {
                    console.log('unable to get work order details');
                    //this.message=`No Work Order found with Id ${this.WorkOrderId}`;
                })
                .subscribe((response) => {
                    if (response) {
                        this.OrderInfo = response;
                        this.getWorkOffer(this.WorkOrderId);
                        //console.log(response);
                    }
                }, error => { this.globalErrorHandler.handleError(error); this.message = error.error; });
        }
    }

    loadHtml(docId: string) {
        this.orderSandbox.getHtmlEngagementLetter(docId);
        this.orderSandbox.htmlEngagementLetter$.subscribe((res) => {
            if (res) {
                //debugger
                var windowobj = window.open();
                var document = windowobj.document;
                document.body.innerHTML = res;
                //document.createElement();
            }
        }, (err: any) => {
            debugger
        })


    }

    getHtml(htmlString:string){
        return this.sanitizer.bypassSecurityTrustHtml(htmlString);
    }

    assignVendor(workOffer:WorkOffer) {
        debugger
        const dialogConfig = new MatDialogConfig();
        const left = 0;
        const bottom = 0;
        dialogConfig.position = { left: `${left}px`, top: `${bottom - 50}px`, };
        //{ right: '0', top: '0' };
        dialogConfig.width = '100%';
        dialogConfig.height = '100%'; dialogConfig.panelClass = 'cdk-r-b-overlay';
        
        //this._matDialogRef.updateSize(dialogConfig.width, dialogConfig.height);
        //this._matDialogRef.updatePosition(dialogConfig.position);
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        const workofferId = workOffer.id;
        const workorderId=this.WorkOrderId;
        const workOrderData=this.OrderInfo;
        const workOfferData=workOffer;
        dialogConfig.data = {
            workofferId, workorderId, workOrderData, workOfferData
        };
        const dialogRef = this.dialog.open(AssignVendorComponent,
            dialogConfig);

        dialogRef.afterClosed().subscribe(
            (result) => {
                console.log('Dialog output:', result);
                if(result.assignment=='success' || result.assignment=='alreadyAssigned'){
                    this.WorkOffers = undefined;
                    this.message = "Please Wait while we refresh the work offers list..."
                    this.getWorkOffer(this.WorkOrderId);
                }
            }
            
        );
    }
} 