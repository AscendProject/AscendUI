export interface IVendorLicense {
  licenseType: string;
  licenseNumber: string;
  licenseState: string;
  effectiveDate: Date;
  expirationDate: Date;
  lastDateVerified: Date;
  lastVerifiedResult: string;
  verificationMethod: string;
}
export interface IVendorLicenseModel {
  vendorName: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  suffix: string;
  license: IVendorLicense;
}
