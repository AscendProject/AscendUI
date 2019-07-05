import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../config.service';

@Injectable()
export class PreferencesService {

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

  public addExclusionInfo(fileobj) {
    return this.http.post(this.vendorcommandUrl + 'ExclusionList', fileobj)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  public getExclusionListByClientId(clientId){
    return this.http.get(this.vendorqueryUrl+'ExclusionList/'+clientId)
    .map(data=>JSON.parse(JSON.stringify(data)))
  }

}
