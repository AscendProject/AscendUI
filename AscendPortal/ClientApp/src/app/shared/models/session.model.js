"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SessionData = /** @class */ (function () {
    function SessionData() {
        this.workorderid = null;
        this.serviceorderid = null;
        this.workorder = null;
        this.serviceorder = null;
        this.vendorid = null;
    }
    SessionData.prototype.clear = function () {
        this.workorderid = null;
        this.serviceorderid = null;
        this.workorder = null;
        this.serviceorder = null;
        this.vendorid = null;
    };
    return SessionData;
}());
exports.SessionData = SessionData;
var WorkOrderID = /** @class */ (function () {
    function WorkOrderID() {
        this.workorderid = null;
    }
    return WorkOrderID;
}());
exports.WorkOrderID = WorkOrderID;
var ServiceOrderID = /** @class */ (function () {
    function ServiceOrderID() {
        this.serviceorderid = null;
    }
    return ServiceOrderID;
}());
exports.ServiceOrderID = ServiceOrderID;
var VendorID = /** @class */ (function () {
    function VendorID() {
        this.vendorid = null;
    }
    return VendorID;
}());
exports.VendorID = VendorID;
//# sourceMappingURL=session.model.js.map