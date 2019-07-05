import { PagingResult } from "./pagingresult.model";

export class LoanDetails {
    public closingDate: object;
    public fhaCaseNumber: object;
    public loanInterest: object;
    public loanNumber: object;
    public loanPurpose: object;
    public loanType: object;
}

export class Address {
    public street1: string;
    public city: string;
    public state: string;
    public postalCode: string;
    public plusFour: string;
    public county: string;
    public type: string;
}

export class BorrowerInfo {
    public FirstName: string;
    public LastName: string;
    public Address: Address;
}

export class ClientDetails {
    public first: object;
    public last: object;
    public email: object;
    public primaryPhone: object;
}

export class ServiceOrder {
    public enterpriseRequestID: string;
    public serviceOrderID: string;
    public serviceName: string;
    public serviceOrderStatus: string;
    public loanDetails: LoanDetails;
    public borrowerInfo: BorrowerInfo;
    public clientDetails: ClientDetails;
    public property: object;
    public creationDate: Date;
    public lastModifiedDate: object;
    public clientDueDate: string;
    public clientFee: string;
    public resources: object;
}

export class ServiceOrderModel {
    public records: ServiceOrder[];
}

export class ServiceOrderDetails {
    public records: Array<ServiceOrder>;
    public pagingResult:PagingResult;
}

