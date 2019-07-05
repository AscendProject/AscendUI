import { TestBed, inject } from '@angular/core/testing';

import { AddVendorApiService } from './add-vendor-api.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ConfigService } from '../../config.service';
import { Observable } from 'rxjs/Observable';
class MockConfigService {
  load() {
    return;
  }
  isReady = true;
  serverSettings: {};
}
import {
  IVendorName, IVendorAddress, IVendorAddressInfo, IServiceType, IVendorEmail,
  IVendorPhone, ICompanyInformation, IVendorProfileModel, IVendorProfileModelResponse
} from '../../shared/models/add-vendor-model';


describe('AddVendorApiService', () => {
  let service: AddVendorApiService;
  let httpClientSpy: { get: jasmine.Spy };
  let configService: ConfigService;
  const MockConfig = { settingsLoaded$: Observable.of(true), isReady: true };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddVendorApiService, HttpClient, HttpHandler, ConfigService]
    });
    // { provide: ConfigService, useClass: MockConfigService }
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    //let realConfigService = TestBed.get(ConfigService);

  });
  //inject([AddVendorApiService], (service: AddVendorApiService) 
  it('should be created', () => {
    service = TestBed.get(AddVendorApiService);
    expect(service).toBeTruthy();
  });

  it('should execute if block', () => {
    configService = jasmine.createSpyObj('ConfigService', ['isReady', 'serverSettings']);
    service = new AddVendorApiService(<any>httpClientSpy, <any>configService); //TestBed.get(AddVendorApiService);

  });

  //it('should execute else block', () => {
  //  // configService = jasmine.createSpyObj('ConfigService', ['settingsLoaded$', 'serverSettings']);
  //  service = TestBed.get(AddVendorApiService); //new AddVendorApiService(<any>httpClientSpy, <any>configService);
  //  let iProfileModel: IVendorProfileModel = {
  //    name: {
  //      firstName: '',
  //      middleName: '',
  //      lastName: '',
  //      suffix: '',
  //      preferredName: '',
  //      isStaffAppraiser: true
  //    },
  //    address: [{
  //      address: {
  //        StreetAddress: '',
  //        City: '',
  //        State: '',
  //        Zipcode: ''},
  //      addressType: '',
  //      isMailingAddressSame: true,
  //    }],
  //    servicetype: { ServiceType:[]},
  //    email: [],
  //    company: {
  //      CompanyName: '',
  //      State: ''},
  //    phone: [],
  //    communicationScore: { score:0}
  //  };
  //  let iProModelRes = 'calling';
  //  let fakeResponse = null;
  //  //spyOn(service, 'addVendor').and.returnValue(Observable.of(iProModelRes));
  //  service.addVendor(iProfileModel);

  //  let mockService = {
  //    addVendorSpyOn: jasmine.createSpy('addVendor').and.returnValue(Observable.of(iProModelRes)),
  //  }
  //  mockService.addVendorSpyOn().subscribe((value) => {
  //    fakeResponse = value;
  //  })
  //  expect(fakeResponse).toBeDefined();
  //  expect(fakeResponse).toBe(iProModelRes);
    
  //});
});
