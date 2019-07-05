import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
@Component({
    selector: "ascend-master-layout",
    templateUrl: './master-layout.component.html',
    styleUrls: ['./master-layout.component.scss']
})
export class MasterLayoutComponent implements OnInit {
    isExpanded: boolean;
    showNotification: boolean;
    showProfile: boolean;
    showResource: boolean;
    sidenavfxflex: number;
    maincontentfxflex: number;
    public minimizeLeftNavFlag: boolean;
    sidenavmin: boolean = false;
    @ViewChild('rightNav') rightNav: MatDrawer;
    @ViewChild('sidenav') sidenav: MatDrawer;
    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;

    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    body: HTMLBodyElement = document.getElementsByTagName('body')[0];
    ngOnInit() {
        this.isExpanded = false;
        this.showNotification = false;
        this.showProfile = false;
        this.showResource = false;
        this.minimizeLeftNavFlag = true;
    }

    toggleClose() {
      this.showNotification = false;
      this.showProfile = false;
      this.showResource = false;
    } 
    public closeRightNav(event): void {
      if (event.target.id.indexOf('notification') === -1 && event.target.id.indexOf('profile') === -1 && event.target.id.indexOf('resource') === -1) {
            this.rightNav.close();
        } else {
            if (this.showNotification || this.showProfile || this.showResource) {
                this.rightNav.open();
            } else {
                this.rightNav.close();
            }
        }

    }

    openRightNav(type: string) {
        this.showNotification = type === 'notification' ? !this.showNotification : false;
        this.showProfile = type === 'profile' ? !this.showProfile : false;
        this.showResource = type === 'resource' ? !this.showResource : false;
    }
    minimizeLeftNav(e: boolean) {
        this.sidenavmin = e;
        this.sidenav.open();
        if (this.minimizeLeftNavFlag === false) {
            this.minimizeLeftNavFlag = true;
        } else {
            this.minimizeLeftNavFlag = false;
        }
    }
    ngOnDestroy() {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}
