import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, Response } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.route';

import {
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule
} from '@angular/material';

@NgModule({
    imports: [HttpClientModule, CommonModule, LoginRoutingModule, FormsModule, ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatInputModule
    ],
    declarations: [LoginComponent],
    providers: []
})
export class LoginModule { }
