import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../config.service';
import { VendorSandbox } from '../../vendor.sandbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar } from '@angular/material';
import { OrderDeclineDialogComponent } from '../index';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { IOfferOrderDetails, IOrderStatusChange, OrderDocuments, AvailableOffers, OrderDetails, AcceptDeclineResponse } from '../../../shared/models/vendor-order-model';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { ConfirmDialogComponent } from '../../../shared/components/index';

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private configService: ConfigService,
    private vendorSandbox: VendorSandbox,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private globalErrorHandler: GlobalErrorHandler, ) {
    this.activateRoute.params.subscribe(url => {
      this.vendorId = url.vendorId;
      this.workOfferId = url.workofferId
    });
    this.alive = true;
  }
  private alive: boolean;
  public workOfferId: string;
  public vendorId: string;
  public disableDeclineOrder: boolean = false;
  public disbleAcceptOrder: boolean = false;
  public showAcceptedTime: boolean = true;
  public selectedOfferData: AvailableOffers;
  public offerDetails: OrderDetails;
  public documents: OrderDocuments = {
    htmlFileName: '',
    htmlFileDocumentId: '',
    pdfFileName: '',
    pdfFileDocumentId: ''
  };

  ngOnInit() {
    this.vendorSandbox.getSelectedOfferDetails(this.workOfferId);
    this.vendorSandbox.selectedOfferDetails$.subscribe((availableOffers: AvailableOffers) => {
      if (availableOffers) {
        this.selectedOfferData = availableOffers;
        if (this.selectedOfferData.engagementLetterDetails) {
          this.documents = {
            htmlFileName: this.selectedOfferData.engagementLetterDetails.htmlFileName,
            htmlFileDocumentId: this.selectedOfferData.engagementLetterDetails.htmlFileDocumentId,
            pdfFileName: this.selectedOfferData.engagementLetterDetails.pdfFileName,
            pdfFileDocumentId: this.selectedOfferData.engagementLetterDetails.pdfFileDocumentId
          }
        }
      }
    }, error => { this.globalErrorHandler.handleError(error) },
      () => {
        this.vendorSandbox.getWorkOrdersByUrl(this.selectedOfferData.links[0].url);
        this.vendorSandbox.workOrdersByUrl$.subscribe((orderDetails: OrderDetails) => {
          if (orderDetails) {
            this.offerDetails = orderDetails;
          }
        });
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

  public acceptOffer(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { msg: 'By accepting this assignment, I agree to all terms outlined in the attached engagement letter', buttonName: 'Agree', title: 'Confirmation' }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (`${result}` === 'true') {
        this.disableDeclineOrder = true;
        this.disbleAcceptOrder = true;
        const acceptOrderResponse = <IOrderStatusChange>{
          workOfferId: this.workOfferId,
          vendorId: this.vendorId,
          status: "Accepted",
          reason: ""
        }
        this.vendorSandbox.postAcceptedOffer(this.selectedOfferData.links[2].url, acceptOrderResponse);
        this.vendorSandbox.acceptWorkOffer$.subscribe((res) => {
          this.snackBar.open('Accepted Successfully', 'Close', {
            duration: 3000,
          });
        },
          error => {
            if (error && error.status === 410) {
              this.showAcceptedTime = true;
              this.snackBar.open('Offer Expired. Sorry for the Inconvinience', 'Close', {
                duration: 3000,
              });
              this.selectedOfferData.status = "Offer Expired. Sorry for the Inconvinience";
            }
          },
          () => {
            IntervalObservable.create(50)
              .takeWhile(() => this.alive) // only fires when component is alive
              .subscribe(() => {
                this.vendorSandbox.getOfferStatus(this.selectedOfferData.links[3].url);
                this.vendorSandbox.offerStatus$.subscribe((acceptDeclineResponse: AcceptDeclineResponse) => {
                  if (acceptDeclineResponse && acceptDeclineResponse.runtimeStatus == "Completed") {
                    this.alive = false;
                    this.router.navigate(['/vendor/orders/' + this.vendorId]);
                  }
                }, error => { this.globalErrorHandler.handleError(error) });

              });
          });
      } else {
        this.snackBar.open('Not Agree', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  public downloadDocuments(documentId: string): void {
    this.vendorSandbox.getDownloadDocument(documentId);
    const url = this.vendorSandbox.documentDownload$;
    if (url) {
      window.open(url, '_blank');
      this.snackBar.open('Documents downloaded successfully', 'Close', {
        duration: 3000,
      });
    }
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(OrderDeclineDialogComponent, {
      width: '500px',
      height: '580px',
      data: { vendorId: this.vendorId, workOfferId: this.workOfferId, responseURL: this.selectedOfferData.links[2].url, resposeStatus: this.selectedOfferData.links[3].url }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (`${result}` === 'Decline successfully') {
        this.router.navigate(['/vendor/orders/' + this.vendorId]);
      }
    });
  }

}
