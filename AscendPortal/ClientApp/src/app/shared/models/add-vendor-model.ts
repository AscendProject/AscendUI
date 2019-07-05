export interface IVendorName {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  preferredName: string;
  isStaffAppraiser: boolean;

}
export interface IVendorAddress {
  StreetAddress: string;
  City: string;
  State: string;
  Zipcode: string;
}

export interface IVendorAddressInfo {
  address: IVendorAddress;
  addressType: string;
  isMailingAddressSame: boolean;
}

export interface IServiceType {
  ServiceType: string[];
}

export interface IVendorEmail {
  Email: string;
  Type: string;
}


export interface IVendorPhone {
  Phone: string;
  numberType: string;
  phoneType: string;
  allowTexts: boolean;
  phoneExtension: string;
}

export interface ICompanyInformation {
  CompanyName: string;
  State: string;
}
export interface IVendorProfileModel {
  name: IVendorName,
  address: IVendorAddressInfo[],
  servicetype: IServiceType,
  email: IVendorEmail[],
  company: ICompanyInformation,
  phone: IVendorPhone[],
  communicationScore:ICommunication,
  capacity:ICapacity
}

export interface IVendorProfileModelResponse {
  isSuccessful: boolean,
  createdVendorId: string,
  uRI: string,
  name: IVendorName,
  address: IVendorAddressInfo[],
  servicetype: IServiceType,
  email: IVendorEmail[],
  company: ICompanyInformation,
  phone: IVendorPhone[],
  failureReason: string,
  communicationScore:ICommunication,
  capacity:ICapacity
}
export interface ICommunication {
  score: number;
}
export interface IVendorCommunicationModel {
  vendorId : string,
  updatedVendorSection: number,
  vendorCommunication: ICommunication
}
export interface ICapacity {
  capacityId: string;
  capacity: number;
}
export interface IVendorCapacityModel {
  vendorId : string,
  updatedVendorSection: number,
  VendorCapacityCommand: ICapacity
}
export interface ICapacityModelResponse {
  isSuccessful: boolean;
  failureReason: string;
  vendorCapacity: [{
    capacityId: string;
    }]
}
