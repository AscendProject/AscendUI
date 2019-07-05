import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoverageModel, CountiesModel, StatesModel, VendorServiceList, RatingResponse } from '../shared/models/vendor-service-model';
import {
  IVendorName, IVendorAddress, IVendorAddressInfo, IServiceType, IVendorEmail,
  IVendorPhone, ICompanyInformation, IVendorProfileModel, IVendorProfileModelResponse, IVendorCommunicationModel
} from '../shared/models/add-vendor-model';
import {
  IVendorLicense, IVendorLicenseModel
} from '../shared/models/license-model';
import {
  IVendorInsurance, IVendorInsuranceModel
} from '../shared/models/insurances-model';
import { HttpService } from '../shared/httpService/http.service';
import { ConfigService } from '../config.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { GlobalErrorHandler } from '../shared/globalError_handler/global-error-handler';
import { Sandbox } from '../shared/base.sandbox';
import { VendorApiService } from './services/vendor-api.service';
import { AddVendorApiService } from './services/add-vendor-api.service';
import { LicenseService } from './services/license.service';
import { InsurancesService } from './services/insurances.service';
import { ListInsurancesLicensesService } from './services/list-insurances-licenses.service';
import { VendorOrderApiService } from './services/vendor-order-api.service';
import { VendorServiceService } from './services/vendor-service.service';
import { DisciplinaryService } from './services/disciplinary.service';
import { WorkOfferResponse, AcceptedOfferResponse, AvailableOffers, OrderDetails, AcceptDeclineResponse} from '../shared/models/vendor-order-model';
import { FinancialInformationService } from './services/financial-information.service';
import { BackgroundcheckService } from './services/backgroundcheck.service';
import { ResourceService} from '../shared/services/resource.service';
import {
  IFinancialInformationModel, IFinancialInformationModelResponse,
  IACH, IContact, IMailingAddress, IPayment, IVendorAttributes, IW9, IW9FileInfo, IW9FileInfoResponse
} from '../shared/models/financial-information-model';
import {IAddDisciplinary, IAddDisciplinaryModelResponse, deleteDisciplinaryAction} from '../shared/models/disciplinary-model';
import {
  BackgroundcheckModel
} from '../shared/models/backgroundcheck-model';
import { IAvailabilityModelResponse } from '../shared/models/add-availability-models';
import { ICapacityModelResponse } from '../shared/models/add-vendor-model';
import { AvailabilityService } from './services/availability.service';  
import { ContactVendorApiService } from './services/contact-vendor-api.service';
import { OrderCommentService } from './services/order-comment.service';

@Injectable()
export class VendorSandbox {

  constructor(private httpService: HttpService,
    private globalErrorHandler: GlobalErrorHandler,
    private vendorService: VendorApiService,
    private licenseService: LicenseService,
    private insurancesService: InsurancesService,
    private listinsurancelicenseService: ListInsurancesLicensesService,
    private vendorOrderApiService: VendorOrderApiService,
    private addVendorService: AddVendorApiService,
    private backgroundcheckService: BackgroundcheckService,
    private vendorServiceService: VendorServiceService,
   
    private disciplinaryService: DisciplinaryService,
    private financialInformationService: FinancialInformationService,
      private availabilityService: AvailabilityService,
      private contactService: ContactVendorApiService,
      private resourceService: ResourceService,
    
    private orderCommentService: OrderCommentService) {
    this.registerEvents();
  }
  public stateList$: Observable<StatesModel>;
  public countyList$: Observable<CountiesModel>;
  public addVendor$: Observable<IVendorProfileModelResponse>;
  public addBackgroundCheck$: Observable<BackgroundcheckModel>;
  public editBackgroundCheck$: Observable<BackgroundcheckModel>;
  public updateVendor$: Observable<IVendorProfileModel>;
  public getvendorIdList$: Observable<IVendorProfileModelResponse>;
  public editVendorRating$: Observable<IVendorProfileModelResponse>;
  public addLicense$: Observable<IVendorLicenseModel>;
  public editLicense$: Observable<IVendorLicenseModel>;
  public addInsurances$: Observable<IVendorInsuranceModel>;
  public editInsurances$: Observable<IVendorInsuranceModel>;
  public showLicensesList$;
  public getVendorServicesInfoList$: Observable<VendorServiceList>;
  public getVendorCoverageStatesList$;
  public getVendorCoverageCountiesList$;
  public getVendorAllServicesList$;
  public showInsurancesList$;
  public showBackgroundCheckList$: Observable<BackgroundcheckModel>;
  public deleteBackgroundCheckList$: Observable<BackgroundcheckModel>;
  public viewBackgroundCheckItem$: Observable<BackgroundcheckModel>;

