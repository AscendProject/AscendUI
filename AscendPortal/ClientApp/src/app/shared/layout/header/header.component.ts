import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { MatDrawer } from '@angular/material/sidenav';
@Component({
    selector: 'ascend-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Output() navToggle = new EventEmitter<boolean>();
    @Output() rightnav = new EventEmitter<string>();
    badgenumber: number = 27;
    sidetoggle: boolean = false;
    constructor() {
    }
    ngOnInit() {
    }
    // navOpen(e) {
    //     this.sidetoggle = !e;
    //     this.navToggle.emit(this.sidetoggle);
    // }

    navOpen() {
        this.navToggle.emit(true);
    }
    tbutton: any;
    openRightNav(type) {
      debugger
        this.rightnav.emit(type);
        this.tbutton = type;
    }

}
