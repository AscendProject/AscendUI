import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import { Observable } from 'rxjs/Observable';
import { ServiceOrder, ServiceOrderModel } from '../../shared/models/serviceorder.model';
import { WorkOrder, WorkOrderModel, WorkOrderDetails } from '../../shared/models/workorder.model';
import { VendorDetailsList, VendorDetails } from '../../shared/models/vendor.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../config.service';

@Injectable()
export class WorkOrderService {
    public workOrderURL: string;
    public workOrderbyIdURL: string;
    public serviceOrderbyIdURL: string;
    public ordermanagementQueryAPI: string;
    public orderfulfillmentQueryAPI:string;
    constructor(private http: HttpClient, private configService: ConfigService) {
        if (this.configService.isReady) {
            console.log('config service ready');
          this.ordermanagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI + "/workOrders/";;
            this.orderfulfillmentQueryAPI = this.configService.serverSettings.orderFulfillmentQueryAPI;
            //this.workOrderURL = this.configService.serverSettings.workOrdersURL;
            //this.workOrderbyIdURL = this.configService.serverSettings.workOrderbyIdURL;
            //this.serviceOrderbyIdURL = this.configService.serverSettings.serviceOrderbyIdURL;
        } else {
            console.log('config service not ready');
            this.configService.settingsLoaded$.subscribe(x => {
                this.ordermanagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI;
                this.orderfulfillmentQueryAPI = this.configService.serverSettings.orderFulfillmentQueryAPI;
                // this.workOrderURL = this.configService.serverSettings.workOrdersURL;
                // this.workOrderbyIdURL = this.configService.serverSettings.workOrderbyIdURL;
                // this.serviceOrderbyIdURL = this.configService.serverSettings.serviceOrderbyIdURL;
            });
        }
    }
    getWorkOrdersListApi(pageNumber: number, pageSize: number): Observable<WorkOrderDetails> {
        pageNumber = 1;
        pageSize = 10;
        const url = `${this.ordermanagementQueryAPI}/workOrders?pageNumber=${pageNumber}&pagesize=${pageSize}`;
        return this.http.get<WorkOrderDetails>(url);
    }
    getWorkOrderDataByIDApi(workOrderId: string): Observable<WorkOrder> {
        //const url = this.workOrderbyIdURL.replace('{workOrderId}', workOrderId);
        const url = `${this.ordermanagementQueryAPI}/workOrders/${workOrderId}`;
        return this.http.get<WorkOrder>(url);
    }

    getWorkOrdersListbyServiceOrderIDApi(serviceorderid: String): Observable<WorkOrder[]> {
        const url = `${this.ordermanagementQueryAPI}/serviceOrders/${serviceorderid}/workOrders`;
        //const url = this.serviceOrderbyIdURL.replace('{serviceOrderId}', serviceorderid + '/workOrders');
        return this.http.get<WorkOrder[]>(url);
    }

    getUnassignedWorkOrdersListApi(pageNumber: number, pageSize: number): Observable<WorkOrderDetails> {
        pageNumber = 1;
        pageSize = 10;
        //https://ordermanagementqueryapi-test.azurewebsites.net/api/v1/workOrders/unassigned?pageNumber=1&pageSize=10
        const url = `${this.ordermanagementQueryAPI}/workOrders/unassigned?pageNumber=${pageNumber}&pagesize=${pageSize}`;
        return this.http.get<WorkOrderDetails>(url);
    }
    
    getVendorListByWorkOrderIDApi(workorderid: string): Observable<VendorDetailsList>{
        const url = `${this.orderfulfillmentQueryAPI}/work-orders/${workorderid}/vendors-ranked?pageNumber=1&pageSize=5`;
        return this.http.get<VendorDetailsList>(url);
    }

}
