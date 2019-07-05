import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import {IAddDisciplinary} from '../../shared/models/disciplinary-model';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {IAddDisciplinaryModelResponse} from '../../shared/models/disciplinary-model';

@Injectable()
export class DisciplinaryService {
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
  
  public addDisciplinary(IAddDisciplinary): Observable<IAddDisciplinaryModelResponse> {   
    return this.http.post(this.vendorcommandUrl + 'VendorDisciplinaryAction', IAddDisciplinary)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
  public getDisciplinaryActions(licenseId) {
    return this.http.get(this.vendorqueryUrl + 'vendordisciplinaryActionController/' + licenseId)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
  public getDisciplinaryActionById(vendorId, disciplinaryActionId) {
    return this.http.get(this.vendorqueryUrl + 'vendordisciplinaryActionController/GetById?disciplinaryActionId=' + disciplinaryActionId + '&vendorId=' + vendorId)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
  public editDisciplinary(IAddDisciplinary): Observable<IAddDisciplinaryModelResponse> {   
    return this.http.put(this.vendorcommandUrl + 'VendorDisciplinaryAction', IAddDisciplinary)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public deleteDisciplinaryActions(diciplinaryActionId, vendorId) {
    return this.http.delete(this.vendorcommandUrl + 'VendorDisciplinaryAction?diciplinaryActionId=' + vendorId + '&VendorId=' + diciplinaryActionId)
      .map(data => JSON.parse(JSON.stringify(data)));

  }

}
