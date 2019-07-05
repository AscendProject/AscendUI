import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import {
 BackgroundcheckModel
} from '../../shared/models/backgroundcheck-model';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class BackgroundcheckService {

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

  public addBackgroundCheck(BackgroundcheckModel): Observable<BackgroundcheckModel> {
    return this.http.post(this.vendorcommandUrl + 'VendorBackGroundCheck', BackgroundcheckModel)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public editBackgroundCheck(BackgroundcheckModel): Observable<BackgroundcheckModel> {
    return this.http.put(this.vendorcommandUrl + 'VendorBackGroundCheck', BackgroundcheckModel)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public viewBackgroundCheckItem(backgroundcheckid, vendorid) {
    return this.http.get(this.vendorqueryUrl + 'VendorBackGroundCheck/GetById?backGroundCheckId=' + backgroundcheckid + '&vendorId=' + vendorid)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
}
