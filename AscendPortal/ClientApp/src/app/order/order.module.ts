import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, Response } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order.route';

import {
    OrdersListComponent,
    ServiceOrdersListComponent,
    WorkOrdersListComponent,
    WorkOrderInfoComponent,
    ServiceOrderInfoComponent,
    DetailsComponent,
    WorkOrdersComponent,
    WorkofferComponent,
    ServiceordrExceptionsComponent,
    WorkorderExceptionsComponent,
    RevisionRequestComponent,
    ServiceOrderComponent,
    WorkOrderDetailsComponent,
    ServiceOrderDetailsComponent,
    UnAssignedWorkOrdersListComponent,
    AssignVendorComponent
} from './forms/index';

const ASCEND_ORDERCOMPONENTS = [
    OrdersListComponent,
    ServiceOrdersListComponent,
    WorkOrdersListComponent,
    WorkOrderInfoComponent,
    ServiceOrderInfoComponent,
    DetailsComponent,
    WorkOrdersComponent,
    WorkofferComponent,
    ServiceordrExceptionsComponent,
    WorkorderExceptionsComponent,
    RevisionRequestComponent,
    ServiceOrderComponent,
    WorkOrderDetailsComponent,
    ServiceOrderDetailsComponent,
    UnAssignedWorkOrdersListComponent,
    AssignVendorComponent
];
import {
    ServiceOrderService,
    WorkOrderService,
    VendorService,
    WorkOfferService,
    ExceptionService,
} from './services/index';
const ASCEND_ORDERSERVICES = [
    ServiceOrderService,
    WorkOrderService,
    VendorService,
    WorkOfferService,
    ExceptionService,
];

// import {
//     SessionService,
//     DialogsService
// } from '../shared/services/index';
// const ASCEND_SHAREDSERVICES = [
//     SessionService,
//     DialogsService,
// ];

import {
    MatButtonModule,
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
    MatProgressSpinnerModule,
    MatExpansionModule,

} from '@angular/material';

import { ConfigService } from '../config.service';
import { HttpService } from '../shared/httpService/http.service';
import { OrderSandbox } from './order.sandbox';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    imports: [CommonModule, HttpClientModule, OrderRoutingModule, FormsModule, ReactiveFormsModule,
        MatButtonModule,
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
        MatExpansionModule,
        SharedModule
    ],
    declarations: [OrderComponent, ...ASCEND_ORDERCOMPONENTS],
    providers: [OrderSandbox, ...ASCEND_ORDERSERVICES, HttpService],
    exports: [OrderComponent, ...ASCEND_ORDERCOMPONENTS],
    entryComponents: [AssignVendorComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class OrderModule { }
