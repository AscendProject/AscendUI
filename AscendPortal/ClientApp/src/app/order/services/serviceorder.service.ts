import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import { Observable } from 'rxjs/Observable';
import { ServiceOrder, ServiceOrderModel, ServiceOrderDetails } from '../../shared/models/serviceorder.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../../interfaces';
import { ConfigService } from '../../config.service';

@Injectable()
export class ServiceOrderService {
    serviceOrderUrl: string;
    serviceOrderbyIdURL: string;
    ordermanagementQueryAPI:string;

    constructor(private http: HttpClient, private configService: ConfigService) {
        if (this.configService.isReady) {
            console.log('config service ready');
          this.ordermanagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI + "/workOrders/";;
            //this.serviceOrderbyIdURL = this.configService.serverSettings.serviceOrderbyIdURL;
        } else {
            console.log('config service not ready');
            this.configService.settingsLoaded$.subscribe(x => {
                this.ordermanagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI;
               // this.serviceOrderUrl = this.configService.serverSettings.serviceOrdersURL;
                //this.serviceOrderbyIdURL = this.configService.serverSettings.serviceOrderbyIdURL;
            });
        }
    }
    public getServiceOrdersListApi(pageNumber: number, pageSize: number): Observable<ServiceOrderDetails> {
        pageNumber = 1;
        pageSize = 10;
        const url = `${this.ordermanagementQueryAPI}/serviceOrders?pageNumber=${pageNumber}&pagesize=${pageSize}`;
        return this.http.get<ServiceOrderDetails>(url);
    }
    public getServiceOrderDataByIDApi(serviceOrderId: string): Observable<ServiceOrder> {
        const url = `${this.ordermanagementQueryAPI}/serviceOrders/${serviceOrderId}`;
        //const url = this.serviceOrderbyIdURL.replace('{serviceOrderId}', serviceOrderId);
        return this.http.get<ServiceOrder>(url);
    }
}
