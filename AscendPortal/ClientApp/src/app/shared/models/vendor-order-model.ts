export interface Acceptedorders {
  Service: string,
  ServiceStatus: string,
  Order: string,
  VendorDueDate: Date,
  ClientDueDate: Date,
  BorrowerName: string,
  Street: string,
  City: string,
  State: string,
  Zip: number

}

export class ServiceOrderDetails {
  public qcFailReasons: string;
  public loanNumber: string;
  public loanPurpose: string;
  public loanType: string;
  public borrowerFirstName: string;
  public borrowerLastName: string;
  public clientName: string;
}


export interface OfferDetails {
  Service: string,
  ClientDueDate: Date,
  Street: string,
  City: string,
  State: string,
  Zip: number
}

export interface OrdersDetails {
  ServiceStatus: string,
  Order: string,
  OfferId: string,
  Letter: string,
  VendorDueDate: Date,
  VendorFee: string,
  Service: string,
  ClientDueDate: Date,
  Street: string,
  City: string,
  State: string,
  Zip: string;
}

export interface IWorkOrder {
  vendorId: string;
  updatedStatus: string;
  workOrderId: string;
  acceptedDateTime: Date;
  eventCode: string;

}

export interface IAcceptOffer {
    acceptOffer: IOrderStatusChange;
}

export interface IOrderStatusChange {
  workOfferId: string,
  vendorId: string,
  status: string,
  reason: any
}

export interface IOfferOrderDetails {
  address: string,
  service: string,
  vendorFee: number,
  vendorDueDate: Date,
  engagementLink: string,
  clientName: string

}

export interface OrderSearchCriteria {
  sortColumn: string;
  sortDirection: string;
}



export class DeclineOrderDialog {
  fee: boolean;
  tat: boolean;
  complexity: boolean;
  outOfOffice: boolean;
  coverageArea: boolean;
  capacity: boolean;
  comment: boolean;
  constructor() {
  }
}

export class DeclineOrderForm {
  fee: string;
  tat: Date;
  feeMessage: string;
  userComment: string;
  constructor() {
  }
}

export class OrderDocuments {
  htmlFileName: string;
  htmlFileDocumentId: string;
  pdfFileName: string;
  pdfFileDocumentId: string;
  constructor() {
  }
}

export class IDeclineConditions {
  type: string;
  status: boolean;
  counterOffer: string;
  reason: string;
  constructor() {
  }
}

export class PagingResult {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  constructor() {
  }
}

export class UrlLinkModel {
  type: string;
  url: string;
}

export class AvailableOffers {
  id: string;
  workOrderId: string;
  vendorId: string;
  links: UrlLinkModel[];
  creationDate: Date;
  lastModifiedDate: Date;
  status: string;
  reason: string;
  vendorDueDate: Date;
  serviceInstructions: string;
  engagementLetter: string;
  engagementLetterDetails: OrderDocuments;
  vendorFee: number;

}

export class WorkOfferResponse {
  pagingResult: PagingResult;
  records: AvailableOffers[];
}

export class AcceptedOfferResponse {
  pagingResult: PagingResult;
  records: OrderDetails[];

}

export class Resources {
  resourceId: number;
  resourceName: string;
  role: string;
  isActive: boolean;
  assignedDate: Date;
  updatedByUserId: number;
  updatedByUserName: string;
  lastUpdatedDate: Date;
}

export class OrderDetailsForm {
  id: string;
  formId: string;
  formUrl: string;
}

export class Address {
  street1: string;
  city: string;
  state: string;
  postalCode: string;
  plusFour: string;
  county: string;
  type: string;
}

export class Property {
  type: string;
  parcel: string;
  address: Address;
}

export class OrderDetails {
  serviceOrderId: string;
  workOrderId: string;
  id: string;
  workOrderType: string;
  workOrderStatus: string;
  property: Property;
  creationDate: Date;
  lastModifiedDate: Date;
  clientDueDate: Date;
  vendorDueDate: Date;
  serviceInstructions: string;
  engagementLetter: string;
  vendorFee: number;
  clientFee: string;
  form: OrderDetailsForm;
  vendorId: string;
  resources: Resources[];
  qcResources: string;
  qcRevisions: string;
  assists: string;
}

export class AcceptDeclineResponse {
  runtimeStatus: string;
  input: string;
  customStatus: string;
  output: IOrderStatusChange;
  createdTime: Date;
  lastUpdatedTime: Date;
}
