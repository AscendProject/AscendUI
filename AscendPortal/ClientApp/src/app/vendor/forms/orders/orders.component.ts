import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../config.service';
import { VendorSandbox } from '../../vendor.sandbox';
import { Observable } from 'rxjs/Observable';
import { OrdersDetails, WorkOfferResponse, AvailableOffers, OrderDetails, AcceptedOfferResponse } from '../../../shared/models/vendor-order-model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
@Component({
    selector: 'orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']    
})
export class OrdersComponent implements OnInit {
  constructor(private configService: ConfigService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler) {
    this.activateRoute.params.subscribe(url => {
      this.vendorId = url.id;
    });
  }
  private selectedorderId: string;
  public coverageAreaOptionValues: string;
  private vendorId: string;
  private sortedData: AvailableOffers[];
  private acceptedordersobj: OrdersDetails;
  private orders: OrdersDetails[] = [];
  public selection = new SelectionModel<OrdersDetails>(true, []);
  public availableOffers = new MatTableDataSource<OrdersDetails>(this.orders);
  public vendorOrderOptionValues = 'optionAll';
  public noDataAvailableFlag = false;
  public displayedColumns = ['checkbox', 'Service', 'Order', 'ServiceStatus', 'Letter', 'VendorDueDate', 'ClientDueDate', 'VendorFee', 'Street', 'City', 'State', 'Zip'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getWorkOffers();
  }

  public onRadioButnClick(): void {
    switch (this.vendorOrderOptionValues) {
      case "optionAccepted":
        this.getAcceptedOrder();
        break;
      case "optionOffers":
        this.getWorkOffers();
        break;
      case "optionAll":
        this.getWorkOffers();
        break;
      default:
        break;
    }
  }

  public getWorkOffers(): void {
    this.orders = [];
    this.availableOffers = new MatTableDataSource<OrdersDetails>(this.orders);
    this.vendorSandbox.getAvailableOffers(1, 15, this.vendorId, 'PendingResponse');
    this.vendorSandbox.availableOrder$.subscribe((workOffers: WorkOfferResponse) => {
      if (workOffers && workOffers.records) {
        this.sortedData = workOffers.records;
        const observables = new Array();
        for (let i = 0, ilen = this.sortedData.length; i < ilen; i++) {
          this.vendorSandbox.getWorkOrdersByUrl(this.sortedData[i].links[0].url);
          this.vendorSandbox.workOrdersByUrl$.subscribe((orderDetail: OrderDetails) => {
            if (orderDetail) {
              observables.push(orderDetail);
              this.fillOrderDetails(orderDetail, this.sortedData[i]);
            }
          }, error => this.globalErrorHandler.handleError(error));
        }
      } 
    }, error => { this.globalErrorHandler.handleError(error) });

    /* Execute function when All option in selected */
    if (this.vendorOrderOptionValues === 'optionAll') {
      const workOffer = this.availableOffers;
      const accepted = this.getAcceptedOrder();
      if (accepted && workOffer && workOffer.data) {
        this.availableOffers.data = workOffer.data;
        for (let i = 0, ilen = accepted.data.length; i < ilen; i++) {
          for (let j = 0, jlen = this.availableOffers.data.length; j < jlen; j++) {
            if (this.availableOffers.data[j].OfferId !== accepted.data[i].OfferId) {
              this.availableOffers.data.push(accepted.data[i]);
            }
          }
        }
      }
    }
  }

  private fillOrderDetails(orderDetails: OrderDetails, availableOffer: AvailableOffers) {
    if (orderDetails && availableOffer) {
      this.acceptedordersobj = <OrdersDetails>{
        ServiceStatus: availableOffer.status,
        Order: orderDetails.workOrderId,
        OfferId: availableOffer.id ? availableOffer.id : '',
        Letter: orderDetails.engagementLetter,
        VendorDueDate: orderDetails.vendorDueDate === null ? '' : orderDetails.vendorDueDate,
        VendorFee: orderDetails.vendorFee > 0 ? this.dollar(orderDetails.vendorFee) : orderDetails.vendorFee,
        Service: orderDetails.workOrderType,
        ClientDueDate: orderDetails.clientDueDate,
        Street: orderDetails.property.address.street1,
        City: orderDetails.property.address.city,
        State: orderDetails.property.address.state,
        Zip: orderDetails.property.address.postalCode
      }
      this.orders.push(this.acceptedordersobj);
      this.availableOffers = new MatTableDataSource<OrdersDetails>(this.orders);
      this.availableOffers.sort = this.sort;
      this.availableOffers.paginator = this.paginator;
    }
  }

  private dollar(value: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    return formatter.format(value);
  }

  private getAcceptedOrder() {
    this.orders = [];
    this.availableOffers = new MatTableDataSource<OrdersDetails>(this.orders);
    this.vendorSandbox.getAcceptedOrders(1, 15, this.vendorId);
    this.vendorSandbox.acceptedOrder$.subscribe((acceptedOffers: AcceptedOfferResponse) => {
      if (acceptedOffers && acceptedOffers.records) {
        const order = acceptedOffers.records;
        for (let i = 0, ilen = order.length; i < ilen; i++) {
          this.acceptedordersobj = <OrdersDetails>{
            ServiceStatus: order[i].workOrderStatus,
            Order: order[i].workOrderId,
            OfferId: order[i].id ? order[i].id : '',
            Letter: order[i].engagementLetter,
            VendorDueDate: order[i].vendorDueDate === null ? '' : order[i].vendorDueDate,
            VendorFee: order[i].vendorFee > 0 ? this.dollar(order[i].vendorFee) : order[i].vendorFee,
            Service: order[i].workOrderType,
            ClientDueDate: order[i].clientDueDate,
            Street: order[i].property.address.street1,
            City: order[i].property.address.city,
            State: order[i].property.address.state,
            Zip: order[i].property.address.postalCode
          }
          this.orders.push(this.acceptedordersobj);
          this.orders = this.orders.filter((order) => order.ServiceStatus === 'InProgress' || order.ServiceStatus === 'Waiting');
        }
        this.availableOffers = new MatTableDataSource<OrdersDetails>(this.orders);
        this.availableOffers.sort = this.sort;
        this.availableOffers.paginator = this.paginator;
      }
    }, error => this.globalErrorHandler.handleError(error));

    if (this.vendorOrderOptionValues === 'optionAll') {
       return this.availableOffers;
    }
  }

  public goToDetailsPage(offerId: string, order: string, serviceStatus: string): void {
    switch (this.vendorOrderOptionValues) {
      case 'optionOffers':
      //  this.router.navigate(['/vendor/order-details/' + this.vendorId + '/' + offerId]);
        this.router.navigate(['vendor', 'order-details', this.vendorId, offerId]);

        break;
      case 'optionAccepted':
        //this.router.navigate(['/vendor/accepted-order-details/' + this.vendorId + '/' + order]);
        this.router.navigate(['vendor', 'accepted-order-details', this.vendorId, order]);
        break;
      case 'optionAll':
        if (serviceStatus === 'PendingResponse' || serviceStatus === 'New') {
         // this.router.navigate(['/vendor/order-details/' + this.vendorId + '/' + offerId]);
          this.router.navigate(['vendor', 'order-details', this.vendorId, offerId]);
        } else {
         // this.router.navigate(['/vendor/accepted-order-details/' + this.vendorId + '/' + order]);
          this.router.navigate(['vendor', 'accepted-order-details', this.vendorId, order]);
        }
      default:
        break;
    }

  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected() {
    return this.selection.selected.length === this.availableOffers.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.availableOffers.data.forEach(row => this.selection.select(row));
  }
}
