import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import {
  IVendorName, IVendorAddress, IVendorInsurance, IVendorInsuranceModel
} from '../../shared/models/insurances-model';

import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class InsurancesService {

  public vendorcommandUrl ;
  public vendorqueryUrl;
  public queryHistoryUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    if (this.configService.isReady) {
      console.log('config service ready');
        this.queryHistoryUrl = this.configService.serverSettings.vendorHistoryQueryAPI;
      this.vendorcommandUrl = this.configService.serverSettings.vendorProfileCommandAPI;
      this.vendorqueryUrl = this.configService.serverSettings.vendorProfileQueryAPI;
     
    } else {
      console.log('config service not ready');
      this.configService.settingsLoaded$.subscribe(x => {
        this.vendorcommandUrl = this.configService.serverSettings.vendorProfileCommandAPI;
        this.vendorqueryUrl = this.configService.serverSettings.vendorProfileQueryAPI;
        this.queryHistoryUrl = this.configService.serverSettings.vendorHistoryQueryAPI;
      });
     }
    }

  public addInsurance(IVendorInsurance): Observable<IVendorInsuranceModel> {
    debugger
    return this.http.post(this.vendorcommandUrl + 'VendorInsurance', IVendorInsurance)
      .map(data => JSON.parse(JSON.stringify(data)));
  }


  public editInsuranceDetails(IVendorInsurance) {
    return this.http.put(this.vendorcommandUrl + 'VendorInsurance', IVendorInsurance)
      .map(data => JSON.parse(JSON.stringify(data)));
  }


  getInsuranceDatabyID(insuranceid) {
    return this.http.get(this.vendorqueryUrl + 'VendorInsurance/GetById/?insuranceId=' + insuranceid)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  getHistory(insuranceid, pagesize) {
    return this.http.get(this.queryHistoryUrl + '/vendorhistory/' + insuranceid + '?pagenumber=1&pagesize=' + pagesize)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  
}

