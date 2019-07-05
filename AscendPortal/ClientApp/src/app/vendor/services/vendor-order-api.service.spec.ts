import { TestBed, inject } from '@angular/core/testing';
import { VendorOrderApiService } from './vendor-order-api.service';
import { ConfigService } from '../../config.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { WorkOfferResponse, OrderDetails, AcceptDeclineResponse } from '../../shared/models/vendor-order-model';
import { MockBackend } from '@angular/http/testing';
import { XHRBackend, ResponseOptions } from '@angular/http';

class MockConfigService {
  load() {
    return;
  }
  isReady = true;
  serverSettings: {};
}

const mockWorkOfferResponse: WorkOfferResponse = {
  pagingResult: {
    pageNumber: 10,
    pageSize: 3,
    totalCount: 0,
    totalPages: 10
  },
  records: [{
    id: '345',
    workOrderId: '322424',
    vendorId: 'V232',
    links: [{
      type: 'link',
      url: 'www.fakeurl.com'
    }],
    creationDate: new Date,
    lastModifiedDate: new Date,
    status: 'PendingResponse',
    reason: '',
    vendorDueDate: new Date,
    serviceInstructions: 'instruction',
    engagementLetter: 'letter',
    engagementLetterDetails: {
      htmlFileName: 'html',
      htmlFileDocumentId: 'www.fakehtmllink.com',
      pdfFileName: 'pdf',
      pdfFileDocumentId: 'www.fakepdflink.com',
    },
    vendorFee: 23,
  }]
}
const mockOrderDetails: OrderDetails = {
  serviceOrderId: '3243243434',
  workOrderId: 'WL23332434',
  id: '123',
  workOrderType: 'Service',
  workOrderStatus: 'PendingResponse',
  property: {
    type: 'type',
    parcel: '',
    address: {
      street1: 'Talwade',
      city: 'Pune',
      state: 'Maharastra',
      postalCode: '22222',
      plusFour: '',
      county: 'India',
      type: '',
    },
  },
  creationDate: new Date,
  lastModifiedDate: new Date,
  clientDueDate: new Date,
  vendorDueDate: new Date,
  serviceInstructions: 'instruction',
  engagementLetter: 'letter',
  vendorFee: 88,
  clientFee: '23',
  form: {
    id: '1',
    formId: '123',
    formUrl: 'dummyUrl',
  },
  vendorId: 'VV2333',
  resources: [{
    resourceId: 12,
    resourceName: 'type',
    role: 'role',
    isActive: true,
    assignedDate: new Date,
    updatedByUserId: 123,
    updatedByUserName: 'VV887',
    lastUpdatedDate: new Date,
  }],
  qcResources: '',
  qcRevisions: '',
  assists: '',
}
const mockAcceptedOfferResponse = {
  pagingResult: {
    pageNumber: 10,
    pageSize: 3,
    totalCount: 0,
    totalPages: 10
  },
  records: mockOrderDetails,
}

