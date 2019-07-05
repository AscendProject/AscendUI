export interface Config {
    serviceOrderUrl: string;
    workOrderUrl: string;
    exceptionLogUrl: string;
}
export interface IConfiguration {
    serviceOrdersURL: string;
    serviceOrderbyIdURL: string;
    workOrdersURL: string;
    workOrderbyIdURL: string;
    workOrdersbyServiceOrderIdURL: string;
    vendorbyIdURL: string;
    orderManagementCommandAPI: string;
    orderManagementQueryAPI: string;
    orderFulfillmentCommandAPI: string;
    orderFulfillmentQueryAPI: string;
    vendorProfileQueryAPI: string;
    workOfferQueryAPI: string;
    vendorProfileCommandAPI: string; 
    vendorCoverageAreaQueryAPI: string;
    vendorCoverageAreaCommandAPI: string;
    vendorDocumentQueryAPI: string;
    applicationInsightsInstrumentationKey: string;
    vendorACHInformationCommandAPI: string;
    vendorACHInformationQueryAPI: string;
    vendorHistoryQueryAPI: string
    urlServicesQueryApi: string;
    servicesCommandApi: string;
    urlVendorProfileCommandApi: string;
    vendorSearchqueryAPI:string;
    azureSearchKey:string;
    vendorDocumentCommandAPIAsPDF:string;
    vendorDocumentCommandAPI:string;
  
  commentsManagementQueryAPI: string;
  commentsManagementCommandAPI: string;
}


