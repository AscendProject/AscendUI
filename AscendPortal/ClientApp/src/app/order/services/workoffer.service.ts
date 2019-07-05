import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import { Observable } from 'rxjs/Observable';
import { WorkOffer, WorkOfferModel } from '../../shared/models/workoffer.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../config.service';


@Injectable()
export class WorkOfferService {
    public workOfferURL: string;
    public workOfferbyIdURL: string;
    //public serviceOrderbyIdURL: string;
    public orderfulfillmentQueryAPI:string;
    public workOfferQueryAPI: string;
    constructor(private http: HttpClient, private configService: ConfigService) {
        if (this.configService.isReady) {
            
            console.log('config service ready');
            this.orderfulfillmentQueryAPI = this.configService.serverSettings.orderFulfillmentQueryAPI;
          //  this.workOfferQueryAPI = this.configService.serverSettings.workOfferQueryAPI;

        } else {
            
            console.log('config service not ready');
            this.configService.settingsLoaded$.subscribe(x => {
                this.orderfulfillmentQueryAPI = this.configService.serverSettings.orderFulfillmentQueryAPI;
              //  this.workOfferQueryAPI = this.configService.serverSettings.workOfferQueryAPI;
            });
        }
    }

    getWorkOffersListbyWorkOrderIDApi(workorderid: String): Observable<WorkOffer[]> {
        
        const url = `${this.orderfulfillmentQueryAPI}/work-orders/${workorderid}/work-offers?pageNumber=1&pageSize=10`;
        
        //const url = this.serviceOrderbyIdURL.replace('{serviceOrderId}', serviceorderid + '/workOrders');
        return this.http.get<WorkOffer[]>(url);
    }

    getHtmlEngagementLetter(docId:string){
       
        const url = `https://orderfulfillmet-engagementletter-functionapp.azurewebsites.net/api/RetreiveDocument?code=ZLl//ZcGBYMSJTbufy4OWvbI0E1Lb/g0BXGr3W1yHt9tt01JGq6ufg==&docId=${docId}`;
        return this.http.get(url, { responseType: 'text' })
            
    }

    
    getWorkOfferDetailsApi(workofferid: string): Observable<WorkOffer> {

        const url = `${this.orderfulfillmentQueryAPI}/work-offers/${workofferid}`;
        return this.http.get<WorkOffer>(url);
    }

    getSelectStatusByUrl(selectedUrl: string): Observable<any> {
        debugger
        const url = `${selectedUrl}`;
        return this.http.get<any>(url);
    }   
    
    getVendorAssignedByWorkOfferId(workofferid: string, vendorid: string, workOfferVendorAssignedAPI:string) {
        debugger
        var data = {
            "workOfferId": workofferid,
            "vendorId": vendorid
        };
        const url = `${workOfferVendorAssignedAPI}`;
        //this.http.put(this.commandApiUrl + '/VendorLicense', IVendorLicenseModel)
        return this.http.post<any>(url, data,{observe:'response'});
    }
}


