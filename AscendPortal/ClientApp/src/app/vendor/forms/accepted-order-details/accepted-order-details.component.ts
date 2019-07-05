import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../config.service';
import { VendorSandbox } from '../../vendor.sandbox';
import { OrderDetails, ServiceOrderDetails, OrderDocuments } from '../../../shared/models/vendor-order-model';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';


@Component({
  selector: 'app-accepted-order-details',
  templateUrl: './accepted-order-details.component.html',
  styleUrls: ['./accepted-order-details.component.scss']
})
export class AcceptedOrderDetailsComponent implements OnInit {

  constructor(private router: Router,
    private activateRoute: ActivatedRoute,
    private configService: ConfigService,
    private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler) {
    this.activateRoute.params.subscribe(url => {
      this.vendorId = url.vendorId;
      this.orderId = url.orderId;
    });
  }
  private vendorId: string;
  private orderId: string;
  public acceptedOrder: OrderDetails;
  public serviceOrder: ServiceOrderDetails;
  public formURL: string;
  public documents: OrderDocuments = {
    htmlFileName: '',
    htmlFileDocumentId: '',
    pdfFileName: '',
    pdfFileDocumentId: ''
  };

  ngOnInit() {
    this.vendorSandbox.getAcceptedOrderDetails(this.orderId);
    this.vendorSandbox.acceptedOrderDetails$.subscribe((orderDetails: OrderDetails) => {
      if (orderDetails) {

        this.acceptedOrder = orderDetails;
        this.getServiceDetails(orderDetails.serviceOrderId);

        if (this.acceptedOrder.workOrderStatus === 'InProgress' || this.acceptedOrder.workOrderStatus === 'Waiting' || this.acceptedOrder.workOrderStatus === 'RevisionRequest') {
          this.formURL = this.acceptedOrder.form.formUrl;
        }

        switch (this.acceptedOrder.workOrderStatus) {
          case "InProgress":
            this.acceptedOrder.workOrderStatus = 'In Progress';
            break;
          case "Waiting":
            this.acceptedOrder.workOrderStatus = 'Waiting';
            break;
          case "RevisionRequest":
            this.acceptedOrder.workOrderStatus = 'Revision Request';
            break;
          case "PendingAcceptance":
            this.acceptedOrder.workOrderStatus = 'Pending Acceptance';
            break;
          default:
            this.acceptedOrder.workOrderStatus;
        }
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  public orderForm(): void {
    window.open(this.formURL);
  }

  public getServiceDetails(serviceOrderId: string) {
    this.vendorSandbox.getServiceOrderDetails(serviceOrderId);
    this.vendorSandbox.serviceOrderDetails$.subscribe((serviceOrderDetails: ServiceOrderDetails) => {
      if (serviceOrderDetails) {
        this.serviceOrder = serviceOrderDetails;
      }
    });
  }

  private dollar(value: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    return formatter.format(value);
  }
}
   


