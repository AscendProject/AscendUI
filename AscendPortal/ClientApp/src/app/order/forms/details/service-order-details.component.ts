import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../shared/services';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';

import { ServiceOrder } from '../../../shared/models/serviceorder.model';
@Component({
    selector: 'service-order-details',
    templateUrl: './service-order-details.component.html',
    styleUrls: ['./service-order-details.component.scss']
})
export class ServiceOrderDetailsComponent implements OnInit {
    //@Input() details: any;
    public details: any;
    public SOTabs = [];
    public activeLinkIndex = -1;
    serviceOrderId:string;
     public serviceOrderInfo:ServiceOrder;
    constructor(private router: Router,private sessionservice: SessionService,private activatedRoute:ActivatedRoute,
        private orderSandbox: OrderSandbox,
        private globalErrorHandler: GlobalErrorHandler
    ) {        
        this.activatedRoute.params.subscribe((params)=>{
            this.serviceOrderId=params['id'];
            this.getOrderInfo(this.serviceOrderId);
                      
        })
    }

    getOrderInfo(serviceOrderId) {
        if (serviceOrderId != null) {
            this.orderSandbox.getServiceOrderDataByID(serviceOrderId);
            this.orderSandbox.serviceorderInfo$.subscribe((response) => {
                if (response) {
                    this.serviceOrderInfo = response;
                    this.sessionservice.setserviceorder(this.serviceOrderInfo);
                    //this.getVendorInfo(this.OrderInfo.vendorId);
                }
            }, error => this.globalErrorHandler.handleError(error));
        }
    }

    ngOnInit() {
        this.SOTabs = [{
            label: 'Order Info', link: 'info', index: 0
        }, {
            label: 'Work Orders', link: 'work-orders', index: 1
        },  {
            label: 'Exceptions', link: 'exceptions', index: 2
        }];

        this.router.events.subscribe((res) => {
            this.activeLinkIndex = this.SOTabs.indexOf(this.SOTabs.find(tab => tab.link === '.' + this.router.url));
        });

    }

    bgcolor(bcolor) {
        if (bcolor === 'New') {
            return 'bg-primary3 bg-primary3b';
        } else if (bcolor === 'InProgress' || bcolor === 'Waiting') {
            return 'bg-warning3 bg-warning3b';
        } else if (bcolor === 'Completed') {
            return 'bg-success3 bg-success3b';
        } else if (bcolor === 'PendingAcceptance') {
            return 'bg-secondary3 bg-secondary3b';
        } else if (bcolor === 'QCReview') {
            return 'bg-dark3 bg-dark3b';
        }
        else
            return 'bg-primary3 bg-primary3b';
    }
}
