import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'ascend-page-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationFooterComponent implements OnInit {
    @Input('totalRecords') public totalRecords: number;
    @Input('pageSize') public pageSize: number;
    @Input('pageNumber') public pageNumber: number;
    @Input('totalPages') public totalPages: number;
    currentPageSize: number = null;
    @Output() changepage = new EventEmitter<number>();
    ngOnInit() {
        this.currentPageSize = this.pageSize;
    }

    changePageSize(pagesize: number) {
        this.currentPageSize = pagesize;
        this.changepage.emit(pagesize);
    }
    ConvertToInt(val) {
        return parseInt(val);
    }

}
