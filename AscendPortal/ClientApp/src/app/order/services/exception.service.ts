import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import { Observable } from 'rxjs/Observable';
import { ExceptionDetails } from '../../shared/models/exception.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config.service';

@Injectable()
export class ExceptionService {

    public ordermanagementQueryAPI: string;
    constructor(private http: HttpClient, private configService: ConfigService) {
        if (this.configService.isReady) {
            console.log('config service ready');
          this.ordermanagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI +"/workOrders/";
        } else {
            console.log('config service not ready');
            this.configService.settingsLoaded$.subscribe(x => {
                this.ordermanagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI;
            });
        }
    }
    public getExceptionsApi(orderId: string, pageNumber: number, pageSize: number): Observable<ExceptionDetails> {
        pageNumber = 1;
        pageSize = 10;
        const url = `${this.ordermanagementQueryAPI}/exceptions/${orderId}/?pageNumber=${pageNumber}&pagesize=${pageSize}`;
        return this.http.get<ExceptionDetails>(url);
    }
}
