import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';


@Component({
  selector: 'orderComment',
  templateUrl: './order-comment.component.html',
  styleUrls: ['./order-comment.component.scss']
})
export class orderCommentComponent implements OnInit {

  public workOrderId: string;
  public NotesList: any;
  public noteText = '';
  public finalNoteText = '';
  public message = 'Please Wait...';
  public pageNumber = 1;
  public pageSize = 10;
  public totalCount: number;
  public totalPages: number;
  public workOfferId: string;
  public vendorId: string;

  constructor(public route: ActivatedRoute,
    private vendorSandbox: VendorSandbox,
    private activateRoute: ActivatedRoute,
    private globalErrorHandler: GlobalErrorHandler) {
    this.activateRoute.params.subscribe(url => {
      this.vendorId = url.vendorId;
      this.workOrderId = url.orderId
    });
  }
 

  ngOnInit() {
    this.getComments(this.pageNumber, this.pageSize);
  }

  getComments(pagenumber: number, pagesize: number) {
    this.vendorSandbox.getCommentsDetailsListByOrderId(pagenumber, pagesize, this.workOrderId).subscribe((response) => {
      if (response != null && response.records.length > 0) {
        this.totalCount = response.pagingResult.totalCount;
        this.totalPages = response.pagingResult.totalPages;
        this.NotesList = response;
        this.NotesList.forEach(element => {
          this.checkLength(element.id, element.noteText);
        });
      } else {
        this.NotesList = undefined;
        this.message = `No records found`;
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  changePage(pagesize: number) {
    this.NotesList = undefined;
    this.pageSize = pagesize;
    this.pageNumber = 1;
    this.getComments(this.pageNumber, this.pageSize);
  }

  getPaging(pagenumber: number) {
    this.NotesList = undefined;
    if (pagenumber <= this.totalPages) {
      this.pageNumber = pagenumber;
      this.getComments(this.pageNumber, this.pageSize);
    } else {
      this.message = 'Entered page number should be less than or equal to the total number of pages';
    }
  }

  addNote() {

    const orderType = 'WorkOrder';
    if (this.workOrderId != null) {
      this.vendorSandbox.AddComments(this.noteText, '', '', orderType, this.workOrderId).subscribe((response) => {
        if (response) {
          this.noteText = '';
          this.getComments(this.pageNumber, this.pageSize);
        }
      }, error => this.globalErrorHandler.handleError(error));
    }
  }

  trackNote(index, note) {
    console.log(note);
    return index;

  }

  onCancelClick() {
    this.noteText = '';
  }


  checkLength(id: any, note: string) {
    if (note) {
      const notelinelength = note.split(/\r\n|\r|\n/).length;
      if (notelinelength > 4) {
        return true;
      } else if (notelinelength >= 2 && note.length > 350) {
        return true;
      } else { return false; }
    }
  }

  validateShowMore(id) {
    const moreLess = document.getElementById('moreless_' + id).innerHTML;
    if (moreLess === 'Show more') {
      const currentNote = document.getElementById('notetext_' + id);
      currentNote.classList.remove('hideContent');
      currentNote.classList.add('showContent');
      document.getElementById('moreless_' + id).innerHTML = 'Show less';
    } else {
      const currentNote = document.getElementById('notetext_' + id);
      currentNote.classList.add('hideContent');
      currentNote.classList.remove('showContent');
      document.getElementById('moreless_' + id).innerHTML = 'Show more';
    }
  }
}
