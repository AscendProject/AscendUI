import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IConfiguration } from './interfaces';
import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ConfigService {
    serverSettings: IConfiguration;
    // observable that is fired when settings are loaded from server
    private settingsLoadedSource = new Subject();
    settingsLoaded$ = this.settingsLoadedSource.asObservable();
    isReady: boolean = false;

    constructor(/*private http: Http,*/private httpClient: HttpClient) {
        this.load();
    }

    load() {
        const baseURI = document.baseURI.endsWith('/') ? document.baseURI : `${document.baseURI}/`;
        //Comment this for VS Code Development outside docker using ng serve 
        //UnComment this for VisualStudio Development/Production inside docker --should use this and run before check in 
        let url = `${baseURI}Home/Configuration`;
        //let url = `${baseURI}`;

        //Uncomment this for VS Code development outside docker using ng serve
        //UnComment this for VisualStudio Development / Production inside docker
        //let url = `${baseURI}assets/devSettings.json`

        //this.http.get(url).subscribe((response: Response) => {
        //  console.log('server settings loaded');
        //  this.serverSettings = response.json();
        //  console.log(this.serverSettings);      
        //  this.isReady = true;
        //  this.settingsLoadedSource.next();
        //});

        this.httpClient.get<IConfiguration>(url).subscribe((data: IConfiguration) => {
            console.log('server settings loaded');
            this.serverSettings = data;
            console.log('serversettings obj: ' + this.serverSettings);
            console.log('response obj: ' + data);
            console.log('Service Order URL:' + this.serverSettings.serviceOrdersURL);
            this.isReady = true;
            this.settingsLoadedSource.next(this.serverSettings);
        }, (error: HttpErrorResponse) => {
            if (error.status === 404) {
                url = `${baseURI}assets/devSettings.json`;
                this.httpClient.get<IConfiguration>(url).subscribe((data: IConfiguration) => {
                    console.log('server settings loaded');
                    this.serverSettings = data;
                    console.log(this.serverSettings);
                    this.isReady = true;
                    this.settingsLoadedSource.next(this.serverSettings);
                });
            }
        }
        );
    }
}
