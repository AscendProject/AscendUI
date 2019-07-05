export interface IAddDisciplinary {
    vendorId: String;
    licenseId: string;
    diciplinaryActionId: string;
    diciplinaryAction: {
        disciplinaryAction: string;
        activeResolved: string;
        effectiveDate: Date;
        expirationDate: Date;
        comments: string;
        isDeleted: boolean;
    }
  }
  export interface IAddDisciplinaryModelResponse {
    isSuccessful: boolean;
    failureReason: string;
  }
export interface IShowDisciplinary
  {
    id: string;
    diciplinaryActionId: string;
    licenseId: string;
    diciplinaryAction: {
      disciplinaryAction: string;
      activeResolved: string;
      effectiveDate: Date;
      expirationDate: Date;
      comments: string;
      isDeleted: boolean;
    }
  }

export interface showDisciplinaryInfo {
  diciplinaryActionId: string;
  disciplinaryAction: string;
  activeResolved: string;
  effectiveDate: Date;
  expirationDate: Date;
  comments: string;
  isDeleted: boolean;
}

export interface deleteDisciplinaryAction {
  diciplinaryActionId: string;
}