  public getlicenseIdList$;
  public getinsuranceIdList$;
  public availableOrder$: Observable<WorkOfferResponse>;
  public acceptedOrder$: Observable<AcceptedOfferResponse>;
  public selectedOfferDetails$: Observable<AvailableOffers>;
  public workOrdersByUrl$: Observable<OrderDetails>;
  public acceptWorkOffer$: Observable<any>;
  public offerStatus$: Observable<AcceptDeclineResponse>;
  public acceptedOrderDetails$: Observable<OrderDetails>;
  public documentDownload$: string;
  public getvendorList$
  public addServiceCoverageResp$
  public addedFinancialInformation$: Observable<IFinancialInformationModelResponse>;
  public updatedFinancialInformation$: Observable<IFinancialInformationModelResponse>;
  public vendorFinancialInformation$: Observable<IFinancialInformationModelResponse>;
  public addedW9Information$: Observable<IW9FileInfoResponse>;
  public updatedW9Information$: Observable<IW9FileInfoResponse>;
  public vendorW9Information$: Observable<IW9FileInfoResponse>;
  public addDisciplinary$: Observable<IAddDisciplinaryModelResponse>;
  public showDisciplinaryActionList$;
  public deleteDisciplinaryActionList$: Observable<deleteDisciplinaryAction>;;
  public getDisciplinaryDataById$;
  public editDisciplinary$;
  serviceOrderDetails$;
  public addAvailability$: Observable<IAvailabilityModelResponse>;
  public addCapacity$: Observable<IVendorProfileModelResponse>;
  // public addCapacity$: string;
  public addVendorAvailability: string;
  public getInsuranceHistry$;  
  public getVendorContactInformation$;
  public updateVendorContactInfo$;
  public addServiceRating$: Observable<RatingResponse>;
  public updateServiceRating$: Observable<RatingResponse>;
  public getVendorSearchResults$;
  public getVendorAdvancedSearchResults$;
  public resourceList$; 
  public getCommentsDetailsListByOrderId$;
  public addComments$;

  public getStateList(): void {
    this.stateList$ = this.vendorService.getStateListApi();
  }
  public getCountyList(stateName: string): void {
    this.countyList$ = this.vendorService.getCountyListApi(stateName);
  }
  /*  Add Vendor api */
  public addVendorList(IVendorProfileModel) {
    this.addVendor$ = this.addVendorService.addVendor(IVendorProfileModel);
    return this.addVendor$;
  }

  /*  Add background api */
  public addBackgroundCheck(BackgroundcheckModel) {
    this.addBackgroundCheck$ = this.backgroundcheckService.addBackgroundCheck(BackgroundcheckModel);
    return this.addBackgroundCheck$;
  }

  public editBackgroundCheck(BackgroundcheckModel) {
    this.editBackgroundCheck$ = this.backgroundcheckService.editBackgroundCheck(BackgroundcheckModel);
    return this.editBackgroundCheck$;
  }

  public updateVendorList(IVendorProfileModel): void {
    this.updateVendor$ = this.addVendorService.updateVendor(IVendorProfileModel);
  }
  public getVendorIdList(vendorid: string) {
    this.getvendorIdList$ = this.addVendorService.getVendorId(vendorid);
    return this.getvendorIdList$;
  }
  public getVendorList(page,size) {    
    this.getvendorList$ = this.addVendorService.getVendor(page,size);
    return this.getvendorList$;
  }
  /*update vendor communication score*/ 
  public editVendorRating(IVendorCommunicationModel): void {
    this.editVendorRating$ = this.addVendorService.editVendorCommScore(IVendorCommunicationModel);
  }



  /*   Licens Details api */
  public getLicienceDatabyID(licienceid: string) {
    this.getlicenseIdList$ = this.licenseService.getLicienceDatabyID(licienceid);
    return this.getlicenseIdList$;
  }

  /* Disciplinary api */
  public addDisciplinaryList(IAddDisciplinary) {
    this.addDisciplinary$ = this.disciplinaryService.addDisciplinary(IAddDisciplinary);
    //return this.addVendor$;
    return this.addDisciplinary$;
  }
  public showDisciplinaryActionList(licenseId) {    
    this.showDisciplinaryActionList$ = this.disciplinaryService.getDisciplinaryActions(licenseId);
    return this.showDisciplinaryActionList$;
  }

  public deleteDisciplinaryActionList(diciplinaryActionId, vendorId) {
    this.deleteDisciplinaryActionList$ = this.disciplinaryService.deleteDisciplinaryActions(diciplinaryActionId, vendorId);
    return this.deleteDisciplinaryActionList$;
  }
  
  public getDisciplinaryDataById(vendorId, disciplinaryActionId) {    
    this.getDisciplinaryDataById$ = this.disciplinaryService.getDisciplinaryActionById(vendorId, disciplinaryActionId);
    return this.getDisciplinaryDataById$;
  }
  public EditDisciplinaryList(IAddDisciplinary) {
    this.editDisciplinary$ = this.disciplinaryService.editDisciplinary(IAddDisciplinary);
    return this.editDisciplinary$;
  }

