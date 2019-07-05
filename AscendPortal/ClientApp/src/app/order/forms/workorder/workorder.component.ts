import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { WorkOrderModel } from '../../../shared/models/workorder.model';
@Component({
    selector: 'workorders',
    templateUrl: './workorder.component.html',
    styleUrls: ['./workorder.component.scss']
})
export class WorkOrdersComponent {
    WorkOrdersList: WorkOrderModel;
    serviceorderid: string;
    constructor(private orderSandbox: OrderSandbox, public route: ActivatedRoute,
        private globalErrorHandler: GlobalErrorHandler) {
        this.route.parent.params.subscribe((params) => {
            this.serviceorderid = params['id'];
            this.getWorkOrdersByServiceOrderId(this.serviceorderid);
        });
    }
    // ngOnInit() {
    //     this.getServiceOrderByID(this.serviceorderid);
    // }

    getWorkOrdersByServiceOrderId(serviceorderid) {
        this.orderSandbox.getWorkOrdersListbyServiceOrderID(serviceorderid);
        this.orderSandbox.workordersListForService$.subscribe((response) => {
            if (response) {
                this.WorkOrdersList = new WorkOrderModel();
                this.WorkOrdersList.records = response;
            }
        }, error => this.globalErrorHandler.handleError(error));
    }
}
