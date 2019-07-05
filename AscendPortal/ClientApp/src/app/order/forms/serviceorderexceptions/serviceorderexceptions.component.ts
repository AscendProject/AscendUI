import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { ExceptionDetails } from '../../../shared/models/exception.model';
@Component({
    selector: 'serviceorderexceptions',
    templateUrl: './serviceorderexceptions.component.html',
    styleUrls: ['./serviceorderexceptions.component.scss']
})
export class ServiceordrExceptionsComponent {
    ExceptionsList: ExceptionDetails;
    orderid: string;
    message: string = "Please Wait..."
    constructor(private orderSandbox: OrderSandbox, public route: ActivatedRoute,
        private globalErrorHandler: GlobalErrorHandler) {
        this.route.parent.params.subscribe((params) => {
            this.orderid = params['id'];
            this.ExceptionsList = undefined;
            this.message = "Please Wait...";
            //this.orderid = 'EOR20180315-3796657';
            this.getExceptionsByeOrderId(this.orderid);
        });
    }

    getExceptionsByeOrderId(orderid) {
        this.orderSandbox.getExceptionsList(orderid, 1, 10);
        this.orderSandbox.exceptiopnsList$.subscribe((response) => {
            if (response) {
                if (response.exceptionLogs.length > 0) {
                    this.ExceptionsList = response;
                } else {
                    this.ExceptionsList = undefined;
                    this.message = `No exceptions are associated with order ${this.orderid}`;
                }
            }
        }, error => { this.globalErrorHandler.handleError(error); this.message = error.error });
    }
}