import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'statusTranslate'})
export class StatusTranslatePipe implements PipeTransform {
  transform(internalStatus: string): string {
    let returnStatus="";
    let internalStatusUpper=internalStatus.toUpperCase();
    switch(internalStatusUpper){
        case "PENDINGACCEPTANCE":
            returnStatus="Pending Acceptance";
            break;
        case "INPROGRESS":
            returnStatus="In Progress";
            break;
        case "PENDINGRESPONSE":
            returnStatus="Pending Response";
            break;
        case "ORDERFULFILLMENT":
            returnStatus="Order Fulfillment";
            break;
        case "VENDORASSIGNMENT":
            returnStatus="Vendor Assignment";
            break;
        default:
            returnStatus=internalStatus;
            break;     

    }
    return returnStatus;
  }
}