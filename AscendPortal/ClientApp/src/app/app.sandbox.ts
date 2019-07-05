import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Sandbox } from './shared/base.sandbox';
import { IConfiguration } from './interfaces';
@Injectable()
export class AppSandbox extends Sandbox {
    serverSettings: IConfiguration;
    constructor(public configService: ConfigService) {
        super(configService);
    }
}
