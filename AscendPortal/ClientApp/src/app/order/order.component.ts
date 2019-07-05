import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { OrderSandbox } from './order.sandbox';
import { GlobalErrorHandler } from '../shared/globalError_handler/global-error-handler';
import { ServiceOrder } from '../shared/models/serviceorder.model';
import { WorkOrder, WorkOrderModel } from '../shared/models/workorder.model';

@Component({
    selector: 'ascend-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    ServiceOrdersList = [];
    WorkOrdersList = [];
   
    SOTabs = [];
    selectedValue: String = 'Work';
    searchplaceholder: String = '';
    searchid: String = '';
    activeLinkIndex = -1;
    detailsdata: any;
    constructor(private router: Router,private route: ActivatedRoute, private orderSandbox: OrderSandbox, private globalErrorHandler: GlobalErrorHandler) {
        // this.route.params.subscribe((params) => {
        //     if(params['id']!=undefined)
        //     {
        //         let id:string=params['id'];
        //         if(id.startsWith('S'))
        //             this.router.navigate(['serviceorderinfo'],{relativeTo:this.route})
        //         else if(id.startsWith('W'))
        //             this.router.navigate(['workorderinfo'],{relativeTo:this.route})
        //     }            
        //  });

        //this.router.navigate(['work-orders'],{relativeTo:this.route});
        
    }
    ngOnInit() {

        // this.DropdownSelectedvalue();
        // this.setClickedRow();
    }

    // DropdownSelectedvalue() {

    //     if (this.selectedValue === 'Service') {
    //         this.serviceorderlist();
    //     } else if (this.selectedValue === 'Work') {
    //         this.workorderlist();
    //     } else if (this.selectedValue === 'Orders') {
    //         this.searchplaceholder = 'My Orders';
    //     } else if (this.selectedValue === 'Unassigned') {
    //         this.searchplaceholder = '';
    //     }
    // }
    // serviceorderlist() {
    //     this.router.navigate(['service-orders']);
    //     // this.searchplaceholder = 'Service Orders';
    //     // if (this.searchid === '') {
    //     //     this.orderSandbox.getServiceOrdersList();
    //     //     this.orderSandbox.serviceordersList$.subscribe((response) => {
    //     //         if (response) {
    //     //             this.ServiceOrdersList = response.records;
    //     //         }
    //     //     }, error => this.globalErrorHandler.handleError(error));
    //     // } else {

    //     //     this.orderSandbox.getServiceOrderDataByID(this.searchid);
    //     //     this.orderSandbox.serviceorderInfo$.subscribe((response) => {

    //     //         if (response) {
    //     //             this.ServiceOrdersList.push(response);
    //     //         }
    //     //     }, error => this.globalErrorHandler.handleError(error));
    //     // }

    // }
    // workorderlist() {
    //     this.router.navigate(['work-orders'],{relativeTo:this.route});
    //     // this.searchplaceholder = 'Work Orders';
    //     // if (this.searchid === '') {
    //     //     this.orderSandbox.getWorkOrdersList();
    //     //     this.orderSandbox.workordersList$.subscribe((response) => {
    //     //         if (response) {
    //     //             this.WorkOrdersList = response.records;
    //     //         }
    //     //     }, error => this.globalErrorHandler.handleError(error));
    //     // } else {
    //     //     this.orderSandbox.getWorkOrderDataByID(this.searchid);
    //     //     this.orderSandbox.workorderInfo$.subscribe((response) => {
    //     //         if (response) {
    //     //             this.WorkOrdersList.push(response);
    //     //         }
    //     //     }, error => this.globalErrorHandler.handleError(error));
    //     // }
    // }

    // cleardata() {
    //     this.detailsdata = undefined;
    //     this.WorkOrdersList = [];
    //     this.ServiceOrdersList = [];
    // }

    // selecteddropdown() {
    //     this.cleardata();
    //     this.searchid = '';
    //     this.DropdownSelectedvalue();
    // }
    // SearchData(id) {
    //     this.cleardata();
    //     this.searchid = '';
    //     this.searchid = id;
    //     this.DropdownSelectedvalue();
    // }
    // DetailsLoad(obj) {
    //     this.detailsdata = obj;
    // }

    // setClickedRow() {
       
    //     this.SOTabs = [{
    //         label: 'Order Info', link: 'serviceorderinfo', index: 0
    //     }, {
    //         label: 'Work Orders', link: 'workOrders', index: 1
    //     }, {
    //         label: 'Exceptions', link: 'soexceptions', index: 2
    //     }];

    //     this.router.events.subscribe((res) => {
    //         this.activeLinkIndex = this.SOTabs.indexOf(this.SOTabs.find(tab => tab.link === '.' + this.router.url));
    //     });
    // }
}