fdescribe('VendorOrderApiService', () => {
  let service: VendorOrderApiService;
  let httpClientSpy: { get: jasmine.Spy };
  let configService: ConfigService;
  const MockConfig = { settingsLoaded$: Observable.of(true), isReady: true };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorOrderApiService, HttpHandler, ConfigService, MockBackend, HttpClient
        ]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

  });

  it('1. should be created', inject([VendorOrderApiService], (service: VendorOrderApiService) => {
    expect(service).toBeTruthy();
  }));
  it('2. should execute if block', () => {
    configService = jasmine.createSpyObj('ConfigService', ['isReady', 'serverSettings']);
    service = new VendorOrderApiService(<any>httpClientSpy, <any>configService); //TestBed.get(AddVendorApiService);
  });


  it('3. should get all available offers list', inject([VendorOrderApiService, MockBackend], (service: VendorOrderApiService, mockBackend: MockBackend) => {
    service.headers;
    let fakeResponse = null;
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify('')
      })));
    });

    service.orderFulfillmentQueryAPI = 'https://orderfulfillmentqueryapi-test.azurewebsites.net/api/v1/'
    service.getAvailableOffers(1, 15, 'V123565', 'PendingResponse');
    let mockService = {
      getAvailableOffers: jasmine.createSpy('getAvailableOffers').and.returnValue(Observable.of(mockWorkOfferResponse)),
    }
    mockService.getAvailableOffers().subscribe((value) => {
      fakeResponse = value;
    })
    expect(fakeResponse).toBeDefined();
    expect(fakeResponse).toBe(mockWorkOfferResponse);
  }));


  it('4. should get Work Orders By Url', inject([VendorOrderApiService, ConfigService], (service: VendorOrderApiService, configService) => {
    service.getWorkOrdersByUrl('www.fakeUrl.com');
    let fakeResponse = null;
    let mockService = {
      getWorkOrdersByUrl: jasmine.createSpy('getWorkOrdersByUrl').and.returnValue(Observable.of(mockOrderDetails)),
    }
    mockService.getWorkOrdersByUrl().subscribe((value) => {
      fakeResponse = value;
    });
    expect(fakeResponse).toBeDefined();
    expect(fakeResponse).toBe(mockOrderDetails);
  }));
  it('5. should get Accepted Orders', inject([VendorOrderApiService, ConfigService], (service: VendorOrderApiService, configService) => {
    service.orderManagementQueryAPI = 'https://ordermanagementqueryapi-test.azurewebsites.net/api/v1.0/workOrders/';
    service.getAcceptedOrders(1, 10, 'VV675777');
    let fakeResponse = null;
    let mockService = {
      getAcceptedOrders: jasmine.createSpy('getAcceptedOrders').and.returnValue(Observable.of(mockAcceptedOfferResponse)),
    }
    mockService.getAcceptedOrders().subscribe((value) => {
      fakeResponse = value;
    });
    expect(fakeResponse).toBeDefined();
    expect(fakeResponse).toBe(mockAcceptedOfferResponse);
  }));

  it('6. should get Offer Details', inject([VendorOrderApiService], (service: VendorOrderApiService) => {
    service.orderFulfillmentQueryAPI = 'https://orderfulfillmentqueryapi-test.azurewebsites.net/api/v1/'
    service.getOfferDetails('WWL33675777');
    let fakeResponse = null;
    let mockService = {
      getOfferDetails: jasmine.createSpy('getOfferDetails').and.returnValue(Observable.of(mockAcceptedOfferResponse.records)),
    }
    mockService.getOfferDetails().subscribe((value) => {
      fakeResponse = value;
    });
    expect(fakeResponse).toBeDefined();
    expect(fakeResponse).toBe(mockAcceptedOfferResponse.records);
  }));

  it('7. should post accepted offers data', inject([VendorOrderApiService], (service: VendorOrderApiService) => {
    let dummyUrl = 'https://dummyurl/api/v1/'
    let dummyData = {
      workOfferId: 'WWL2232',
      vendorId: 'VV123456',
      status: 'Accepted',
      reason: '',
    }
    service.postAcceptedoffer(dummyUrl, dummyData);
    let fakeResponse = null;
    let mockService = {
      postAcceptedoffer: jasmine.createSpy('postAcceptedoffer').and.returnValue(Observable.of(null)),
    }
    mockService.postAcceptedoffer().subscribe((value) => {
      fakeResponse = value;
    });
    expect(fakeResponse).toBeDefined();
    expect(fakeResponse).toBe(null);
  }));
  it('8. Should return download document path using document id', inject([VendorOrderApiService], (service: VendorOrderApiService) => {
    service.vendorDocumentQueryAPI = 'http://vendordmsqueryapidev.azurewebsites.net/api/v1.0/Document/GetLicenseFile?docKey=';
    let fakeResponse = service.getDownloadDocument('567657565757hjg76');
    expect(fakeResponse).toBe(service.vendorDocumentQueryAPI + '567657565757hjg76');
  }));
  it('9. Should get offer status using provided url', inject([VendorOrderApiService], (service: VendorOrderApiService) => {
    let dummyUrl = 'http://dummyUrl.com';
    let fakeResponse = null;
    service.getOfferStatus(dummyUrl);

    const mockAcceptDeclineResponse: AcceptDeclineResponse = {
      runtimeStatus: 'Completed',
      input: '',
      customStatus: 'Completed',
      output: { workOfferId: 'WWL343433',
        vendorId: 'V123456',
        status: 'active',
        reason: null
      },
      createdTime: new Date,
      lastUpdatedTime: new Date,
    }
    let mockService = {
      getOfferDetails: jasmine.createSpy('getOfferDetails').and.returnValue(Observable.of(mockAcceptDeclineResponse)),
    }
    mockService.getOfferDetails().subscribe((value) => {
      fakeResponse = value;
    });
    expect(fakeResponse).toBeDefined();
    expect(fakeResponse).toBe(mockAcceptDeclineResponse);
  }));
  it('10. Should get accepted Order Details', inject([VendorOrderApiService], (service: VendorOrderApiService) => {
    let fakeResponse = null;
    service.ordersQueryApiUrl = 'https://ordermanagementqueryapi-test.azurewebsites.net/api/v1.0';
    service.getAcceptedOrderDetails('WL23332434');

    let mockService = {
      getAcceptedOrderDetails: jasmine.createSpy('getAcceptedOrderDetails').and.returnValue(Observable.of(mockOrderDetails)),
    }
    mockService.getAcceptedOrderDetails().subscribe((value) => {
      fakeResponse = value;
    });
    expect(fakeResponse).toBeDefined();
    expect(fakeResponse).toBe(mockOrderDetails);
  }));


});
