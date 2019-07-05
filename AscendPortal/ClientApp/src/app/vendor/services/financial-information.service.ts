import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import { IACH, IContact, IFinancialInformationModel,
IFinancialInformationModelResponse, IMailingAddress, IPayment,
IVendorAttributes, IW9, IW9FileInfoResponse } from '../../shared/models/financial-information-model';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class FinancialInformationService {
  public vendorcommandUrl;
  public vendorqueryUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    if (this.configService.isReady) {
      console.log('config service ready');
      this.vendorcommandUrl = this.configService.serverSettings.vendorACHInformationCommandAPI;
      this.vendorqueryUrl = this.configService.serverSettings.vendorACHInformationQueryAPI;

    } else {
      console.log('config service not ready');
      this.configService.settingsLoaded$.subscribe(x => {
        this.vendorcommandUrl = this.configService.serverSettings.vendorACHInformationCommandAPI;
        this.vendorqueryUrl = this.configService.serverSettings.vendorACHInformationQueryAPI;
      });
    }
  }

  // public addFinancialInformation(IFinancialInformationModel, vendorid:string): Observable<IFinancialInformationModelResponse> {
  //  return this.http.post(this.getCommandUrl() +'/VendorFinancialInformation/', IFinancialInformationModel )
  //    .map(data => JSON.parse(JSON.stringify(data)));
  // }
  // public getFinancialInformation(vendorid: string) {
  //  return this.http.get(this.getQueryUrl() + '/vendorFinancialInformation/'+ vendorid)
  //    .map(data => JSON.parse(JSON.stringify(data)));
  // }

  // public updateFinancialInformation(IFinancialInformationModel, vendorid: string): Observable<IFinancialInformationModelResponse> {
  //  return this.http.put(this.getCommandUrl() +'/VendorFinancialInformation', IFinancialInformationModel)
  //    .map(data => JSON.parse(data['_body']));
  // }


  public addFinancialInformation(IFinancialInformationModelAdd, vendorid: string): Observable<IFinancialInformationModelResponse> {
    return this.http.post(this.vendorcommandUrl + 'payment-method', IFinancialInformationModelAdd)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
  public getFinancialInformation(vendorid: string) {
    return this.http.get(this.vendorqueryUrl + 'payment-method/' + vendorid)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public updateFinancialInformation(IFinancialInformationModelUpdate, vendorid: string): Observable<IFinancialInformationModelResponse> {
    return this.http.put(this.vendorcommandUrl + 'payment-method' , IFinancialInformationModelUpdate)
      .map(data => JSON.parse(JSON.stringify(data)));
  }



  public addW9FileInformation(IW9FileInfoModelAdd): Observable<IW9FileInfoResponse> {
    return this.http.post(this.vendorcommandUrl + 'w9-form' , IW9FileInfoModelAdd)
      .map(data => JSON.parse(JSON.stringify(data)));
  }


  public getW9FileInformation(vendorid: string) {
    return this.http.get(this.vendorqueryUrl + 'w9-form/' + vendorid)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public updateW9FileInformation(IW9FileInfoModelUpdate, vendorid: string): Observable<IW9FileInfoResponse> {
    return this.http.post(this.vendorcommandUrl + 'w9-form' , IW9FileInfoModelUpdate)
      .map(data => JSON.parse(JSON.stringify(data)));
  }



}




