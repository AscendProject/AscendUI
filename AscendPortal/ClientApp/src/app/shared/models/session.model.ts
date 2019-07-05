import { WorkOrder } from "./workorder.model";
import { ServiceOrder } from "./serviceorder.model";

export class SessionData {
    workorderid: string = null;
    serviceorderid: string = null;
    workorder: WorkOrder = null;
    serviceorder: ServiceOrder = null;
    vendorid: string = null;

    clear() {
        this.workorderid = null;
        this.serviceorderid = null;
        this.workorder = null;
        this.serviceorder = null;
        this.vendorid = null;
    }
}
export class WorkOrderID {
    workorderid: string = null;
}
export class ServiceOrderID {
    serviceorderid: string = null;
}
export class VendorID {
    vendorid: string = null;
}

