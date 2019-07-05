import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from './preferences.component';
import {PreferenceRoutingModule} from './preferences.route';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatInputModule,
  MatOptionModule,
  MatDividerModule,
  MatSelectModule,
  MatIconModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatListModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatSidenavModule,
  MatTableModule

} from '@angular/material';
import { StarRatingComponent, ConfirmDialogComponent, SwitchComponent, FileUploaderComponent } from '../shared/components/index';
import { SharedModule  } from '../shared/shared.module';
import { ClientsComponent } from './forms/clients/clients.component';
import { ExclusionListUploadComponent } from './forms/exclusion-list-upload/exclusion-list-upload.component';
import { PreferencesSandbox } from './preferences.sandbox';
import{PreferencesService} from '../preferences/services/preferences.service';

@NgModule({
  imports: [
    CommonModule,PreferenceRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatOptionModule,
    MatDividerModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSidenavModule,
    SharedModule,
    MatTableModule
  ],
  declarations: [PreferencesComponent, ClientsComponent, ExclusionListUploadComponent],
  providers:[PreferencesSandbox,PreferencesService]
  
})
export class PreferencesModule { }
