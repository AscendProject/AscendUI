import { Component, OnInit } from '@angular/core';
import { Router   } from '@angular/router';


@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
 
  constructor( public router: Router) { }

  ngOnInit() {
  }

  setClickedRow() {
    this.router.navigate(['preferences', 'clients']);
  }

 
}
