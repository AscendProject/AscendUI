import { NgModule, NO_ERRORS_SCHEMA, ModuleWithProviders } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { Sandbox } from './base.sandbox';

import {
  StatusTranslatePipe,
  LocalTimeTranslatePipe
}from './pipes/index'

import {
    NotificationsComponent,
    UserProfileComponent,
    ConfirmDialogComponent,
    RatingDialogComponent,
    RatingCommunicationScore,
    AlertDialogComponent,
    EditVendorTypeStatusComponent,
    AddDisciplinaryComponent,
    DisciplinaryDetailsComponent,
    AttestationDetailsComponent,
    ResourcesComponent,
    FileUploaderComponent,
    
} from './components/index';

const ASCEND_SAHREDCOMPONENTS = [
    NotificationsComponent,
    UserProfileComponent,
    ConfirmDialogComponent,
    RatingDialogComponent,
    RatingCommunicationScore,
    AlertDialogComponent,
  StatusTranslatePipe,
  EditVendorTypeStatusComponent,
  FileUploaderComponent,
  ResourcesComponent,

  LocalTimeTranslatePipe
];


import {
    HeaderComponent,
    SideNavBarComponent,
    MasterLayoutComponent
} from './layout/index';

const ASCEND_LAYOUT = [
    HeaderComponent,
    SideNavBarComponent,
    MasterLayoutComponent
];

import {
    DialogsService, SessionService,ResourceService
} from './services/index';

const ASCEND_SHAREDSERVICES = [
  DialogsService, SessionService, LocalTimeTranslatePipe
];
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule
} from '@angular/material';


@NgModule({
    imports: [
        CommonModule,
        //BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatDialogModule,
        MatChipsModule,
        MatFormFieldModule,
        MatSelectModule

    ],
    declarations: [
        ...ASCEND_SAHREDCOMPONENTS,
        ...ASCEND_LAYOUT      
    ],
    providers: [],
    exports: [
        ...ASCEND_SAHREDCOMPONENTS,
    ],
    entryComponents: [ConfirmDialogComponent, AlertDialogComponent, AddDisciplinaryComponent,
         EditVendorTypeStatusComponent,  DisciplinaryDetailsComponent,
        AttestationDetailsComponent, RatingDialogComponent, RatingCommunicationScore],
})
export class SharedModule { }
