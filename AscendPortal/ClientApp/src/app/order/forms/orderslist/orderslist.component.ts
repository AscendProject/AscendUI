import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';


@Component({
    selector: 'ascend-orders-list',
    templateUrl: './orderslist.component.html',
    styleUrls: ['./orderslist.component.scss']
})
export class OrdersListComponent implements OnInit {
    // @Input() loaddata: any;
    // @Input() SelectedValue: string;
    // OrdersList = [];
    constructor() {
        // setTimeout(function () {
        //     this.OrdersList = this.loaddata;
        // }.bind(this), 1000);
    }
    ngOnInit() {
    }
}

