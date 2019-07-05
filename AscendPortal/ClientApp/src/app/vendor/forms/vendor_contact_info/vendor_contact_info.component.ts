import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../config.service';
import { ContactVendorApiService } from '../../services/contact-vendor-api.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { VendorSandbox } from '../../vendor.sandbox';
import { Observable } from 'rxjs'
import {
  IVendorName, IVendorAddress, IVendorAddressInfo, IServiceType, IVendorEmail,
  IVendorPhone, ICompanyInformation, IVendorProfileModel, IVendorProfileModelResponse
} from '../../../shared/models/add-vendor-model';
import { DialogsService } from '../../../shared/services/dialogs.service';
import { ContactpageAuditHistoryComponent } from '../contactpage-audit-history/contactpage-audit-history.component';

@Component({
  selector: 'vendorcontactinfo',
  templateUrl: './vendor_contact_info.component.html',
  styleUrls: ['./vendor_contact_info.component.scss']
})

export class VendorContactInfoComponent implements OnInit {
  getVendorProfile: any;
  getVendorCompany: any;
  getVendorAddress: any;
  getVendorContact: any;
  color = 'accent';
  checked = false;
  disabled = false;
  vendorid: any;
  @Output() contactdata: any;
  vendorcitystate: string = '';
  vendorname: string = '';  
  public vendorProfileForm: FormGroup;
  public vendorProfilecompanyForm: FormGroup;

  @ViewChild(ContactpageAuditHistoryComponent) historyComponent: ContactpageAuditHistoryComponent;

  isvendornamedetais = true;
  isvendorcompanydetails = true; 
  public textFieldPattern: string;
  public middleName: string;
  public companyNamePattern: string;
  public states: string[];
 
  suffixs = ['Jr',
    'Sr', 'III', 'IV', 'V'];  
  updateContactNameDetails: any;  


  constructor(public router: Router,
    public route: ActivatedRoute,
    private configService: ConfigService,
    public vendorservice: VendorSandbox,
    public $fb: FormBuilder,
    private dialogService: DialogsService) {
    this.vendorid = this.route.snapshot.params['id'];

  }
  ngOnInit() {
    console.log('Configuration ready: ' + this.configService.isReady);
    if (this.configService.isReady) {
      this.loadVendorData(this.vendorid);

    } else {
      this.configService.settingsLoaded$.subscribe(x => {
        this.loadVendorData(this.vendorid);
      });
    }
  }
  loadVendorData(vendorId: string) {
    this.vendorservice.getVendorContactInfo(vendorId).subscribe(
      data => {
        // console.log('contactdata: ' + JSON.stringify(data));
        this.contactdata = data;
        if (this.contactdata !== undefined) {
          if (this.contactdata.vendorAddress && this.contactdata.vendorAddress.length > 0) {
            if (this.contactdata.vendorAddress[0].city !== '' && this.contactdata.vendorAddress[0].city != null && this.contactdata.vendorAddress[0].city !== undefined &&
              this.contactdata.vendorAddress[0].state !== '' && this.contactdata.vendorAddress[0].state != null && this.contactdata.vendorAddress[0].state !== undefined) {
              this.vendorcitystate = this.contactdata.vendorAddress[0].city + ", " + this.contactdata.vendorAddress[0].state;
            } else if (this.contactdata.vendorAddress[0].city !== '' && this.contactdata.vendorAddress[0].city != null && this.contactdata.vendorAddress[0].city !== undefined) {
              this.vendorcitystate = this.contactdata.vendorAddress[0].city;
            } else if (this.contactdata.vendorAddress[0].state !== '' && this.contactdata.vendorAddress[0].state != null && this.contactdata.vendorAddress[0].state !== undefined) {
              this.vendorcitystate = this.contactdata.vendorAddress[0].state;
            }

          }
          if (this.contactdata !== undefined) {
            if (this.contactdata.vendorName.preferredName !== '' && this.contactdata.vendorName.preferredName != null && this.contactdata.vendorName.preferredName !== undefined) {
              this.vendorname = this.contactdata.vendorName.preferredName + " " + this.contactdata.vendorName.lastName + " " + this.contactdata.vendorName.suffix;
            } else {
              this.vendorname = this.contactdata.vendorName.firstName + " " + this.contactdata.vendorName.lastName + " " + this.contactdata.vendorName.suffix;
            }



            this.editloadpagecreate(this.contactdata);


          }
        }
      },
      error => {
        // this.$broadcast.exception('Please fill all the required details with right format.');
      },
      () => {
        //Observable.interval(2000).take(3).subscribe(() => {
        //  this.historyComponent.fetchHistoryDetails();
        //});
      });     
  }
  receiveAddressEvent($event) {
    if ($event.isSuccess) {
      this.loadVendorData(this.vendorid);
      Observable.interval(2000).take(3).subscribe(() => {
        this.historyComponent.fetchHistoryDetails();
      });  
    }    
  }
  editloadpagecreate(data) {
    // this.textFieldPattern = '^([A-Za-z-,.\'` -]{0,200})+$';
    // this.middleName = '^([A-Za-z-,.\'`-]{0,200})+$';
   // this.companyNamePattern = '^([A-Za-z0-9-,.\'` -&@!()[]{0,200})+$';
    this.states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC',
      'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA',
      'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH',
      'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
      'TX', 'UT', 'VT', 'VA', 'WA', 'WI', 'WV', 'WY', 'AS', 'FM', 'GU', 'MH', 'MP',
      'PI', 'PW'];
    //this.emailPattern = '^[a-z][a-z|0-9|]*([_][a-z|0-9]+)*([.][a-z|0-9]+([_][a-z|0-9]+)*)?@[a-z][a-z|0-9|]*\.([a-z][a-z|0-9]*(\.[a-z][a-z|0-9]*)?)$';

