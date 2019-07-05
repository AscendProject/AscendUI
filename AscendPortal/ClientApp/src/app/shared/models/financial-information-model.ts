// export interface IFinancialInformationModel {
//  Name: string;
//  Address: IMailingAddress;
//  Contact: IContact;
//  Payment: IPayment;
//  W9: IW9;
//  Attributes: IVendorAttributes;
//  RequestId: string;
//  SourceSystem: string;
// }

export interface IFinancialInformationModel {
  vendorId: string;
  paymentMethod: string;
  bankName: string;
  accountHolderName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
  taxIdType: string;
  taxId: string;
}


export interface IW9FileInfo {
  VendorId: string;
  DocumentData: IW9DocumentInformation[];
}

export interface IW9DocumentInformation {
  DocumentKey: string;
  FileName: string;
  UploadedDate: Date;
}

export interface IFinancialInformationModelResponse {
  isSuccessful: boolean;
  failureReason: string;
  Name: string;
  Address: IMailingAddress;
  Contact: IContact;
  Payment: IPayment;
  W9: IW9;
  Attributes: IVendorAttributes;
  RequestId: string;
  SourceSystem: string;

}

export interface IW9FileInfoResponse {
  VendorId: string;
  DocumentData: IW9DocumentInformation[];
}

export interface IMailingAddress {
  Address1: string;
  Address2: string;
  City: string;
  StateAbbreviation: string;
  PostalCode: string;
  CountryCode: string;
}

export interface IContact {
  Phone1: string;
  Phone2: string;
  Fax: string;
  Email: string;
}

export interface IPayment {
  PaymentMethod: string;
  ACH: IACH;
  PayToVendor: string;
  PaymentFrequency: string;
}

export interface IACH {
  BankName: string;
  BankNumber: string;
  BranchName: string;
  BankAccountNumber: string;
  BankCountryCode: string;
}

export interface IW9 {
  LegalName: string;
  TaxID: string;
}

export interface IVendorAttributes {
  PlatformNumber: string;
  VendorType: string;
}


