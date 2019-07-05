import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
    selector: 'ascend-pagination-header',
    templateUrl: './header.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationHeaderComponent implements OnInit {

    @Input('totalRecords') public totalRecords: number;
    @Input('totalPages') public totalPages: number;
    @Input('pageSize') public pageSize: number;
    @Input('pageNumber') public pageNumber: number;

    @Output() nextpage = new EventEmitter<number>();
    @Output() previouspage = new EventEmitter<number>();


    selected: number;
    constructor() {
    }
    ngOnInit() {
        this.selected = this.pageNumber;
    }

    nextPage(pagenumber: number) {
        if (pagenumber >= 1 && pagenumber <= this.totalPages) {
            this.pageNumber = pagenumber;
            this.selected = this.pageNumber;
            this.nextpage.emit(this.pageNumber);
        }
    }
    previousPage(pagenumber: number) {

        if (pagenumber >= 1 && pagenumber <= this.totalPages) {
            this.pageNumber = pagenumber;
            this.selected = this.pageNumber;
            this.previouspage.emit(this.pageNumber);
        }

    }
    changepagenumber(pagenumber) {
        if (pagenumber >= 1 && pagenumber <= this.totalPages) {
            if (this.selected !== pagenumber) {
                if (pagenumber === undefined || pagenumber === null || pagenumber === '') {
                    this.pageNumber = 1;
                } else {
                    this.pageNumber = pagenumber;
                }
                this.selected = this.pageNumber;
                this.previouspage.emit(this.pageNumber);
            }
        } else {
            this.pageNumber = this.selected;
        }
    }
}
