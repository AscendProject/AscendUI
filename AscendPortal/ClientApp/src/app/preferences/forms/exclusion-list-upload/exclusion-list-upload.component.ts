import { Component, OnInit } from '@angular/core';
import { FileUploaderService } from '../../../shared/services/file-uploader.service';
import { DialogsService } from '../../../shared/services';
import { PreferencesSandbox } from '../../preferences.sandbox';
import { MatDialog, MatSnackBar } from '@angular/material';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import {IExclusionListInformation} from '../../../shared/models/add-exclusionList-model';
import {MatTableDataSource} from '@angular/material';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-exclusion-list-upload',
  templateUrl: './exclusion-list-upload.component.html',
  styleUrls: ['./exclusion-list-upload.component.scss'],
  providers: []
})
export class ExclusionListUploadComponent implements OnInit {
  testFileObj: any;
  fdata: any = [];
  fileInformation: any = [];
  exclusionListDataByClient:any=[];
  displayedColumns: string[] = ['Exclusions', 'Type', 'lastupadted', 'ProcessingStatus','Actions'];
  datasource:any;
  uploadDisable=true;
  type=true;
  
  constructor(public fileUploadService: FileUploaderService, public dialogService: DialogsService,
    public service: PreferencesSandbox, public snackBar: MatSnackBar, private globalErrorHandler: GlobalErrorHandler) { }

  ngOnInit() {
    this.getExclusionDetails('3');
  }
  getExclusionDetails(id){
    this.service.getExclusionListByClientID(id);   
    this.service.getExclusionListByClientID$.subscribe((data) => {
this.datasource=new MatTableDataSource<IExclusionListInformation>(data);
    }
      , error => this.globalErrorHandler.handleError(error));

  }
  receiveMessage($event) {
    this.uploadDisable=false;
    this.testFileObj = $event;
    let fileType:string=$event[0].type;
    if(!(fileType.includes('excel') || fileType.includes('sheet')) )
    {
      this.dialogService.showDialog
            ('Exclusion List  should be in xlsx or xls format only', 'Ok', '400');
      this.uploadDisable=true;
      this.fileUploadService.clearQueue();
      return false;
    }
    
  }
  onCompleteItem($event) {
    this.fdata.push($event.response);
    if (this.fileInformation.length > 0) {
      this.fileInformation.forEach(file => {
        this.fdata.push(file);
      })
    }
    if(this.fdata.length>0)
    {
   this.Addsavelicense()
    }
  }

  savelicense() {
    let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.SaveOnBeforeFileUpload();
      } else {
      }
    });
  }
  SaveOnBeforeFileUpload() {
    this.fileUploadService.uploadAll();   
  }

  Addsavelicense() {
    var data = { 'clientId':'3','documentKey' :this.fdata[0].documentKey,'fileName':this.fdata[0].fileName,'uploadedDate':this.fdata[0].uploadedDate};
    this.service.addExclusionInfo(data);
    this.service.addEclusionInformation$.subscribe((data) => {
      this.snackBar.open('Exclusion List  uploaded Successfully', 'Close', {
        duration: 3000,
      });
      this.getExclusionDetails('3');
      this.fdata=[];
      this.uploadDisable=true;
    }
      , error => this.globalErrorHandler.handleError(error));

  }

  downloadFile(docKey, fileName) {
    this.fileUploadService.getFile(docKey, fileName)
      .subscribe(blob => { saveAs(blob, fileName, { type: 'text/plain;charset=windows-1252' });
    });
  }
}
