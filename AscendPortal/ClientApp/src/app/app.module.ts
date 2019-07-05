

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app.route';

import { CommonModule } from '@angular/common';

// Material -----//
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { VendorModule } from './vendor/vendor.module';
import { OrderModule } from './order/order.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PreferencesModule } from './preferences/preferences.module';

import { HttpService } from './shared/httpService/http.service';
import { ConfigService } from './config.service';
import { HttpModule } from '@angular/http';
import { GlobalErrorHandler } from './shared/globalError_handler/global-error-handler';
import { HttpResponseHandlerResponse } from './shared/globalError_handler/httpResponseHandlerService';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarModule } from '@ngx-loading-bar/core';

export function configServiceFactory(config: ConfigService) {
  return () => config.load();
}
import { BrowserXhr } from '@angular/http';
import {
  DialogsService, SessionService, CustExtBrowserXhr
} from './shared/services/index';

const ASCEND_SHAREDSERVICES = [
  DialogsService, SessionService, CustExtBrowserXhr
];
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    VendorModule,
    OrderModule,
    DashboardModule,
    PreferencesModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarHttpModule,
    LoadingBarModule.forRoot()
  ],
  providers: [ConfigService, GlobalErrorHandler, HttpResponseHandlerResponse, ...ASCEND_SHAREDSERVICES],
  bootstrap: [AppComponent],
  exports: [SharedModule]
})
export class AppModule { }
