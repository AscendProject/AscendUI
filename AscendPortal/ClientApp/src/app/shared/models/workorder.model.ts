import { PagingResult } from "./pagingresult.model";

export class Address {
    public street1: string;
    public city: string;
    public state: string;
    public postalCode: string;
    public plusFour: string;
    public county: string;
    public type: string;
}

export class Property {
    public type: string;
    public parcel: string;
    public address: Address;
}

export class Form {
    public id: string;
    public formId: string;
    public formUrl: string;
}

export class Resource {
    public resourceId: number;
    public resourceName: string;
    public role: string;
    public isActive: boolean;
    public assignedDate: Date;
    public updatedByUserId: number;
    public updatedByUserName: string;
    public lastUpdatedDate: Date;
}

export class WorkOrder {
    public serviceOrderId: string;
    public workOrderId: string;
    public id: string;
    public workOrderType: string;
    public workOrderStatus: string;
    public property: Property;
    public creationDate: Date;
    public lastModifiedDate: Date;
    public clientDueDate: Date;
    public vendorDueDate: Date;
    public serviceInstructions: string;
    public engagementLetter: string;
    public vendorFee: number;
    public clientFee: number;
    public form: Form;
    public vendorId: object;
    public resources: Array<Resource>;
    public qcResources: object;
    public qcRevisions: object;
}

export class WorkOrderModel {
    public records: WorkOrder[];
}

export class WorkOrderDetails {
    public records: Array<WorkOrder>;
    public pagingResult: PagingResult;
}

