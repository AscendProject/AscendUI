import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class HttpResponseHandlerResponse {
    constructor() {}

    public onCatch(error): Observable<any> {
        switch (error.status) {
            /*TODO
             Remove the console and add proper notification messages-------*/
            case 400:
            console.log ('Bad request');
            break;

            case 401:
            console.log ('Unauthorised');
            break;

            case 404:
            console.log ('Not Found');
            break;

            case 403:
            console.log ('Forbidden Error');
            break;

            case 400:
            console.log ('Internal Server Error');
            break;

            default:
            break;
        }
        return Observable.throw(error);

    }
}
