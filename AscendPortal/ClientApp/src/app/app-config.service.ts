import { Injectable } from '@angular/core';
// import { Http, Response, RequestOptionsArgs, RequestMethod, Headers } from '@angular/http';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IConfiguration } from './interfaces';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ConfigService {

  serverSettings: IConfiguration;
  // observable that is fired when settings are loaded from server
  private settingsLoadedSource = new Subject();
  settingsLoaded$ = this.settingsLoadedSource.asObservable();
  isReady: boolean = false;

  constructor(/*private http: Http,*/private httpClient: HttpClient) {
    
  }

  load() {
    const baseURI = document.baseURI.endsWith('/') ? document.baseURI : `${document.baseURI}/`;
    let url = `${baseURI}Home/Configuration`;

    this.httpClient.get<IConfiguration>(url).subscribe((data: IConfiguration) => {
      console.log('server settings loaded');
      this.serverSettings = data;
      console.log('serversettings:Vendor Command Api ' + this.serverSettings.vendorProfileCommandAPI);
      console.log('serversettings:Vendor Query Api ' + this.serverSettings.vendorProfileCommandAPI);

      this.isReady = true;
      this.settingsLoadedSource.next(this.serverSettings);
    }, (error: HttpErrorResponse) => {
      if (error.status === 404) {
        url = `${baseURI}assets/devSettings.json`;
        this.httpClient.get<IConfiguration>(url).subscribe((data: IConfiguration) => {
          console.log('server settings loaded');
          this.serverSettings = data;
          console.log(this.serverSettings);
          console.log('serversettings:Vendor Command Api ' + this.serverSettings.vendorProfileCommandAPI);
          console.log('serversettings:Vendor Query Api ' + this.serverSettings.vendorProfileQueryAPI);
          console.log('serversettings:App Insights Instrumentation Key ' + this.serverSettings.applicationInsightsInstrumentationKey);
          this.isReady = true;
          this.settingsLoadedSource.next(this.serverSettings);
        });
      }
    }
    );
  }
}
