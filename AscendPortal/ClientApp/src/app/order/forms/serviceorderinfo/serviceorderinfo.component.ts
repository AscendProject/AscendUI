import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
@Component({
    selector: 'serviceorderinfo',
    templateUrl: './serviceorderinfo.component.html',
    styleUrls: ['./serviceorderinfo.component.scss']
})
export class ServiceOrderInfoComponent {
    ServiceOrdersList = [];
    SOinfo: {};
    serviceorderid: string;
    constructor(private orderSandbox: OrderSandbox, public route: ActivatedRoute,
        private globalErrorHandler: GlobalErrorHandler
    ) {
        this.route.parent.url.subscribe((urlPath) => {
            this.serviceorderid = urlPath[0].path;
            this.getServiceOrderByID(this.serviceorderid);
        });
    }
    // ngOnInit() {
    //     this.getServiceOrderByID(this.serviceorderid);
    // }

    getServiceOrderByID(serviceorderid) {
        this.orderSandbox.getServiceOrderDataByID(serviceorderid);
        this.orderSandbox.serviceorderInfo$.subscribe((response) => {            
            if (response) {
                this.SOinfo = response;
            }
        }, error => this.globalErrorHandler.handleError(error));
    }
}