  /* Insurance Details api */

  getInsuranceDatabyID(insuranceid) {
    this.getinsuranceIdList$ = this.insurancesService.getInsuranceDatabyID(insuranceid);
    return this.getinsuranceIdList$;
  }

  /*  Add Licenses api */
  public addLicensesList(IVendorLicenseModel) {
    this.addLicense$ = this.licenseService.addLicense(IVendorLicenseModel);
    return this.addLicense$;
  }

  /* edit license api */
  public editLicenseDetails(IVendorLicenseModel) {
    this.editLicense$ = this.licenseService.editLicenseDetails(IVendorLicenseModel);
    return this.editLicense$;
  }

  /* edit Insurance api */
  public editInsuranceDetails(IVendorInsuranceModel) {
    this.editInsurances$ = this.insurancesService.editInsuranceDetails(IVendorInsuranceModel);
    return this.editInsurances$;
  }
  /*  Add Insurances  api */
  public addinsurancesList(IVendorInsuranceModel) {
    this.addInsurances$ = this.insurancesService.addInsurance(IVendorInsuranceModel);    
    return this.addInsurances$;


  }
  /* List Insurances and Licenses api */
  public showInsuranceList(vendorid: string) {    
    this.showInsurancesList$ = this.listinsurancelicenseService.listInsurances(vendorid);
    return this.showInsurancesList$;
  }


  public showLicenseList(vendorid: string) {
    this.showLicensesList$ = this.listinsurancelicenseService.listLicences(vendorid);
    return this.showLicensesList$;
  }
  /* Gettinng vendor services api */
  public getVendorServicesInfo(vendorid: string) {
    this.getVendorServicesInfoList$ = this.vendorServiceService.listVendorServicesInfo(vendorid);
    return this.getVendorServicesInfoList$;
  }
  /* Gettinng all vendor services api */
  public getVendorAllServices(vendorid: string) {
    this.getVendorAllServicesList$ = this.vendorServiceService.listVendorAllServices(vendorid);
    return this.getVendorAllServicesList$;
  }
  /* Gettinng vendor states api */
  public getVendorCoverageStates(vendorid: string) {
    this.getVendorCoverageStatesList$ = this.vendorServiceService.getAllStatesByLicence(vendorid);
    return this.getVendorCoverageStatesList$;
  }
  /* Gettinng vendor counties api */
  public getVendorCoverageCounties(state: string) {
    this.getVendorCoverageCountiesList$ = this.vendorServiceService.getAllCountiesByState(state);
    return this.getVendorCoverageCountiesList$;
  }
  /*  Add Service coverage api */
  public addServiceCoverage(coverageObj) {
    this.addServiceCoverageResp$ = this.vendorServiceService.addServiceCoverage(coverageObj);
    return this.addServiceCoverageResp$;
  }
  public getAvailableOffers(pageNumber: number, pageSize: number, vendorId: string, offerStatus: string): void {
    this.availableOrder$ = this.vendorOrderApiService.getAvailableOffers(pageNumber, pageSize, vendorId, offerStatus);
  }

  public getAcceptedOrders(pageNumber: number, pageSize: number, vendorId: string): void {
    this.acceptedOrder$ = this.vendorOrderApiService.getAcceptedOrders(pageNumber, pageSize, vendorId);
  }

  public getWorkOrdersByUrl(url: string): void {
    this.workOrdersByUrl$ = this.vendorOrderApiService.getWorkOrdersByUrl(url);
  }

  public getSelectedOfferDetails(workOfferId: string): void {
    this.selectedOfferDetails$ = this.vendorOrderApiService.getOfferDetails(workOfferId);
  }

  public getServiceOrderDetails(serviceOrderId: string): void {
    this.serviceOrderDetails$ = this.vendorOrderApiService.getServiceOrderDetails(serviceOrderId);
  }

  public postAcceptedOffer(url: string, acceptOrderResponse): void {
    this.acceptWorkOffer$ = this.vendorOrderApiService.postAcceptedoffer(url, acceptOrderResponse);
  }

  public getOfferStatus(url: string): void {
    this.offerStatus$ = this.vendorOrderApiService.getOfferStatus(url);
  }

  public getDownloadDocument(documentId: string): void {
    this.documentDownload$ = this.vendorOrderApiService.getDownloadDocument(documentId);
  }

  public getAcceptedOrderDetails(orderId: string): void {
    this.acceptedOrderDetails$ = this.vendorOrderApiService.getAcceptedOrderDetails(orderId);
  }

  /* Get Insurance Histroy */

  getHistory(id, pagesize) {
    this.getInsuranceHistry$ = this.insurancesService.getHistory(id, pagesize);
    return this.getInsuranceHistry$;

  }

