import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import {
  IVendorLicense, IVendorLicenseModel
} from '../../shared/models/license-model';

import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LicenseService  {
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

  public addLicense(formdata): Observable<IVendorLicenseModel> {
    return this.http.post(this.vendorcommandUrl + 'VendorLicense', formdata)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public editLicenseDetails(IVendorLicenseModel):  Observable<IVendorLicenseModel> {
    return this.http.put(this.vendorcommandUrl + 'VendorLicense', IVendorLicenseModel)
      .map(data => JSON.parse(JSON.stringify(data)));
      
  }

  public getLicienceDatabyID(licienceid) {
    //debugger
    return this.http.get(this.vendorqueryUrl + 'VendorLicense/GetById/?licenseId=' + licienceid)
      .map(data => JSON.parse(JSON.stringify(data)));
      
  }

  
  public editLicense(IVendorLicenseModel): Observable<IVendorLicenseModel> {
    return this.http.put(this.vendorcommandUrl + '/VendorLicense', IVendorLicenseModel)
      .map(data => JSON.parse(JSON.stringify(data)));
      
  }
 
}
