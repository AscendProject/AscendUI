export interface BackgroundcheckModel {
  vendorId: string;
  backgroundCheckId: string;
  backgroundCheckInfo: {
    referenceID: string;
    resultType: string;
    reportDate: Date;
    expirationDate: Date;
    bgCompanyName: string;
    typeOfbgCheck: string;
    isDeleted: boolean;
  }
}

export interface backgroundCheckInfo {
  backgroundCheckId: string;
  referenceID: string;
  resultType: string;
  reportDate: Date;
  expirationDate: Date;
  bgCompanyName: string;
  typeOfbgCheck: string;
  isDeleted: boolean;
}


