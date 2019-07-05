import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import { CountiesModel, StatesModel } from '../../shared/models/vendor-service-model';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class VendorApiService {

  public orderManagementQueryAPI;

  constructor(private http: HttpClient, private configService: ConfigService) {
    if (this.configService.isReady) {
      console.log('config service ready');
      this.orderManagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI + "/workOrders/";;


    } else {
      console.log('config service not ready');
      this.configService.settingsLoaded$.subscribe(x => {
        this.orderManagementQueryAPI = this.configService.serverSettings.orderManagementQueryAPI + "/workOrders/";;
      });
    }
  }
  // public baseUrl = this.getBaseUrl();

  public getStateListApi(): Observable<StatesModel> {
    return this.http.get(this.orderManagementQueryAPI + '/states/VIV9128291')
      .map(data => JSON.parse(data['_body']));
  }

  public getCountyListApi(stateName: string): Observable<CountiesModel> {
    return this.http.get(this.orderManagementQueryAPI + '/state/' + stateName + '/counties')
      .map(data => JSON.parse(data['_body']));
  }

}
