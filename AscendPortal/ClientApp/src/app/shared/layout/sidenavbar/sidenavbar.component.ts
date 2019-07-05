import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'ascend-sidenvabar',
    templateUrl: './sidenavbar.component.html',
    styleUrls: ['./sidenavbar.component.scss']
})
export class SideNavBarComponent implements OnInit {
    @Input() sidenavmin: boolean;
    constructor() {

    }
    ngOnInit() {
        //alert(this.sidenavmin);

    }
}