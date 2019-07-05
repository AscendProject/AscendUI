import { Component, OnInit,Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
 ResourceModel
} from '../../../shared/models/resource-model';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { VendorSandbox } from '../../../vendor/vendor.sandbox';
import { FileUploaderService } from '../../../shared/services/file-uploader.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ascend-resource',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  public resourcesData: Array<string>= [];

  constructor(public fileUploadService: FileUploaderService,public router: Router, public route: ActivatedRoute,
    private globalErrorHandler: GlobalErrorHandler,
    private vendorSandbox: VendorSandbox) {
  }
  ngOnInit() {
    this.getResourcesData();
  }
  private getResourcesData(): void {
    this.vendorSandbox.getResourceList();
    this.vendorSandbox.resourceList$.subscribe(
      data => {
        this.resourcesData = data.resourcesInformation;
      }, error => this.globalErrorHandler.handleError(error));
  }

  downloadFile(docKey, fileName) {
    this.fileUploadService.getFile(docKey, fileName)
      .subscribe(blob => {
        saveAs(blob, fileName.split('.', 1) + '.pdf', { type: 'text/plain;charset=windows-1252' });
      });
  }
}
