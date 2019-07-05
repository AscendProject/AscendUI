export class WorkOffer {
    public workOrderId: string;    
    public id: string;
    public workOrderType:string;
    public vendorId: string;
    public status: string;
    public vendorDueDate: Date;    
    public serviceInstructions: string;
    public engagementLetter: string;
    public vendorFee: Int16Array;
    public engagementLetterDetails: Array<string>;
    public links: Array<Link>;
    // public engagementLetterUrl: Array<string>;
    
}

export class Link{
 public type :string;
 public url :string;
}

export class WorkOfferModel {
    public records: WorkOffer[];
}