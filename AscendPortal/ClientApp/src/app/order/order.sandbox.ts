import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../shared/httpService/http.service';
import { ConfigService } from '../config.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { GlobalErrorHandler } from '../shared/globalError_handler/global-error-handler';
import { Sandbox } from '../shared/base.sandbox';
import {
    ServiceOrderService,
    WorkOrderService,
    VendorService,
    WorkOfferService,
    ExceptionService,
} from './services/index';

import { ServiceOrder, ServiceOrderModel, ServiceOrderDetails } from '../shared/models/serviceorder.model';
import { WorkOrder, WorkOrderModel, WorkOrderDetails } from '../shared/models/workorder.model';
import { VendorDetails, VendorDetailsList } from '../shared/models/vendor.model';
import { WorkOffer, WorkOfferModel } from '../shared/models/workoffer.model';
import { HttpResponse } from '@angular/common/http';
import { ExceptionDetails } from '../shared/models/exception.model';

@Injectable()
export class OrderSandbox extends Sandbox {

    public serviceordersList$: Observable<ServiceOrderDetails>;
    public workordersList$: Observable<WorkOrderDetails>;
    public workordersListForService$: Observable<WorkOrder[]>;
    public serviceorderInfo$: Observable<ServiceOrder>;
    public workorderInfo$: Observable<WorkOrder>;
    public vendorInfo$: Observable<VendorDetails>;
    public workoffersListForWorkOrder$: Observable<WorkOffer[]>;
    public htmlEngagementLetter$: Observable<string>;
    public exceptiopnsList$: Observable<ExceptionDetails>;
    public vendorDetails$: Observable<VendorDetailsList>;
    public workofferInfo$: Observable<WorkOffer>;
    public workofferSelectStatus$: Observable<any>;
    constructor(private httpService: HttpService, private _configService: ConfigService,
        private globalErrorHandler: GlobalErrorHandler,
        private serviceorderservice: ServiceOrderService,
        private exceptionservice: ExceptionService,
        private workorderservice: WorkOrderService,
        private vendorservice: VendorService,
        private workofferservice: WorkOfferService) {
        super(_configService);
        this.registerEvents();
    }
    public orderslist$: Observable<WorkOrder>;
    public getServiceOrdersList(pageNumber: number, pageSize: number): void {
        this.serviceordersList$ = this.serviceorderservice.getServiceOrdersListApi(pageNumber, pageSize);
    }
    public getServiceOrderDataByID(serviceorderid: string): void {
        this.serviceorderInfo$ = this.serviceorderservice.getServiceOrderDataByIDApi(serviceorderid);
    }


    public getWorkOrdersList(pageNumber: number, pageSize: number): void {
        this.workordersList$ = this.workorderservice.getWorkOrdersListApi(pageNumber, pageSize);
    }

    public getWorkOrderDataByID(workorderid: string): void {
        this.workorderInfo$ = this.workorderservice.getWorkOrderDataByIDApi(workorderid);
    }

    public getWorkOrdersListbyServiceOrderID(serviceorderid: String): void {
        this.workordersListForService$ = this.workorderservice.getWorkOrdersListbyServiceOrderIDApi(serviceorderid);
    }

    public getUnassignedWorkOrdersList(pageNumber: number, pageSize: number): void {
        this.workordersList$ = this.workorderservice.getUnassignedWorkOrdersListApi(pageNumber, pageSize);
    }

    public getVendorInfo(vendorid: string): void {
        this.vendorDetails$ = this.vendorservice.getVendorInfoApi(vendorid);
    }

    public getWorkOffersList(workorderid: String): void {
        this.workoffersListForWorkOrder$ = this.workofferservice.getWorkOffersListbyWorkOrderIDApi(workorderid);
    }

    public getHtmlEngagementLetter(docId: string): void {
        this.htmlEngagementLetter$ = this.workofferservice.getHtmlEngagementLetter(docId);
    }

    public getExceptionsList(orderid: string, pageNumber: number, pageSize: number): void {
        this.exceptiopnsList$ = this.exceptionservice.getExceptionsApi(orderid, pageNumber, pageSize);
    }

    public getVendorListByWorkOrderID(workorderid: string): void {
        this.vendorDetails$ = this.workorderservice.getVendorListByWorkOrderIDApi(workorderid);
    }

    public getWorkOfferDetails(workofferid: string): void {
        this.workofferInfo$ = this.workofferservice.getWorkOfferDetailsApi(workofferid);
        debugger
    }

    public getWorkOfferSelectStatus(url: string): void {
        this.workofferSelectStatus$ = this.workofferservice.getSelectStatusByUrl(url);        
    }

    public getWorkOfferAssignmentStatus(url: string) {
         return this.workofferservice.getSelectStatusByUrl(url);
    }

    public AssignVendorToWorkOffer(workofferid: string, vendorid: string, vendorAssignemntURL:string){
        
        return this.workofferservice.getVendorAssignedByWorkOfferId(workofferid,vendorid,vendorAssignemntURL);
    }

    public unregisterEvents() {
    }

    /**
     * Subscribes to events
     */
    private registerEvents(): void {
        // Subscribes to culture
    }
}