  /*  Financial Information api */

  /*  Add Financial Information api */
  public addFinancialInformation(IFinancialInformationModel, vendorid: string) {
    this.addedFinancialInformation$ = this.financialInformationService.addFinancialInformation(IFinancialInformationModel, vendorid);
    return this.addedFinancialInformation$;
  }

  /*  Edit Financial Information api */
  public updateFinancialInformation(IFinancialInformationModel, vendorid: string) {
    this.updatedFinancialInformation$ = this.financialInformationService.updateFinancialInformation(IFinancialInformationModel, vendorid);
    return this.updatedFinancialInformation$;
  }

  /*  Get Financial Information api */
  public getFinancialInformation(vendorid: string) {
    this.vendorFinancialInformation$ = this.financialInformationService.getFinancialInformation(vendorid);
    return this.vendorFinancialInformation$;
  }

   /* Add W9 File Information api */
   public addW9FileInformation(IW9FileInfoModel) {
    this.addedW9Information$ = this.financialInformationService.addW9FileInformation(IW9FileInfoModel);
    return this.addedW9Information$;
  }

    /*  Edit W9 Information api */
    public updateW9FileInformation(IW9FileInfoModel, vendorid: string) {
      this.updatedW9Information$ = this.financialInformationService.updateW9FileInformation(IW9FileInfoModel, vendorid);
      return this.updatedW9Information$;
    }
  
    /*  Get W9 Information api */
    public getW9FileInformation(vendorid: string) {
      this.vendorW9Information$ = this.financialInformationService.getW9FileInformation(vendorid);
      return this.vendorW9Information$;
    }

  /*  Add Availabiilty api */
  public addAvailabilityList(IAvailability) {
    this.addAvailability$ = this.availabilityService.addVendorAvailability(IAvailability);
    return this.addAvailability$;
  }
  public addCapacityList(ICapacity) {
    this.addCapacity$ = this.availabilityService.addVendorCapacity(ICapacity);
    return this.addCapacity$;
  }

  /* List for Backcheckform */
  public showBackgroundCheckList(vendorid: string) {
    
    this.showBackgroundCheckList$ = this.listinsurancelicenseService.listBackgroundCheck(vendorid);
    return this.showBackgroundCheckList$;
  }


  public deleteBackgroundCheckList(backgroundCheckId: string, vendorid: string) {

    this.deleteBackgroundCheckList$ = this.listinsurancelicenseService.deletBackgroundCheck(backgroundCheckId, vendorid);
    return this.deleteBackgroundCheckList$;
  }


  public viewBackgroundCheckItem(backgroudcheckid: string, vendorid: string) {
    
    this.viewBackgroundCheckItem$ = this.backgroundcheckService.viewBackgroundCheckItem(backgroudcheckid, vendorid);
    return this.viewBackgroundCheckItem$;
  }

  public unregisterEvents() {
  }
  /**
   * Subscribes to events
   */
  private registerEvents(): void {
    // Subscribes to culture
  }
  public getVendorContactInfo(vendorid: string) {
    this.getVendorContactInformation$ = this.contactService.getVendorId(vendorid);
    return this.getVendorContactInformation$;
  }
  public updateVendorContactInfo(obj: any) {
    this.updateVendorContactInfo$ = this.contactService.updateVendor(obj);
    return this.updateVendorContactInfo$;
  }

  public addServiceRating(data: object) {
    return this.addServiceRating$ = this.vendorServiceService.addRating(data);
  }

  public updateServiceRating(data: object) {
    return this.updateServiceRating$ = this.vendorServiceService.updateRating(data);
  }

  public getVendorSearchResults(queryData)
{
  this.getVendorSearchResults$=this.addVendorService.vendorSearch(queryData);
  return this.getVendorServicesInfoList$;
}
  public getVendorAdvancedSearchResults(queryData)
  {
  this.getVendorAdvancedSearchResults$=this.addVendorService.vendorSearch(queryData);
  return this.getVendorAdvancedSearchResults$;
  }

    public getResourceList(): void {
        this.resourceList$ = this.resourceService.getResourceListApi();
        return this.resourceList$;
    }

  ///Get Comments
  public getCommentsDetailsListByOrderId(pageNumber: number, pageSize: number, subjectId: string) {
    this.getCommentsDetailsListByOrderId$ = this.orderCommentService.getCommentsBySubjectId(pageNumber, pageSize, subjectId);
    return this.getCommentsDetailsListByOrderId$;
  }

  //Add Comments

  public AddComments(noteText: string, createdByUsername: string, createdByUserId: string, subjectType: string, associatedSubjectId: string) {
    this.addComments$ = this.orderCommentService.addComments(noteText, createdByUsername, createdByUserId, subjectType, associatedSubjectId);
    return this.addComments$;
  }
}
