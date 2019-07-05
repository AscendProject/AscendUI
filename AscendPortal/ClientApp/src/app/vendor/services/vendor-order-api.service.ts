import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class VendorOrderApiService {

  headers = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
  }
  public orderFulfillmentQueryAPI;
  public orderManagementQueryAPI;
  public vendorDocumentQueryAPI;
  public ordersQueryApiUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {

    if (this.configService.isReady) {
      console.log('config service ready');
      this.orderFulfillmentQueryAPI = this.configService.serverSettings.orderFulfillmentQueryAPI;
      this.orderManagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI + "/workOrders/";;
      this.vendorDocumentQueryAPI = this.configService.serverSettings.vendorDocumentQueryAPI;
      this.ordersQueryApiUrl = this.configService.serverSettings.orderManagementQueryAPI;
    } else {
      console.log('config service not ready');
      this.configService.settingsLoaded$.subscribe(x => {
        this.orderFulfillmentQueryAPI = this.configService.serverSettings.orderFulfillmentQueryAPI;
        this.orderManagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI + "/workOrders/";;
        this.vendorDocumentQueryAPI = this.configService.serverSettings.vendorDocumentQueryAPI;
        this.ordersQueryApiUrl = this.configService.serverSettings.orderManagementQueryAPI;
      });
    }
  }

  public getAvailableOffers(pageNumber: number, pageSize: number, vendorid, offerStatus) {
    var getOffersUrl = this.orderFulfillmentQueryAPI + 'work-offers/vendors/' + vendorid + '/status/' + offerStatus + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    return this.http.get(getOffersUrl)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public getAcceptedOrders(pageNumber: number, pageSize: number, vendorid) {
    var getOrdersAPIURL = this.orderManagementQueryAPI + 'vendors/' + vendorid + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    return this.http.get(getOrdersAPIURL)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public getWorkOrdersByUrl(url) {
    return this.http.get(url)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public getOfferDetails(WorkOfferId: string) {
    return this.http.get(this.orderFulfillmentQueryAPI +'work-offers/' + WorkOfferId)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public postAcceptedoffer(url, IOrderStatusChange) {
    return this.http.post(url, JSON.stringify(IOrderStatusChange), this.headers)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public getOfferStatus(url) {
    return this.http.get(url).map(data => JSON.parse(JSON.stringify(data)));
  }

  public getDownloadDocument(documentId: string) {
    return this.vendorDocumentQueryAPI + documentId;
  }

  public getAcceptedOrderDetails(orderId: string) {
    return this.http.get(this.ordersQueryApiUrl + '/workOrders/' + orderId)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public getServiceOrderDetails(serviceOrderId: string) {
    return this.http.get(this.ordersQueryApiUrl + '/serviceOrders/' + serviceOrderId)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

}
