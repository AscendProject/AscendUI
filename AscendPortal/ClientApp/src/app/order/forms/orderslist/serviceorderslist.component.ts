import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DialogsService, SessionService } from '../../../shared/services/index';
import { ServiceOrderID, SessionData, WorkOrderID } from '../../../shared/models/session.model';
import { ServiceOrderDetails } from '../../../shared/models/serviceorder.model';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { ConfigService } from '../../../config.service';
@Component({
    selector: 'serviceorderslist',
    templateUrl: './serviceorderslist.component.html',
    styleUrls: ['./serviceorderslist.component.scss']
})
export class ServiceOrdersListComponent implements OnInit {
    serviceorderslist: ServiceOrderDetails;
    @Output() details = new EventEmitter<object>();
    selectedRow: number;
    searchid: string = '';
    WOrdersList = [];
    selectedValue: string = 'Service';
    searchplaceholder: string = '';
    selectedOrder: any;
    public sitem: ServiceOrderID;
    isSearchClicked: boolean = false;
    constructor(private router: Router, private sessionservice: SessionService,
        private _configService: ConfigService,
        private orderSandbox: OrderSandbox, private globalErrorHandler: GlobalErrorHandler) {
        this.sitem = this.sessionservice.getserviceorderid();
    }

    ngOnInit() {
        if (this._configService.isReady) {
            this.loadData();
        } else {
            this._configService.settingsLoaded$.subscribe(x => {
                this.loadData();
            });
        }
    }
    loadData() {
        const restoreUrl: string = this.router.routerState.snapshot.url;
        const urlParts: string[] = restoreUrl.split('/');
        if (urlParts.length > 3 && !this.isSearchClicked) {
            this.searchid = urlParts[3];
        }
        if (this.searchid === '') {

            this.orderSandbox.getServiceOrdersList(1, 10);
            this.orderSandbox.serviceordersList$.subscribe((response) => {
                if (response) {
                    this.serviceorderslist = response;
                }
            }, error => this.globalErrorHandler.handleError(error));
        } else {
            this.serviceorderslist = new ServiceOrderDetails();
            this.serviceorderslist.pagingResult = null;
            this.serviceorderslist.records = [];
            this.orderSandbox.getServiceOrderDataByID(this.searchid);
            this.orderSandbox.serviceorderInfo$.subscribe((response) => {
                if (response) {
                    this.serviceorderslist.records.push(response);
                    this.selectedItem(0, response);
                }
            }, error => this.globalErrorHandler.handleError(error));
        }
    }
    selectedItem(i, item) {
        this.selectedRow = i;
        this.detailsLoad(item);
        this.sitem.serviceorderid = item.serviceOrderId;
        this.sessionservice.setserviceorderid(this.sitem);

    }

    selecteddropdown() {
        this.searchid = '';
        if (this.selectedValue === 'Service') {
            this.router.navigate(['order', 'service-orders']);
        } else if (this.selectedValue === 'Work') {
            this.router.navigate(['order', 'work-orders']);
        } else if (this.selectedValue === 'Orders') {
            this.searchplaceholder = 'My Orders';
        } else if (this.selectedValue === 'Unassigned') {
            this.searchplaceholder = '';
            this.router.navigate(['order', 'unassigned-work-orders']);
        }
    }

    detailsLoad(item) {
        console.log('Details Load Calling');
        const obj = { 'ID': item.serviceOrderID, 'Type': item.serviceName, 'Status': item.serviceOrderStatus };
        this.selectedOrder = item;
        this.details.emit(obj);
        const restoreUrl: string = this.router.routerState.snapshot.url;
        const urlParts: string[] = restoreUrl.split('/');
        if (urlParts.length > 3) {
            this.router.navigate(['order', 'service-orders', item.serviceOrderID, urlParts[urlParts.length - 1]]);
        } else {
            this.router.navigate(['order', 'service-orders', item.serviceOrderID, 'info']);
        }
    }
    searchData(id) {
        this.isSearchClicked = true;
        this.searchid = '';
        this.searchid = id;
        if (this.searchid === '') {

            this.router.navigate(['order', 'service-orders']);
        }

        this.loadData();
    }
    chipColor(scolor) {
        if (scolor === 'New') {
            return 'bg-primary font-weight-bold text-white';
        } else if (scolor === 'InProgress') {
            return 'bg-warning font-weight-bold text-white';
        } else if (scolor === 'Completed') {
            return 'bg-success font-weight-bold text-white';
        }
    }
}
