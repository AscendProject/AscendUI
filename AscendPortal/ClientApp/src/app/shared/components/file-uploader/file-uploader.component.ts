import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { FileQueueObject, FileUploaderService } from '../../services/file-uploader.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {

  @Output() onCompleteItem = new EventEmitter();

  @ViewChild('fileInput') fileInput;
  queue: Observable<FileQueueObject[]>;
  historyqueue: Observable<FileQueueObject[]>;
  @Input() historyData: any;
  @Input() type:boolean;
  @Output() messageEvent = new EventEmitter<Object>();

  constructor(public uploader: FileUploaderService) { }

  ngOnInit() {
    this.uploader.clearQueue();
    this.queue = this.uploader.queue;
    this.historyqueue = this.uploader.historyQueue;
    this.uploader.onCompleteItem = this.completeItem;
    this.uploader.type=this.type;
  }

  completeItem = (item: FileQueueObject, response: any) => {
    this.onCompleteItem.emit({ item, response });
  }

  addToQueue() {
    const fileBrowser = this.fileInput.nativeElement;
    this.uploader.addToQueue(fileBrowser.files);
    this.messageEvent.emit(fileBrowser.files);  
  }

}
