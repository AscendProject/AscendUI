import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import {
  IVendorLicense, IVendorLicenseModel
} from '../../shared/models/license-model';

import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ListInsurancesLicensesService {
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
    
  public listInsurances(vendorId) {
    return this.http.get(this.vendorqueryUrl + 'VendorInsurance/' + vendorId)
      .map(data => JSON.parse(JSON.stringify(data)));

  }

  public listLicences(vendorId) {
    return this.http.get(this.vendorqueryUrl + 'VendorLicense/' + vendorId)
      .map(data => JSON.parse(JSON.stringify(data)));

  }

  public listBackgroundCheck(vendorId) {
    return this.http.get(this.vendorqueryUrl + 'VendorBackGroundCheck/' + vendorId)
      .map(data => JSON.parse(JSON.stringify(data)));

  }
  public deletBackgroundCheck(BackgroundCheckId, vendorid) {
    debugger
    return this.http.delete(this.vendorcommandUrl + 'VendorBackGroundCheck?BackgroundCheckId=' + BackgroundCheckId + '&vendorId=' + vendorid)
      .map(data => JSON.parse(JSON.stringify(data)));

  }
  
}
