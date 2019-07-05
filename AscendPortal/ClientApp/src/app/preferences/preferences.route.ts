import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreferencesComponent } from './preferences.component'
import {ClientsComponent} from './forms/clients/clients.component'
import {ExclusionListUploadComponent} from './forms/exclusion-list-upload/exclusion-list-upload.component';

const routes: Routes = [
    {
        path: '',
        component: PreferencesComponent,
        children: [
            {
              path: 'clients',
              component: ClientsComponent,
              children:[
                {
                    path: 'uploadExclusionList',
                    component: ExclusionListUploadComponent,
                  }

              ]

            },
           
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PreferenceRoutingModule { }
