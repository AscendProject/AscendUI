import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorComponent } from './vendor.component';

import {
  VendorContactInfoComponent,
  VendorAdvancedSearchComponent,
  LicenseComponent,
  InsurancesComponent,
  OrdersComponent,
  CoverageComponent,
  AddvendorComponent,
  SummaryComponent,
  ListInsurancesLicensesComponent,
  LicensedetailsComponent,
  InsurancedeatailsComponent,
  OrderDetailsComponent,
  AcceptedOrderDetailsComponent,
  VendorServicesComponent,
  FinancialInformationComponent,  
  AddDisciplinaryComponent,
  DisciplinaryDetailsComponent,
  AddEditFinancialInformationComponent,
  AvailabilityComponent,
  BackgroundcheckComponent,
  BackgroundcheckdetailsComponent,
  orderCommentComponent
} from './forms/index';

const routes: Routes = [
  {
    path: '',
    component: VendorComponent,
    children: [
      {
        path: 'info/:id',
        component: VendorContactInfoComponent,
      },
      {
        path: 'addvendor',
        component: AddvendorComponent,
      },
      {
        path: 'summary/:id',
        component: SummaryComponent,
      },
      {
        path: 'license/:id',
        component: LicenseComponent,
      },
      {
        path: 'disciplinary/:id',
        component: AddDisciplinaryComponent,
      },
      {
        path: 'disciplinarydetails/:id',
        component: DisciplinaryDetailsComponent,
      },
      {
        path: 'insurances/:id',
        component: InsurancesComponent,
      },
      {
        path: 'listinsuranceslicenses/:id',
        component: ListInsurancesLicensesComponent,
      },
      {
        path: 'licesedetails/:id',
        component: LicensedetailsComponent,
      },
      {
        path: 'insurancedetails/:id',
        component: InsurancedeatailsComponent,
      },
      {
        path: 'orders/:id',
        component: OrdersComponent,
      },
      {
        path: 'order-details/:vendorId/:workofferId',
        component: OrderDetailsComponent,
      },
      {
        path: 'services/:id',
        component: VendorServicesComponent,
      },
      {
        path: 'services/addnewservice/:id',
        component: CoverageComponent,
      },
      {
          path: 'accepted-order-details/:vendorId/:orderId',
          component: AcceptedOrderDetailsComponent,
      },
      {
          path: 'financialinformation/:id',
          component: FinancialInformationComponent,
      },
      {
        path: 'add-edit-financial-information/:id',
        component: AddEditFinancialInformationComponent,
      },
      {
        path: 'availability/:id',
        component: AvailabilityComponent,
      },
      {
          path: 'backgroundcheck/:id',
          component: BackgroundcheckComponent,
      },
      {
        path: 'backgroundcheckdetails/:id/:bid',
        component: BackgroundcheckdetailsComponent,
      },
      {
          path: 'advancedsearch',
          component: VendorAdvancedSearchComponent,
      },
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VendorRoutingModule { }
