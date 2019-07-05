import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  getVendorsdata=['HSBC'];

  constructor(public router:Router) { }

  ngOnInit() {
   
  }

  setClickedRow() {
    this.router.navigate(['preferences','clients', 'uploadExclusionList']);
  }

}
