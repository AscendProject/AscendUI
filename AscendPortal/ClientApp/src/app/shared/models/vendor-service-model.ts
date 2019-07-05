export class CoverageModel {
  state: string;
  county: string;
  zipCode: string;
  pricing: string;
  tat: string;
  coverageStatus: string;

  constructor() { }
}

export class StatesModel {
  records: StateListModel[];
  pagingResult: PageResultModel[];
  partitionKey: number;
  rowKey: number;
  timestamp: Date;
  eTag: number;
}

export class StateListModel {
  abbreviation: string;
  name: string;
}

export class PageResultModel {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

export class CountiesModel {
  stateAbbreviation: string;
  counties: CountyModel[];
  constructor() { }
}

export class CountyModel {
  countyName: string;
  zipcode: any[];
}

export class Dictionary {
  IsAppraisalInsuranceValid: string;
  IsAppraisalLicenseValid: string;
  Appraisal: string;
  IsBrokerInsuranceValid: string;
  IsBrokerLicenseValid: string;
  Broker: string;
  serviceType: string;
}

export class CoverageAreas {
  states: StateListModel;
  counties: CountiesModel;
  zipCodes: CountyModel;
}

export class ListServices {
  vendorId: string;
  serviceName: string;
  id: string;
  coverageAreas: CoverageAreas;
  isSelected: boolean;
  rating: number;
}

export class VendorServiceList {
  dictionary: Dictionary;
  listservices: ListServices[];
}

export class ListServicesResponse {
  vendorId: string;
  serviceName: string;
  id: string;
  coverageAreas: CoverageAreas;
  createdDate: string;
  lastModifiedDate: string;
  isSelected: boolean;
  rating: number;
  updatedVendorSection: number;
}

export class RatingResponse {
  vendorServices: ListServicesResponse[];
  isSuccessful: boolean;
  failureReason: string;
}

