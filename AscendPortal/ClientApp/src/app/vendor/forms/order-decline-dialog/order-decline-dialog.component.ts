import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { DeclineOrderForm, DeclineOrderDialog, IDeclineConditions, IOrderStatusChange, AcceptDeclineResponse } from '../../../shared/models/vendor-order-model';
import { OrderDetailsComponent } from '../index';
import { VendorSandbox } from '../../vendor.sandbox';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/components/index';
import { FormControl, Validators } from '@angular/forms';
import { CurrencyFormatPipe } from '../../../shared/pipes/format-currency.pipe';
import { CurrencyFormatterDirective } from '../../../shared/directives/currency-formatter.directive';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';

@Component({
  selector: 'order-decline-dialog',
  templateUrl: './order-decline-dialog.component.html',
  styleUrls: ['./order-decline-dialog.component.scss'],
  providers: [CurrencyFormatPipe]
})
export class OrderDeclineDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderDetailsComponent>,
  private http: HttpClient, private vendorSandbox: VendorSandbox,
  private router: Router, public snackBar: MatSnackBar,
  public dialog: MatDialog, private globalErrorHandler: GlobalErrorHandler,
  @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    if (dialogData) {
      this.workOfferId = dialogData.workOfferId,
        this.vendorId = dialogData.vendorId,
        this.responseURL = dialogData.responseURL,
        this.resposeStatus = dialogData.resposeStatus
    }
    this.alive = true;
    this.dialogRef.disableClose = true;
  }
  private alive: boolean;
  public feeOptionValues: string;
  public tatOptionValues: string;
  public complexityOptionValues: string;
  public outOfOfficeOptionValues: string;
  public coverageAreaOptionValues: string;
  public declineDataList = [];
  public validationMessageDisplay = true;
  public validationErrorFlag = false;
  public validationErrorMessage: string;
  public declineDialog: DeclineOrderDialog = {
    fee: false, tat: false, complexity: false, outOfOffice: false, coverageArea: false, capacity: false, comment: false
  };
  public declineOrderForm: DeclineOrderForm = {
    fee: '', tat: null, feeMessage: '', userComment: ''
  };
  private workOfferId: string;
  private vendorId: string;
  private responseURL: string;
  private resposeStatus: string;
  public feeFormControl: FormControl;
  public tatFormControl: FormControl;
  public commentFormControl: FormControl;

  ngOnInit() {
    this.feeFormControl = new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^[0-9]{0,100}(\.[0-9]{1,2})?$/),
    ]);
    this.tatFormControl = new FormControl('', [
      Validators.required,
    ]);
    this.commentFormControl = new FormControl('', [
      Validators.required,
    ]);
  }

  public checkToggleValidation(declineDialog: DeclineOrderDialog): void {
    if (declineDialog.fee || declineDialog.tat || declineDialog.complexity ||
      declineDialog.outOfOffice || declineDialog.coverageArea || declineDialog.capacity || declineDialog.comment) {
      this.validationMessageDisplay = false;
    } else {
      this.validationMessageDisplay = true;
    }
  }

  public declineFromSubmit(declineDialog: DeclineOrderDialog, declineOrderForm: DeclineOrderForm): void {
    if (declineDialog.fee || declineDialog.tat || declineDialog.complexity ||
      declineDialog.outOfOffice || declineDialog.coverageArea || declineDialog.capacity || declineDialog.comment) {
      this.validationMessageDisplay = false;

      if ((declineDialog.fee && this.feeOptionValues === 'optionYes' && !declineOrderForm.fee) || (declineDialog.tat && this.tatOptionValues === 'optionYes' && !declineOrderForm.tat) || (declineDialog.coverageArea && this.coverageAreaOptionValues === 'optionYes' && !declineOrderForm.fee) ||
        (declineDialog.complexity && this.complexityOptionValues === 'optionYes' && !declineOrderForm.fee) || (declineDialog.outOfOffice && this.outOfOfficeOptionValues === 'optionYes' && !declineOrderForm.tat)) {
        this.validationErrorMessage = 'Please enter the mandatory value';
        this.validationErrorFlag = true;
      } else {
        this.validationErrorFlag = false;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '300px',
          data: { msg: 'Do you really want to decline the offer?', buttonName: 'Yes', title: 'Confirmation' }
        });

        dialogRef.afterClosed().subscribe((result: string) => {
          if (`${result}` === 'true') {
            const conditions = <IDeclineConditions[]>[
              {
                "type": "fee",
                "status": declineDialog.fee,
                "counterOffer": declineOrderForm.fee,
                "reason": declineOrderForm.feeMessage
              },
              {
                "type": "cannotCommittoTAT",
                "status": declineDialog.tat,
                "counterOffer": declineOrderForm.tat,
                "reason": ""
              },
              {
                "type": "complexityOfAssignment",
                "status": declineDialog.complexity,
                "counterOffer": declineOrderForm.fee,
                "reason": ""
              },
              {
                "type": "outOfOffice",
                "status": declineDialog.outOfOffice,
                "counterOffer": declineOrderForm.tat,
                "reason": ""
              },
              {
                "type": "outsideOfCoverageArea",
                "status": declineDialog.coverageArea,
                "counterOffer": declineOrderForm.fee,
                "reason": ""
              },
              {
                "type": "overCapacity",
                "status": declineDialog.capacity,
                "counterOffer": null,
                "reason": ""
              },
              {
                "type": "other",
                "status": declineDialog.comment,
                "counterOffer": null,
                "reason": declineOrderForm.userComment
              }
            ];

            let declineOrderResponse = <IOrderStatusChange>{
              workOfferId: this.workOfferId,
              vendorId: this.vendorId,
              status: "Declined",
              reason: conditions
            };
            this.vendorSandbox.postAcceptedOffer(this.responseURL, declineOrderResponse);
            this.vendorSandbox.acceptWorkOffer$.subscribe((res) => {
              this.onCancelClick('decline successfully');
              this.snackBar.open('Decline order Successfully', 'Close', {
                duration: 3000,
              });
            },
              error => {
                if (error.status === 410) {
                  this.snackBar.open('Offer Expired. Sorry for the Inconvinience', 'Close', {
                    duration: 3000,
                  });
                  //  this.workOrderStatus = "Offer Expired. Sorry for the Inconvinience";
                  this.onCancelClick('cancel');
                }
              },
              () => {
                IntervalObservable.create(50)
                  .takeWhile(() => this.alive) // only fires when component is alive
                  .subscribe(() => {
                    this.vendorSandbox.getOfferStatus(this.resposeStatus);
                    this.vendorSandbox.offerStatus$.subscribe((acceptDeclineResponse: AcceptDeclineResponse) => {
                      if (acceptDeclineResponse && acceptDeclineResponse.runtimeStatus == "Completed") {
                        this.alive = false;
                        this.router.navigate(['/vendor/orders/' + this.vendorId]);
                      }
                    }, error => { this.globalErrorHandler.handleError(error) });
                  });
              });
          }
        });
      }
    } else {
      this.validationMessageDisplay = true;
    }
  }

  public onCancelClick(result): void {
    this.dialogRef.close(result);
  }

}
