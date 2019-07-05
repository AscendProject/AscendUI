import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogsService, SessionService } from '../../../shared/services/index';
import { ServiceOrderID, SessionData, WorkOrderID } from '../../../shared/models/session.model';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { WorkOrderDetails } from '../../../shared/models/workorder.model';
import { ConfigService } from '../../../config.service';
@Component({
    selector: 'unassignedwork-orders-list',
    templateUrl: './unassignedworkorderslist.component.html',
    styleUrls: ['./unassignedworkorderslist.component.scss']
})
export class UnAssignedWorkOrdersListComponent implements OnInit {
    //@Input() workorderslist: any;
    @Output() details = new EventEmitter<object>();
    WOTabs = [];
    selectedRow: number;
    searchid: string = '';
    WOrdersList: WorkOrderDetails;
    public sitem: WorkOrderID;
    selectedValue: string = 'Unassigned';
    searchplaceholder: string = '';
    selectedOrder: any;
    isSearchClicked: boolean = false;

    constructor(private router: Router,
        private _configService: ConfigService,
        private sessionservice: SessionService,
        private activatedRoute: ActivatedRoute,
        private orderSandbox: OrderSandbox, private globalErrorHandler: GlobalErrorHandler) {
        this.sitem = this.sessionservice.getworkorderid();
        console.log('In Order Info');
        console.log(activatedRoute);
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
            //this.WOrdersList;
            this.selectedOrder = undefined;
            this.selectedRow = -1;
            this.orderSandbox.getUnassignedWorkOrdersList(1, 10);
            this.orderSandbox.workordersList$.subscribe((response) => {
                if (response) {
                    debugger
                    this.WOrdersList = response;
                }
            }, error => this.globalErrorHandler.handleError(error));
        } else {
            //this.WOrdersList=[];
            this.isSearchClicked = false;
            this.WOrdersList = new WorkOrderDetails();
            this.WOrdersList.pagingResult = null;
            this.WOrdersList.records = [];
            this.orderSandbox.getWorkOrderDataByID(this.searchid);
            this.orderSandbox.workorderInfo$.subscribe((response) => {
                if (response) {
                    this.WOrdersList.records.push(response);
                    this.selectedItem(0, response);
                }
            }, error => this.globalErrorHandler.handleError(error));
        }
    }
    selectedItem(i, item) {
        this.selectedRow = i;
        this.detailsLoad(item);
        this.sitem.workorderid = item.workOrderId;
        this.sessionservice.setworkorderid(this.sitem);
    }

    selecteddropdown() {

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
        const obj = { 'ID': item.workOrderId, 'Type': item.workOrderType, 'Status': item.workOrderStatus };
        this.selectedOrder = item;
        this.details.emit(obj);

        const restoreUrl: string = this.router.routerState.snapshot.url;
        const urlParts: string[] = restoreUrl.split('/');
        if (urlParts.length > 3) {
            this.router.navigate(['order', 'unassigned-work-orders', item.workOrderId, urlParts[urlParts.length - 1]]);
        } else {
            this.router.navigate(['order', 'unassigned-work-orders', item.workOrderId, 'info']);
        }
    }
    searchData(id) {
        this.isSearchClicked = true;
        this.searchid = '';
        this.searchid = id;
        if (this.searchid === '') {

            this.router.navigate(['order', 'unassigned-work-orders']);
        }

        this.loadData();

        //this.DropdownSelectedvalue();
    }

    chipColor(scolor) {
        if (scolor === 'New') {
            return 'bg-primary font-weight-bold text-white';
        } else if (scolor === 'InProgress' || scolor === 'Waiting') {
            return 'bg-warning font-weight-bold text-white';
        } else if (scolor === 'Completed') {
            return 'bg-success font-weight-bold text-white';
        } else if (scolor === 'PendingAcceptance') {
            return 'bg-secondary font-weight-bold text-white';
        } else if (scolor === 'QCReview') {
            return 'bg-dark font-weight-bold text-white';
        }

    }

}
