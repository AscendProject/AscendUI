import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import { Observable } from 'rxjs/Observable';
import { VendorDetailsList } from '../../shared/models/vendor.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../../interfaces';
import { ConfigService } from '../../config.service';

@Injectable()
export class VendorService {

    vendorProfileQueryAPI: string;
    constructor(private http: HttpClient, private configService: ConfigService) {
        if (this.configService.isReady) {
            console.log('config service ready');
            this.vendorProfileQueryAPI = this.configService.serverSettings.vendorProfileQueryAPI;
        } else {
            console.log('config service not ready');
            this.configService.settingsLoaded$.subscribe(x => {
                this.vendorProfileQueryAPI = this.configService.serverSettings.vendorProfileQueryAPI;
            });
        }
    }

    public getVendorInfoApi(vendorid: string): Observable<VendorDetailsList> {
        //const url = this.vendorbyIdURL.replace('{vendorId}', vendorid);
        const url = `${this.vendorProfileQueryAPI}/vendorProfile/${vendorid}`;
        return this.http.get<VendorDetailsList>(url);
    }
}
