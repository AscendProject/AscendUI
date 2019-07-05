export class VendorName {
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public suffix: string;
    public preferredName: string;
    public isStaffAppraiser: boolean;
}

export class VendorAddress {
    public streetAddress: string;
    public city: string;
    public state: string;
    public zipcode: string;
    public addressType: string;
    publicisMailingAddressDifferent: boolean;
}

export class VendorCompany {
    public companyName: string;
    public state: string;
}

export class VendorDetails {
    public vendorId: string;
    public id: string;
    public vendorName: VendorName;
    public vendorEmail: object;
    public vendorAddress: VendorAddress;
    public vendorServiceType: object;
    public vendorCompany: VendorCompany;
    public vendorPhone: object;
    public rank: number;
    public reason : object;
    public autoSelect : boolean;
}

export class VendorDetailsList {
    public records: Array<VendorDetails>;
}

export class VendorSerchQuery{
    public search: string;  
     public searchFields: string;  
     public select: string ;
    public  top:number;
    public  skip:number;
    public count:boolean;
}
export class VendorAdvSearchQuery{
    public search: string;  
     public searchFields: string;  
     public select: string ;
    public  top:number;
    public  skip:number;
    public count:boolean;
    public filter: string;
}
export interface showAdvancedSearchInfo {
    vendorId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    preferredName: string;
  }
  export interface IAdvancedSearchResponse
    {
    firstName: string,
    middleName: string,
    preferredName: string,
    vendorId: string,
    //serviceTypes:[],
    lastName: string,
    companyState: string,
    vendorState: string
    }