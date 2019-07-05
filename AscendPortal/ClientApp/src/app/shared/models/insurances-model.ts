export interface IVendorName {
  vendorName: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  suffix: string;
}
export interface IVendorAddress {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
}
export interface IVendorInsurance {
  insuranceType: string;
  insuranceCarrier: string;
  policyNumber: string;
  effectiveDate: Date;
  expirationDate: Date;
  lastDateVerified: Date;
  lastVerifiedResult: string;
  verificationMethod: string;
  coveragePerClaim: string;
  coveragePerYear: string;
}
export interface SortCriteria {
  sortColumn: string;
  sortDirection: string;
}
export interface IVendorHistory {
  propertyName: string;
  newValue: string;
  oldValue: string;
  timestamp: string;
  partitionKey: string;
  rowKey: string;
  eTag: string;
}
export interface IVendorInsuranceModel {
  vendorName: string;
  company: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  suffix: string;
  address: IVendorAddress;
  insurance: IVendorInsurance;
}
