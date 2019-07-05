import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
@Component({
    selector: 'serviceorder',
    templateUrl: './serviceorder.component.html',
    styleUrls: ['./serviceorder.component.scss']
})
export class ServiceOrderComponent {
    workorderid: string;
    SOinfo: any;
    message:string="Please Wait...";
    constructor(public route: ActivatedRoute,
        private orderSandbox: OrderSandbox,
        private globalErrorHandler: GlobalErrorHandler) {       
        this.route.parent.params.subscribe((params) => {
            console.log(params);
            this.SOinfo=undefined;
            this.message="Please Wait...";
            this.workorderid = params['id'];
            this.getOrderInfo(this.workorderid);
        });
    }
    getOrderInfo(workorderid) {
        if (workorderid != null) {
            this.orderSandbox.getWorkOrderDataByID(workorderid);
            this.orderSandbox.workorderInfo$.subscribe((response) => {
                if (response) {
                    this.getServiceOrderByID(response.serviceOrderId);
                }
            }, error => {this.globalErrorHandler.handleError(error);this.message=error.error;});
        }
    }
    getServiceOrderByID(serviceorderid) {
        this.orderSandbox.getServiceOrderDataByID(serviceorderid);
        this.orderSandbox.serviceorderInfo$.subscribe((response) => {
            if (response) {
                this.SOinfo = response;
            }
        }, error => {this.globalErrorHandler.handleError(error);this.message=error.error;});
    }
}
