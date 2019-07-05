import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import {IAvailability} from '../../shared/models/add-availability-models';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {IAvailabilityModelResponse} from '../../shared/models/add-availability-models';
import {ICapacityModelResponse} from '../../shared/models/add-vendor-model';
import {IVendorProfileModelResponse} from '../../shared/models/add-vendor-model';
@Injectable()
export class AvailabilityService {
  public vendorcommandUrl;
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
  
  public addVendorAvailability(IAvailability): Observable<IAvailabilityModelResponse> {   
    return this.http.put(this.vendorcommandUrl + 'VendorProfile', IAvailability)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
  public addVendorCapacity(IAvailability): Observable<IVendorProfileModelResponse> {   
    return this.http.put(this.vendorcommandUrl + 'VendorProfile', IAvailability)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

}
