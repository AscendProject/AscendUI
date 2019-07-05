import { ConfigService } from './../config.service';
import { IConfiguration } from '../interfaces';
export abstract class Sandbox {
    serverSettings: IConfiguration;
    constructor(public configService: ConfigService) {
        // if (this.configService.isReady) {
        //     console.log('config service ready');
        //     this.serviceOrderUrl = this.configService.serverSettings.serviceOrdersURL;
        //     this.serviceOrderbyIdURL = this.configService.serverSettings.serviceOrderbyIdURL;
        // } else {
        //     console.log('config service not ready');
        //     this.configService.settingsLoaded$.subscribe(x => {
        //         this.serviceOrderUrl = this.configService.serverSettings.serviceOrdersURL;
        //         this.serviceOrderbyIdURL = this.configService.serverSettings.serviceOrderbyIdURL;
        //     });
        // }
    }
}
