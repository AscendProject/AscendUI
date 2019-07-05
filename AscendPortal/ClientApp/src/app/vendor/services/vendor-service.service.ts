import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';

import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class VendorServiceService {
  public vendorcommandUrl;
  public vendorqueryUrl;
  private serviceQueryApiUrl;
  private serviceCommandApiUrl;
  private coverageAreaCommandAPI;

  constructor(private http: HttpClient, private configService: ConfigService) {
    if (this.configService.isReady) {
      console.log('config service ready');
        this.serviceQueryApiUrl = this.configService.serverSettings.vendorCoverageAreaQueryAPI;      
        this.serviceCommandApiUrl = this.configService.serverSettings.vendorCoverageAreaCommandAPI;
        this.vendorcommandUrl = this.configService.serverSettings.vendorProfileCommandAPI;
        this.vendorqueryUrl = this.configService.serverSettings.vendorProfileQueryAPI;
        this.coverageAreaCommandAPI = this.configService.serverSettings.vendorCoverageAreaCommandAPI;

    } else {
      console.log('config service not ready');
      this.configService.settingsLoaded$.subscribe(x => {
          this.serviceQueryApiUrl = this.configService.serverSettings.vendorCoverageAreaQueryAPI;          
          this.serviceCommandApiUrl = this.configService.serverSettings.vendorCoverageAreaCommandAPI;
          this.vendorcommandUrl = this.configService.serverSettings.vendorProfileCommandAPI;
          this.vendorqueryUrl = this.configService.serverSettings.vendorProfileQueryAPI;
          this.coverageAreaCommandAPI = this.configService.serverSettings.vendorCoverageAreaCommandAPI;

      });
    }
  }

  public listVendorServicesInfo(vendorId) {
    return this.http.get(this.vendorqueryUrl + 'VendorServices/' + vendorId)
      .map(data => JSON.parse(JSON.stringify(data)));

  }
  public listVendorAllServices(vendorId) {
    return this.http.get(this.serviceQueryApiUrl + '/coveragearea/' + vendorId)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
  public getAllStatesByLicence(vendorId) {
    return this.http.get(this.serviceQueryApiUrl + '/states/' + vendorId)
      .map(data => JSON.parse(JSON.stringify(data)));

  }
  public getAllCountiesByState(state) {
    return this.http.get(this.serviceQueryApiUrl + '/state/' + state + '/counties')
      .map(data => JSON.parse(JSON.stringify(data)));

  }
  addServiceCoverage(serviceObj) {
    return this.http.post(this.serviceCommandApiUrl + '/coveragearea', serviceObj)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public addRating(data) {
    return this.http.post(this.coverageAreaCommandAPI + '/CoverageArea', data)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public updateRating(data) {
    return this.http.put(this.coverageAreaCommandAPI + '/CoverageArea', data)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

}
