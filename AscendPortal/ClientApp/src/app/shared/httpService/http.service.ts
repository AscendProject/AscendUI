import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// import { HttpResponseHandler } from './httpResponseHandler.service';
import { ConfigService } from '../../config.service';
// import { methodBuilder, paramBuilder } from './utils.service';


/**
 * Supported @Produces media types
 */
export enum MediaType {
  JSON,
  FORM_DATA
}

@Injectable()
export class HttpService {

  public constructor(
    protected http: HttpClient,
    protected configService: ConfigService,
    // protected responseHandler: HttpResponseHandler
  ) {
  }

  public getBaseUrl(): string {
    // return this.configService.get('api').baseUrl;
    return 'https://ordermanagementqueryapi-test.azurewebsites.net/api/v1';
  }

  public getVendorBaseUrl(): string {
    // return this.configService.get('api').baseUrl;
    return 'https://vendorqueryapi-test.azurewebsites.net/api/v1';
  }
  protected getDefaultHeaders(): Object {
    return null;
  }
}
