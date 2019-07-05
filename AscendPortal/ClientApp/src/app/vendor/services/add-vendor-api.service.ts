import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/httpService/http.service';
import {
  IVendorName, IVendorAddress, IVendorAddressInfo, IServiceType, IVendorEmail,
  IVendorPhone, ICompanyInformation, IVendorProfileModel, IVendorProfileModelResponse
} from '../../shared/models/add-vendor-model';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AddVendorApiService {
  public vendorcommandUrl;
  public vendorqueryUrl;
  public vendorsearchUrl;
  public vendorsearchKey;

  constructor(private http: HttpClient, private configService: ConfigService) {
    if (this.configService.isReady) {
      console.log('config service ready');
      this.vendorcommandUrl = this.configService.serverSettings.vendorProfileCommandAPI;
      this.vendorqueryUrl = this.configService.serverSettings.vendorProfileQueryAPI;

      this.vendorsearchUrl=this.configService.serverSettings.vendorSearchqueryAPI;
      this.vendorsearchKey=this.configService.serverSettings.azureSearchKey;

    } else {
      console.log('config service not ready');
      this.configService.settingsLoaded$.subscribe(x => {
        this.vendorcommandUrl = this.configService.serverSettings.vendorProfileCommandAPI;
        this.vendorqueryUrl = this.configService.serverSettings.vendorProfileQueryAPI;

        this.vendorsearchUrl=this.configService.serverSettings.vendorSearchqueryAPI;
        this.vendorsearchKey=this.configService.serverSettings.azureSearchKey;
      });
    }
  }

  addVendor(IVendorProfileModel): Observable<IVendorProfileModelResponse> {
    return this.http.post(this.vendorcommandUrl + 'VendorProfile', IVendorProfileModel)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
  getVendorId(vendorid: string) {
    return this.http.get(this.vendorqueryUrl + 'VendorProfile/' + vendorid)
      .map(data => JSON.parse(JSON.stringify(data)));
  }


  getVendor(page,size) {
    return this.http.get(this.vendorqueryUrl + 'VendorProfile' + '?pageNumber='+page+'&pageSize='+size)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  updateVendor(IVendorProfileModel): Observable<IVendorProfileModel> {
    return this.http.put(this.vendorcommandUrl + 'VendorProfile', IVendorProfileModel)
      .map(data => JSON.parse(JSON.stringify(data)));
  }
  editVendorCommScore(IVendorCommunicationModel): Observable<IVendorProfileModelResponse> {
    return this.http.put(this.vendorcommandUrl + 'VendorProfile', IVendorCommunicationModel)
      .map(data => JSON.parse(JSON.stringify(data)));
  }

  vendorSearch(queryData){
    var options=new HttpHeaders({
      'Content-Type':'application/json',
      'api-key': this.vendorsearchKey
    })
    return this.http
      .post(this.vendorsearchUrl,JSON.stringify(queryData),{headers:options})
      .map(data=>JSON.parse(JSON.stringify(data)));
  }
}
