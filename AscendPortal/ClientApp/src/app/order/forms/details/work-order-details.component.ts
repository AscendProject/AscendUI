import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../shared/services';
import { OrderSandbox } from '../../order.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { WorkOrder} from '../../../shared/models/workorder.model';
@Component({
    selector: 'work-order-details',
    templateUrl: './work-order-details.component.html',
    styleUrls: ['./work-order-details.component.scss']
})
export class WorkOrderDetailsComponent implements OnInit {
    //@Input() details: any;
    public details: any;
    public WOTabs = [];
    public activeLinkIndex = -1;
    workOrderId:string;
     public workOrderInfo:WorkOrder;
    constructor(private router: Router,private sessionservice: SessionService,private activatedRoute:ActivatedRoute,
        private orderSandbox: OrderSandbox,
        private globalErrorHandler: GlobalErrorHandler
    ) {        
        this.activatedRoute.params.subscribe((params)=>{
            this.workOrderId=params['id'];
            this.getOrderInfo(this.workOrderId);
                      
        })
    }

    getOrderInfo(workorderid) {
        if (workorderid != null) {
            this.orderSandbox.getWorkOrderDataByID(workorderid);
            this.orderSandbox.workorderInfo$.subscribe((response) => {
                if (response) {
                    this.workOrderInfo = response;
                    this.sessionservice.setworkorder(this.workOrderInfo);
                    //this.getVendorInfo(this.OrderInfo.vendorId);
                }
            }, error => this.globalErrorHandler.handleError(error));
        }
    }

    ngOnInit() {
        this.WOTabs = [{
            label: 'Order Info', link: 'info', index: 0
        }, {
            label: 'Service Order', link: 'serviceorder', index: 1
        }, {
            label: 'Work Offers', link: 'workoffers', index: 2
        }, {
            label: 'Revision Request', link: 'revisionrequest', index: 3
        }, {
            label: 'Exceptions', link: 'exceptions', index: 4
        }];

        this.router.events.subscribe((res) => {
            this.activeLinkIndex = this.WOTabs.indexOf(this.WOTabs.find(tab => tab.link === '.' + this.router.url));
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
