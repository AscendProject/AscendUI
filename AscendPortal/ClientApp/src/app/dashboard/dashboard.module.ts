import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, Response } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.route';

@NgModule({
    imports: [HttpClientModule,  DashboardRoutingModule, FormsModule],
    declarations: [DashboardComponent],
    providers: []
})
export class DashboardModule { }
