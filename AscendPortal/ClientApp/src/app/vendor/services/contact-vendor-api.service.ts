import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import {
  IVendorName, IVendorAddress, IVendorAddressInfo, IServiceType, IVendorEmail,
  IVendorPhone, ICompanyInformation, IVendorProfileModel, IVendorProfileModelResponse
} from '../../shared/models/add-vendor-model';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable()
export class ContactVendorApiService {
  public vendorcommandUrl ;
  public vendorqueryUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    if (this.configService.isReady) {
      console.log('config service ready');
      this.vendorcommandUrl = this.configService.serverSettings.vendorProfileCommandAPI;
      this.vendorqueryUrl = this.configService.serverSettings.vendorProfileQueryAPI;
    } else {
      console.log('config service not ready');
      this.configService.settingsLoaded$.subscribe(x => {
        this.vendorcommandUrl = this.configService.serverSettings.vendorProfileCommandAPI;
        this.vendorqueryUrl = this.configService.serverSettings.vendorProfileQueryAPI;
      });
    }
  }
  
  public getVendorId(vendorid: string) {    
    return this.http.get(this.vendorqueryUrl+ 'VendorProfile/' + vendorid)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public updateVendor(IVendorProfileModel): Observable<IVendorProfileModel> {
    return this.http.put(this.vendorcommandUrl + 'VendorProfile', IVendorProfileModel)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
 
}
