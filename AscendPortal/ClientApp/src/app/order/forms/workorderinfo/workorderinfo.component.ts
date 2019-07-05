import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { OrderSandbox } from '../../order.sandbox';
import { WorkOrder, WorkOrderModel } from '../../../shared/models/workorder.model';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
@Component({
    selector: 'workorderinfo',
    templateUrl: './workorderinfo.component.html',
    styleUrls: ['./workorderinfo.component.scss']
})
export class WorkOrderInfoComponent {
    @Input() loaddata: any;
    OrderInfo: any;
    VendorDetails: any;
    VendorId: string;
    routeLinks: any[];
    workorderid: string;
    constructor(public route: ActivatedRoute,
        private orderSandbox: OrderSandbox,
        private globalErrorHandler: GlobalErrorHandler) {
        // this.route.parent.url.subscribe((urlPath) => {
        //     this.workorderid = urlPath[0].path;
        //     this.getOrderInfo(this.workorderid);
        // });
        this.route.parent.params.subscribe((params) => {
            console.log(params);
            this.workorderid = params['id'];
            this.getOrderInfo(this.workorderid);
        });
    }
    // ngOnInit() {
    //     this.getOrderInfo(this.workorderid);
    // }

    getOrderInfo(workorderid) {
        if (workorderid != null) {
            this.orderSandbox.getWorkOrderDataByID(workorderid);
            this.orderSandbox.workorderInfo$.subscribe((response) => {
                if (response) {
                    this.OrderInfo = response;
                    console.log(response);
                    this.getVendorInfo(this.OrderInfo.vendorId);
                }
            }, error => this.globalErrorHandler.handleError(error));
        }
    }

    getVendorInfo(vendorid) {
        this.VendorDetails = undefined;
        if (vendorid != null) {
            this.orderSandbox.getVendorInfo(vendorid);
            this.orderSandbox.vendorInfo$.subscribe((response) => {
                if (response) {
                    this.VendorDetails = response;
                }

            }, error => this.globalErrorHandler.handleError(error));
        }
    }
}





