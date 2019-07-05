import { TestBed, inject } from '@angular/core/testing';
import { BackgroundcheckService } from './backgroundcheck.service';
import { backgroundCheckInfo, BackgroundcheckModel } from '../../shared/models/backgroundcheck-model';
import { MockBackend } from '@angular/http/testing';
import { XHRBackend, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ConfigService } from '../../config.service';


class MockConfigService {
  load() {
    return;
  }
  isReady = true;
  serverSettings: {};
}

const mockBackgroundCheckDetailsResponse: BackgroundcheckModel = {
  vendorId: "VIV9059954",
  backgroundCheckId: "c3da3281-1021-4d3b-9c5a-20a2904040fc",
  backgroundCheckInfo: {
    referenceID: "85746465465",
    resultType: "Pass",
    reportDate: new Date,
    expirationDate: new Date,
    bgCompanyName: "ABC Crop",
    typeOfbgCheck: "Criminal & OFAC",
    isDeleted: true,
  }
  }


fdescribe('BackgroundcheckService', () => {
  let service: BackgroundcheckService;
  let httpClientSpy: { get: jasmine.Spy };
  let configService: ConfigService;
  const MockConfig = { settingsLoaded$: Observable.of(true), isReady: true };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackgroundcheckService, HttpHandler, ConfigService, MockBackend, HttpClient
      ]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

  });

  it('1 should be created', inject([BackgroundcheckService], (service: BackgroundcheckService) => {
    expect(service).toBeTruthy();
  }));

  
  it('2. should execute if block', () => {
    configService = jasmine.createSpyObj('ConfigService', ['isReady', 'serverSettings']);
    service = new BackgroundcheckService(<any>httpClientSpy, <any>configService); //TestBed.get(AddVendorApiService);
  });

  it('3. should view background check details', inject([BackgroundcheckService, MockBackend], (service: BackgroundcheckService, mockBackend: MockBackend) => {
    //service.headers;
    let fakeResponse = null;
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify('')
      })));
    });

    service.vendorqueryUrl = 'https://vendorqueryapi-test.azurewebsites.net/api/v1.0/'
    service.viewBackgroundCheckItem("c3da3281 - 1021 - 4d3b- 9c5a- 20a2904040fc");
    let mockService = {
      viewBackgroundCheckItem: jasmine.createSpy('viewBackgroundCheckItem').and.returnValue(Observable.of(mockBackgroundCheckDetailsResponse)),
    }
    mockService.viewBackgroundCheckItem().subscribe((value) => {
      fakeResponse = value;
    })
    expect(fakeResponse).toBeDefined();
    expect(fakeResponse).toBe(mockBackgroundCheckDetailsResponse);
  }));
});
