import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterLayoutComponent } from './shared/layout/index';

// import { DashboardModule } from './dashboard/dashboard.module';
// import { VendorModule,} from './vendor/vendor.module';
// import { OrderModule } from './order/order.module';
// import { LoginModule } from './login/login.module';
const routes: Routes = [
    {
        path: '',
        loadChildren: './login/login.module#LoginModule',
        pathMatch: 'full',
    },
    {
        path: '',
        component: MasterLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
            },
            {
                path: 'vendor',
                loadChildren: './vendor/vendor.module#VendorModule',
            },
            {
                path: 'order',
                loadChildren: './order/order.module#OrderModule',
            },
            {
                path: 'preferences',
                loadChildren: './preferences/preferences.module#PreferencesModule',
            }
        ]
    },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

//imports: [RouterModule.forRoot(routes, { enableTracing: true })],