    //var data = this.contactdata;

    // this.iseditvendoraddressdetais = true;


    this.vendorProfileForm = this.$fb.group({
      firstName: [this.contactdata.vendorName.firstName, Validators.pattern(this.textFieldPattern)],
      lastName: [this.contactdata.vendorName.lastName, Validators.pattern(this.textFieldPattern)],
      middleName: [this.contactdata.vendorName.middleName, Validators.pattern(this.middleName)],
      suffix: this.contactdata.vendorName.suffix,
      preferredName: [this.contactdata.vendorName.preferredName, Validators.pattern(this.textFieldPattern)],
      isStaffAppraiser: [this.contactdata.vendorName.isStaffAppraiser, ],

    });   

    this.vendorProfilecompanyForm = this.$fb.group({
      companyName: [this.contactdata.vendorCompany.companyName, Validators.pattern(this.companyNamePattern)],
      companystate: [this.contactdata.vendorCompany.state, [Validators.required]],
    });        
  } 
 
 
  editvendornamedetails(data) {
    this.editloadpagecreate(this.contactdata);    
    this.isvendornamedetais = false;
  }

  savevendornamedetails() {
    let form = this.vendorProfileForm.value;
    let vendor = <IVendorName>{
      firstName: form.firstName,
      lastName: form.lastName,
      middleName: form.middleName,
      suffix: form.suffix,
      preferredName: form.preferredName,
      isStaffAppraiser: form.isStaffAppraiser
    };
    let vendorobj = {
      vendorId: this.vendorid,
      vendorName: vendor,
      updatedVendorSection: 1
    }
    let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.vendorservice.updateVendorContactInfo(vendorobj);
        this.vendorservice.updateVendorContactInfo$.subscribe((data) => {          
          //this.toastr.success('Updated Vendor Name Details Success', 'Success');          
          this.isvendornamedetais = true;
          this.updateContactNameDetails = data;
        //  console.log("vendorame =======", data);
          this.contactdata.vendorName.firstName = this.updateContactNameDetails.name.firstName;
          this.contactdata.vendorName.lastName = this.updateContactNameDetails.name.lastName;
          this.contactdata.vendorName.middleName = this.updateContactNameDetails.name.middleName;

          this.contactdata.vendorName.preferredName = this.updateContactNameDetails.name.preferredName;
          this.contactdata.vendorName.suffix = this.updateContactNameDetails.name.suffix;

          if (this.updateContactNameDetails !== undefined) {
            if (this.updateContactNameDetails.name.preferredName !== '' && this.updateContactNameDetails.name.preferredName != null && this.updateContactNameDetails.name.preferredName !== undefined) {
              this.vendorname = this.updateContactNameDetails.name.preferredName + " " + this.updateContactNameDetails.name.lastName + " " + this.updateContactNameDetails.name.suffix;
            } else {
              this.vendorname = this.updateContactNameDetails.name.firstName + " " + this.updateContactNameDetails.name.lastName + " " + this.updateContactNameDetails.name.suffix;
            }
          }

        },
          error => {
            // this.toastr.error('Failed to updated vendor name details.', 'Major Error', {
            //   timeOut: 3000,
            // });

          },
          () => {
            Observable.interval(2000).take(3).subscribe(() => {
              this.historyComponent.fetchHistoryDetails();
            });          
          });
      } else {
      }
    });


  }
  onBlurMethod(value, e, formName) {
    if (formName === 'vendorProfileForm') {
      this.vendorProfileForm.get(e).setValue(value.toString().trim());
    } else {
      this.vendorProfilecompanyForm.get(e).setValue(value.toString().trim());
    }   
       
  }
  vendornamedeatilscancel() {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {       
        this.isvendornamedetais = true;
      } else {
        this.isvendornamedetais = false;
      }
    });
  }

  editvendorcompanydetails() {
    this.editloadpagecreate(this.contactdata);    
    this.isvendorcompanydetails = false;
  }

  savevendorcompanydetails() {
    let form = this.vendorProfilecompanyForm.value;

    let vendorcompanyInformation = {
      companyName: form.companyName,
      state: form.companystate
    };

    let vendorobj = {
      vendorId: this.vendorid,
      vendorCompany: vendorcompanyInformation,
      updatedVendorSection: 6
    }
    let dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.vendorservice.updateVendorContactInfo(vendorobj);
        this.vendorservice.updateVendorContactInfo$.subscribe(
          data => {
            //this.toastr.success('Updated Vendor Company Details Success', 'Success');            
            this.isvendorcompanydetails = true;
           // console.log(data);
            this.updateContactNameDetails = data;


            this.contactdata.vendorCompany.companyName = this.updateContactNameDetails.company.companyName;
            this.contactdata.vendorCompany.state = this.updateContactNameDetails.company.state;
          },
          error => {
            // this.toastr.error('Failed to updated vendor company details.', 'Major Error', {
            //   timeOut: 3000,
            // });

          },
          () => {
            Observable.interval(2000).take(3).subscribe(() => {
              this.historyComponent.fetchHistoryDetails();
            });
          });
      } else {
      }
    });
  }

  cancelcompanyupdate() {
    let dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {        
        this.isvendorcompanydetails = true;
      } else {
        this.isvendorcompanydetails = false;
      }
    });
  }

 

  toTitleCase(str) {
    if (str != null || str != undefined) {
      if (str.includes("'") && str.split("'")[1].charAt(0).includes(" ")) {
        str = str.split(" ")[0] + str.split("'")[1].replace(/\s*/, '');
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      } else {
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
    }
  } 
 
}
