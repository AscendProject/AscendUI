import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, Response } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { VendorComponent } from './vendor.component';
import { VendorRoutingModule } from './vendor.route';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import {SharedModule} from '../shared/shared.module'

import { StarRatingComponent, ConfirmDialogComponent, FileUploaderComponent, SwitchComponent,PaginationFooterComponent,PaginationHeaderComponent,FullPaginationComponent } from '../shared/components/index';

import { TwoDigitDecimaNumberDirective } from '../shared/directives/two-digit-decima-number.directive';
import { OneDigitDecimaNumberDirective } from '../shared/directives/one-digit-decima-number.directive';

import {
  AddcoverageComponent,
  VendorContactInfoComponent,
  LicenseComponent,
  InsurancesComponent,
  OrdersComponent,
  DetailsComponent,
  VendorListComponent,
  VendorAdvancedSearchComponent,
  CoverageComponent,
  AddvendorComponent,
  AddressComponent,
  ContactinfoComponent,
  SummaryComponent,
  ListInsurancesLicensesComponent,
  LicensedetailsComponent,
  InsurancedeatailsComponent,
  OrderDetailsComponent,
  OrderDeclineDialogComponent,
  AcceptedOrderDetailsComponent,
  VendorServicesComponent,
  FinancialInformationComponent,
  AddEditFinancialInformationComponent,
  AvailabilityComponent,
  BackgroundcheckComponent,
  AddDisciplinaryComponent,
    DisciplinaryDetailsComponent,
    ContactpageAuditHistoryComponent,
    AttestationDetailsComponent,
  ActiveinsurancelicenseComponent,
  orderCommentComponent

} from './forms/index';

const ASCEND_VENDORCOMPONENTS = [
  VendorContactInfoComponent,
  LicenseComponent,
  InsurancesComponent,
  OrdersComponent,
  DetailsComponent,
  VendorListComponent,
  VendorAdvancedSearchComponent,
  CoverageComponent,
  AddvendorComponent,
  AddressComponent,
  ContactinfoComponent,
  SummaryComponent,
  ListInsurancesLicensesComponent,
  LicensedetailsComponent,
  InsurancedeatailsComponent,
  OrderDetailsComponent,
  OrderDeclineDialogComponent,
  AcceptedOrderDetailsComponent,
  AddcoverageComponent,
  VendorServicesComponent,
  FinancialInformationComponent,
  AddEditFinancialInformationComponent,
    AvailabilityComponent,
  BackgroundcheckComponent,
  AddDisciplinaryComponent,
    DisciplinaryDetailsComponent,
    ContactpageAuditHistoryComponent,
  AttestationDetailsComponent,
  ActiveinsurancelicenseComponent,
  orderCommentComponent
];

import {
  MatButtonModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatRadioModule,
  MatInputModule,
  MatOptionModule,
  MatDividerModule,
  MatSelectModule,
  MatIconModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatListModule,
  MatTooltipModule,
  MatToolbarModule,
  MatExpansionModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableDataSource,
  MatSnackBarModule,
  MatGridListModule,
  MatSidenavModule,

  MatSliderModule,
  MatCardModule
} from '@angular/material';

import { ConfigService } from '../config.service';
import { HttpService } from '../shared/httpService/http.service';
import { DialogsService } from '../shared/services/dialogs.service';
import { ResourceService } from '../shared/services/resource.service';
import { FileUploaderService } from '../shared/services/file-uploader.service';
import { CurrencyFormatPipe } from '../shared/pipes/format-currency.pipe';
import { NumberFormatPipe } from '../shared/pipes/numberformat.pipe';
import { VendorSandbox } from './vendor.sandbox';
import { CurrencyFormatterDirective } from "../shared/directives/currency-formatter.directive";
import { NumberFormatDirective } from "../shared/directives/number-formatter.directive";
import { ContactVendorApiService } from './services/contact-vendor-api.service';
import { LocalTimeTranslatePipe } from '../shared/pipes';

//import { AvailabilityComponent } from './forms/availability/availability.component';

import { NgxSpinnerService } from 'ngx-spinner';
import {
  AddVendorApiService,
  VendorApiService,
  LicenseService,
  InsurancesService,
  ListInsurancesLicensesService,
  BroadcastService,
  VendorOrderApiService,
  VendorServiceService,
  FinancialInformationService,
  AvailabilityService,
  BackgroundcheckService,
  DisciplinaryService,
  OrderCommentService
} from './services/index';
import { DataService } from '../shared/services';



const ASCEND_VENDORSERVICES = [
  AddVendorApiService,
  VendorApiService,
  LicenseService,
  InsurancesService,
  ListInsurancesLicensesService,
  BroadcastService,
  VendorOrderApiService,
  VendorServiceService,
  FinancialInformationService,
  AvailabilityService,
  BackgroundcheckService,
  DisciplinaryService,
  OrderCommentService,
  ResourceService
];
import {
  NumbersOnly
} from './../shared/directives/numbers';
import {
  OrderByPipe
} from './../shared/directives/orderaddress';
import { BackgroundcheckdetailsComponent } from './forms/backgroundcheckdetails/backgroundcheckdetails.component';
const ASCEND_SHAREDDIRECTIVES = [
  NumbersOnly,
  OrderByPipe
];
@NgModule({
  imports: [
    HttpClientModule,
    VendorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CdkTableModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatOptionModule,
    MatDividerModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatSidenavModule,
    MatSliderModule,
    MatCardModule,
    SharedModule,
  ],
  declarations: [
    VendorComponent,
    StarRatingComponent,
    SwitchComponent,
    CurrencyFormatPipe,
    CurrencyFormatterDirective,
    NumberFormatPipe,
    NumberFormatDirective,
    ...ASCEND_VENDORCOMPONENTS,
    AddEditFinancialInformationComponent,
    AddressComponent,
    ContactinfoComponent,
    ...ASCEND_SHAREDDIRECTIVES,
    BackgroundcheckdetailsComponent,
    TwoDigitDecimaNumberDirective,
    OneDigitDecimaNumberDirective,
    AttestationDetailsComponent,PaginationFooterComponent,PaginationHeaderComponent,FullPaginationComponent ],
  providers: [VendorSandbox, DialogsService, FileUploaderService, NgxSpinnerService, DataService, ContactVendorApiService, LocalTimeTranslatePipe, ...ASCEND_VENDORSERVICES],
  exports: [VendorComponent, ...ASCEND_VENDORCOMPONENTS,PaginationFooterComponent,PaginationHeaderComponent,FullPaginationComponent],
  entryComponents: [OrderDeclineDialogComponent,AttestationDetailsComponent]
})
export class VendorModule { }


