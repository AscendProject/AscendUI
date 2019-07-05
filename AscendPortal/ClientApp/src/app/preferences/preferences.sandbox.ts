import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../shared/httpService/http.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { GlobalErrorHandler } from '../shared/globalError_handler/global-error-handler';
import {PreferencesService} from '../preferences/services/preferences.service';


@Injectable()
export class PreferencesSandbox {

    constructor(private service:PreferencesService)
    {

    }

    public addEclusionInformation$;
    public getExclusionListByClientID$;

    public addExclusionInfo(fileobj) {
        this.addEclusionInformation$ = this.service.addExclusionInfo(fileobj);
        return this.addEclusionInformation$;
      }

      public getExclusionListByClientID(clientId){
          this.getExclusionListByClientID$=this.service.getExclusionListByClientId(clientId);
          
          return this.getExclusionListByClientID$;
      }

}