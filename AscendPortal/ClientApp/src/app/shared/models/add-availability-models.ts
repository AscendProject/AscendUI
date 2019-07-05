export interface IAvailability {
    vendorId: string;
    updatedVendorSection: number;
    vendorAvailability: [{
      availabilityId: string;
        startDate: Date;
        availabilityDate: Date;
        reasons: string;
        isUntilFurtherNotice: boolean;
    }]
  }
  export interface IAvailabilityModelResponse {
    isSuccessful: boolean;
    failureReason: string;
      vendorAvailability: [{
        availabilityId: string;
        startDate: any;
        availabilityDate: any;
        reasons: string;
        isUntilFurtherNotice: boolean;
      }]
  }
