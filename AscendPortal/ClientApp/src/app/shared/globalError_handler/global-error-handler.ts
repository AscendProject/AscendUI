import { Injectable, ErrorHandler } from '@angular/core';
import { HttpResponseHandlerResponse } from './httpResponseHandlerService';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    constructor(private httpResponseHandlerService: HttpResponseHandlerResponse) {
        super();
    }
    public handleError(error): void {
    this.httpResponseHandlerService.onCatch(error);
    }
}
