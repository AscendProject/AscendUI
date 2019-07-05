import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'orderdetails',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
    @Input() details: any;
    constructor() {

    }
    ngOnInit() {

    }
    bgcolor(bcolor) {
        if (bcolor === 'New') {
            return 'bg-primary3 bg-primary3b';
        } else if (bcolor === 'InProgress' || bcolor === 'Waiting') {
            return 'bg-warning3 bg-warning3b';
        } else if (bcolor === 'Completed') {
            return 'bg-success3 bg-success3b';
        } else if (bcolor === 'PendingAcceptance') {
            return 'bg-secondary3 bg-secondary3b';
        } else if (bcolor === 'QCReview') {
            return 'bg-dark3 bg-dark3b';
        }
    }
}
