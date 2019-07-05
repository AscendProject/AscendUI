import { Injectable } from '@angular/core';

import { WorkOrderID, ServiceOrderID, SessionData, VendorID } from '../models/session.model';
import { ServiceOrder } from '../models/serviceorder.model';
import { WorkOrder } from '../models/workorder.model';

@Injectable()
export class SessionService {
    private sessionData: SessionData = new SessionData();
    constructor() {
    }
    getworkorderid(): WorkOrderID {
        const workdorderid: WorkOrderID = {
            workorderid: this.sessionData.workorderid
        };
        return workdorderid;
    }
    setworkorderid(data: WorkOrderID) {
        this.sessionData.workorderid = data.workorderid;
    }

    getserviceorderid(): ServiceOrderID {
        const servicedorderid: ServiceOrderID = {
            serviceorderid: this.sessionData.serviceorderid
        };
        return servicedorderid;
    }
    setserviceorderid(data: ServiceOrderID) {
        this.sessionData.serviceorderid = data.serviceorderid;
    }

    getworkorder(): WorkOrder {
        const workdorder: WorkOrder = this.sessionData.workorder;
        return workdorder;
    }
    setworkorder(data: WorkOrder) {
        this.sessionData.workorder = data;
    }

    getserviceorder(): ServiceOrder {
        const serviceorder: ServiceOrder = this.sessionData.serviceorder;

        return serviceorder;
    }
    setserviceorder(data: ServiceOrder) {
        this.sessionData.serviceorder = data;
    }

    getVendorID(): VendorID {
        const workdorderid: VendorID = {
            vendorid: this.sessionData.vendorid
        };
        return workdorderid;
    }
    setVendorID(data: VendorID) {
        this.sessionData.vendorid = data.vendorid;
    }
}
