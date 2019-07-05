"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sandbox = /** @class */ (function () {
    function Sandbox(configService) {
        this.configService = configService;
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
    return Sandbox;
}());
exports.Sandbox = Sandbox;
//# sourceMappingURL=base.sandbox.js.map