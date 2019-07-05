import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order.component';
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
    UnAssignedWorkOrdersListComponent
} from './forms/index';


const routes: Routes = [
    {
        path: '',
        component: OrderComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'work-orders'
            },
            {
                path: 'work-orders',
                component: WorkOrdersListComponent,
                children: [
                    {
                        path: ":id",
                        component: WorkOrderDetailsComponent,
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'info'
                            },
                            {
                                path: 'info',
                                component: WorkOrderInfoComponent
                            },
                            {
                                path: 'serviceorder',
                                component: ServiceOrderComponent
                            },
                            {
                                path: 'workoffers',
                                component: WorkofferComponent
                            },
                            {
                                path: 'exceptions',
                                component: WorkorderExceptionsComponent
                            },
                            {
                                path: 'revisionrequest',
                                component: RevisionRequestComponent
                            }
                        ]
                    },

                ]
            },
            {
                path: 'service-orders',
                component: ServiceOrdersListComponent,
                children: [
                    {
                        path: ":id",
                        component: ServiceOrderDetailsComponent,
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'info'
                            },
                            {
                                path: 'info',
                                component: ServiceOrderInfoComponent
                            },
                            {
                                path: 'work-orders',
                                component: WorkOrdersComponent
                            },
                            {
                                path: 'exceptions',
                                component: ServiceordrExceptionsComponent
                            }
                        ]
                    }
                ]
            },            
            {
                path: 'unassigned-work-orders',
                component: UnAssignedWorkOrdersListComponent,
                children: [
                    {
                        path: ":id",
                        component: WorkOrderDetailsComponent,
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'info'
                            },
                            {
                                path: 'info',
                                component: WorkOrderInfoComponent
                            },
                            {
                                path: 'serviceorder',
                                component: ServiceOrderComponent
                            },
                            {
                                path: 'workoffers',
                                component: WorkofferComponent
                            },
                            {
                                path: 'exceptions',
                                component: WorkorderExceptionsComponent
                            },
                            {
                                path: 'revisionrequest',
                                component: RevisionRequestComponent
                            }
                        ]
                    },

                ]
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderRoutingModule { }
