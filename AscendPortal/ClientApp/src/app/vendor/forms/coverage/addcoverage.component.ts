import { Component, OnInit, Output, EventEmitter, ViewChild, NgZone, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { VendorSandbox } from '../../vendor.sandbox';
import { GlobalErrorHandler } from '../../../shared/globalError_handler/global-error-handler';
import { DialogsService } from '../../../shared/services/dialogs.service';
import { ConfigService } from '../../../config.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/format-currency.pipe';
import { CurrencyFormatterDirective } from '../../../shared/directives/currency-formatter.directive';
import { NumberFormatPipe } from '../../../shared/pipes/numberformat.pipe';
import { NumberFormatDirective } from '../../../shared/directives/number-formatter.directive';
import { BroadcastService } from '../../services/broadcast.service';
import { debug } from 'util';


@Component({
  selector: 'app-addcoverage',
  templateUrl: './addcoverage.component.html',
  styleUrls: ['./addcoverage.component.scss'],
  providers: [CurrencyFormatPipe, NumberFormatPipe]
})
export class AddcoverageComponent implements OnInit {
  vendorid: any;
  public coverageAreaForm: FormGroup;
  coverageAreaData: any = [];
  isCoverageAdd = false;
  states: Array<any> = [];
  counteis: Array<any> = [];
  zipCodes: Array<any> = [];
  @Output() messageEvent = new EventEmitter<Object>();
  @Output() isaccordiansuccess = new EventEmitter<Object>();
  @Output() messageApplyEvent = new EventEmitter<Object>();
  @Input() serviceName: string;
  @Input() isSelectH = false;
  @Input() isSelectEx = false;
  isZipValid = true;
  _coverageData: any;
  _accData: any;
  finalZipcodesandcounty: Array<any> = [];
  missingData: Array<any> = [];
  @Input() set recievecoveragehvrdata(newData) {
    console.log(newData);
    this._coverageData = newData;
    this.receiveCoverage(this._coverageData);
  }
  @Input() set recievecoverageexteriordata(newData) {
    console.log(newData);
    this._coverageData = newData;
    this.receiveCoverage(this._coverageData);
  }
  @Input() set accordianhvrdata(accData) {
    console.log(1, accData);
    this._accData = accData;
    this.receiveAccordianClik(this._accData);
  }
  @Input() set accordianexteriordata(accData) {
    console.log(2, accData);
    this._accData = accData;
    this.receiveAccordianClik(this._accData);
  }
  isCoverageDuplicate = false;
  @ViewChild('coveragecontainer') coveragecontainer;
  serviceId = '';
  isAnyFormFieldEdited = false;
  @Input() vendorID: any;
  attestationValue: boolean;
  attestationDetails: any;
  isEligibleForAttestation: false;
  validStatesForAttestation = ['WV', 'WI', 'NC'];
  isAttestationChecked = true;
  isEditCoverage = false;
  tempCoverageAreaData: any = [];


  constructor(private vendorSandbox: VendorSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    public dialogService: DialogsService,
    public router: Router,
    public route: ActivatedRoute,
    public $fb: FormBuilder,
    private configService: ConfigService,
    public broadService: BroadcastService,
    public zone: NgZone) {
    this.vendorid = this.route.snapshot.params['id'];
    document.addEventListener('click', this.offClickHandler.bind(this));
  }

  // clicks on outside of table hide the apply to all button.
  offClickHandler(event: any) {
    if (this.coveragecontainer && this.coveragecontainer.nativeElement.contains(event.target)) {

    } else {
      this.coverageAreaData.forEach(eachdata => {
        eachdata.isTatEntered = false;
      });
      this.coverageAreaData.forEach(eachdata => {
        eachdata.isPricingEntered = false;
      });
    }
  }

  ngOnInit() {
    this.vendorid = this.vendorID;
    this.broadService.on<any>('attestationDetails').subscribe((attestaDetailsObj) => {
      this.zone.run(() => {
        // Angular2 Issue
        if (attestaDetailsObj) {
          console.log(attestaDetailsObj);
          this.attestationDetails = attestaDetailsObj;

        }
      });
    });

    this.patchCoverageForm();
    localStorage.setItem('formchange', JSON.stringify({ isfieldchanged: this.isAnyFormFieldEdited }));
    localStorage.setItem('coveragechange', JSON.stringify({ finalcoverage: false }));
    localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: [] }));
    localStorage.setItem('finalcoveragedata', JSON.stringify({ finalcoverage: [] }));
  }

  // accordian click function
  receiveAccordianClik(accdata: any) {
    let fieldchanged;
    let coveragechaged;
    console.log(localStorage);
    if (localStorage) {
      fieldchanged = localStorage.getItem('formchange') ? JSON.parse(localStorage.getItem('formchange')) : false;
      coveragechaged = localStorage.getItem('coveragechange') ? JSON.parse(localStorage.getItem('coveragechange')) : false;
    }
    if (coveragechaged.finalcoverage || fieldchanged.isfieldchanged) {
      if (accdata) {
        console.log(!this.isZipValid, !this.isSelectH, !this.isSelectEx);
        let dref2: any;
        if (!this.isZipValid && (!this.isSelectH || !this.isSelectEx)) {
          dref2 = this.dialogService.showDialog('Would you like to save your changes?', '', '400');
        } else {
          dref2 = this.dialogService.showDialog('Would you like to save your changes?', 'Yes', '400');
        }

        dref2.afterClosed().subscribe(result => {
          console.log(`Dialog closed: ${result}`);
          if (result) {
            if (accdata.service === 'HVR+' && accdata.isopenex) {
              this.serviceName = 'Exterior Inspection';
            } else if (accdata.service === 'Exterior Inspection' && accdata.isopenh) {
              this.serviceName = 'HVR+';
            }
            this.saveService(true);
          } else {
            const dref3 = this.dialogService.showDialog('Are you sure?', 'Yes', '400');
            dref3.afterClosed().subscribe((result2) => {
              console.log(`Dialog closed: ${result2}`);
              if (result2) {
                if (accdata.service === 'HVR+' && accdata.isopenex) {
                  this.isaccordiansuccess.emit({ 'service': 'HVR+', 'isSuccess': true });
                } else if (accdata.service === 'Exterior Inspection' && accdata.isopenh) {
                  this.isaccordiansuccess.emit({ 'service': 'Exterior Inspection', 'isSuccess': true });
                }
              } else {
                if (accdata.service === 'Exterior Inspection') {
                  this.isaccordiansuccess.emit({ 'service': 'HVR+', 'isSuccess': false });
                } else {
                  this.isaccordiansuccess.emit({ 'service': 'Exterior Inspection', 'isSuccess': false });
                }

              }
            });
          }
        });
      }
    } else { }

  }
  // Edit coverage
  editCoverage() {
    console.log(this.counteis);
    this.isEditCoverage = true;
    this.getEditedCoverageCounties();
  }
  cancelCoverageEdit() {
    const dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.isEditCoverage = false;
      } else {

      }
    });
    
  }
  // Passing array and county,based on county name returns the state.
  getStateAbbreviation(arr, abbr) {
    let stateAbbr = '';
    arr.forEach((cur) => {
      if (cur.countyName === abbr) {
        console.log(cur.stateAbbreviation);
        stateAbbr = cur.stateAbbreviation;
      }

    });
    return stateAbbr;
  }

  // Chercking is object is empty or not
  isEmptyObject(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  // recieave all coverages data after service success.
  receiveCoverage(acordianData) {
    console.log(this.serviceName);
    this.coverageAreaData = [];
    if (!this.isEmptyObject(acordianData)) {
      //  acordianData.forEach(eachservice => {
      const eachservice = acordianData;
      if (eachservice.serviceName === this.serviceName) {
        // console.log(eachservice);
        this.serviceId = eachservice.id;
        let coveragedatatemp: any;
        if (eachservice.coverageAreas != null) {
          coveragedatatemp = eachservice.coverageAreas;
          for (let i = 0, lent = coveragedatatemp.counties.length; i < lent; i++) {
            for (let j = 0, len = coveragedatatemp.zipCodes.length; j < len; j++) {
              if (coveragedatatemp.counties[i].countyName === coveragedatatemp.zipCodes[j].countyName &&
                eachservice.serviceName === this.serviceName) {
                this.coverageAreaData.push({
                  'serviceName': this.serviceName, 'state': this.getStateAbbreviation(coveragedatatemp.counties,
                    coveragedatatemp.zipCodes[j].countyName), 'county': coveragedatatemp.zipCodes[j].countyName,
                  'zipcode': coveragedatatemp.zipCodes[j].zipCode, 'pricing': coveragedatatemp.zipCodes[j].pricing,
                  'tat': coveragedatatemp.zipCodes[j].tat, 'isTatEntered': false, 'isPricingEntered': false,
                  'attestation': coveragedatatemp.zipCodes[j].attestation,
                  'isAttestationView': coveragedatatemp.zipCodes[j].attestation != null ? true : false
                });
              } else { }
            }

          }
        }
      } else {

      }
      if (this.coverageAreaData.length > 0) {
        localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: this.coverageAreaData }));
      }
      console.log('---->', this.coverageAreaData);
    }
  }

  // Add coverage area form initialization
  patchCoverageForm() {

    if (this.configService.isReady) {
      this.getStates();

    } else {
      this.configService.settingsLoaded$.subscribe(x => {
        this.getStates();
      });
    }
    this.counteis = [];
    this.zipCodes = [];
    this.coverageAreaForm = this.$fb.group({
      state: [, Validators.required],
      county: [],
      zipcode: [],
      attestation: []
    });

  }

  addCoverageClick() {
    this.patchCoverageForm();
    this.isCoverageAdd = true;
  }

  // getting statesgetAllStatesByLicence
  getStates() {

    let tempStates: any = [];

    this.vendorSandbox.getVendorCoverageStates(this.vendorid);
    this.vendorSandbox.getVendorCoverageStatesList$.subscribe((data) => {
      tempStates = data.records;
    }, error => this.globalErrorHandler.handleError(error),
      () => {
        tempStates.forEach(eachstate => {
          if (this.states.length > 0) {
            const index = this.deepIndexOf(this.states, eachstate);
            if (index > -1) {

            } else {
              this.states.push(eachstate);
            }
          } else {
            this.states.push(eachstate);
          }
        });
      });
  }

  // on select state get counties
  getCounties(stateVal) {
    this.vendorSandbox.getVendorCoverageCounties(stateVal);
    this.vendorSandbox.getVendorCoverageCountiesList$.subscribe((data) => {
      this.counteis = data.counties;
    }, error => this.globalErrorHandler.handleError(error),
      () => {
      });
    this.coverageAreaForm.patchValue({ county: '' });
  }

  // Getting index of current object
  deepIndexOf(arr, obj) {
    return arr.findIndex(function (cur) {
      return Object.keys(obj).every(function (key) {
        return obj[key] === cur[key];
      });
    });
  }

  // on select couinty get zips
  getZips(countyVal) {
    // this.zipCodes = [];    
    let resArr = [];
    if (this.zipCodes.length > 0) {
      const filtered = this.zipCodes.filter(
        function (e) {
          return this.indexOf(e.countyName) < 0;
        },
        countyVal
      );
      // console.log(filtered);
      filtered.forEach(data => {
        const index = this.deepIndexOf(this.zipCodes, data);
        if (index > -1) {
          this.zipCodes.splice(index, 1);

        }
      });
      for (let k = 0; k < this.zipCodes.length; k++) {
        for (let l = 0, lent2 = countyVal.length; l < lent2; l++) {
          if (this.zipCodes[k].countyName === countyVal[l]) {
            resArr.push(this.zipCodes[k].countyName);
          } else {

          }
        }
      }
    }

    const zips = this.counteis;
    for (let i = 0, len = zips.length; i < len; i++) {
      for (let j = 0, lent = countyVal.length; j < lent; j++) {
        if (zips[i].countyName === countyVal[j]) {
          const indx = resArr.indexOf(countyVal[j]);
          if (indx > -1) {
            const filteredarr = this.finalZipcodesandcounty.filter(
              function (e) {
                return this.indexOf(e.county) < 0;
              },
              countyVal
            );
            filteredarr.forEach(data => {
              const index = this.deepIndexOf(this.finalZipcodesandcounty, data);
              if (index > -1) {
                this.finalZipcodesandcounty.splice(index, 1);
              }
            });
          } else {
            this.zipCodes.push(zips[i]);
          }
        } else {

        }
      }
    }

    if (this.coverageAreaData.length > 0) {
      for (let i = 0, lenthdata = this.zipCodes.length; i < lenthdata; i++) {
        for (let j = 0, lenthzip = this.coverageAreaData.length; j < lenthzip; j++) {
          if (this.coverageAreaData[j].county === this.zipCodes[i].countyName) {
            this.zipCodes[i].zipcode.forEach(eachz => {
              if (eachz === this.coverageAreaData[j].zipcode) {
                // this.zipCodes[i].ishideZips.push(eachz);
                const indx = this.zipCodes[i].zipcode.indexOf(eachz);
                if (indx > -1) {
                  this.zipCodes[i].zipcode.splice(indx, 1);
                }
              }
            });

          }
        }
      }
    }
    // this.coverageAreaForm.patchValue({ zipcode: '' });
  }
  // on select zips checking duplicates and
  checkZips(stateVal, zipval) {
    let resZips = [];
    this.finalZipcodesandcounty = [];
    let isExistVal = {};
    for (let i = 0, len = this.zipCodes.length; i < len; i++) {
      for (let j = 0, lent = zipval.length; j < lent; j++) {
        if (this.zipCodes[i].zipcode.includes(zipval[j])) {
          resZips.push(this.zipCodes[i].countyName);
          this.finalZipcodesandcounty.push({
            'serviceName': this.serviceName, 'state': stateVal, 'county': this.zipCodes[i].countyName,
            'zipcode': zipval[j], 'pricing': '', 'tat': '', 'isTatEntered': false, 'isPricingEntered': false
          });

        } else {
          console.log(zipval[j]);
        }
      }
    }
    localStorage.setItem('coveragechange', '');
    const res = this.arrayRemoveDuplicates(resZips);
    console.log(res);
    if (res.length === this.zipCodes.length) {
      this.isZipValid = true;
    } else {
      this.isZipValid = false;
      this.coverageAreaForm.get('zipcode').setErrors({ 'valid': false });
    }
    if (this.coverageAreaData.length > 0) {
      this.finalZipcodesandcounty.forEach(edata => {
        if (this.findDuplicates(edata.zipcode, this.coverageAreaData)) {
          isExistVal = edata;
        }
      });
      console.log(this.finalZipcodesandcounty);
    }
    if (isExistVal && Object.keys(isExistVal).length !== 0) {
      const dref = this.dialogService.showDialog('The coverage is already exist!', 'Ok', '400');
      dref.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {
          this.isCoverageDuplicate = true;
          const index = this.deepIndexOf(this.finalZipcodesandcounty, isExistVal);
          if (index > -1) {
            console.log(index);
            this.finalZipcodesandcounty.splice(index, 1);
          }
        }
      });


    } else {
      this.isCoverageDuplicate = false;
    }

    if (this.finalZipcodesandcounty.length > 0) {
      console.log(this.finalZipcodesandcounty);
      localStorage.setItem('finalcoveragedata', JSON.stringify({ finalcoverage: this.finalZipcodesandcounty }));
      localStorage.setItem('coveragechange', JSON.stringify({ finalcoverage: true }));
    }
  }

  // Finding duplicates in array using object
  findDuplicates(v, normalArray) {
    let newArray = false;
    normalArray.forEach(function (a, i) {
      Object.keys(a).forEach(function (k) {
        if (a[k] === v) {
          newArray = true;
        }
      });
    });
    return newArray;
  }

  // removing duplicates from array.
  arrayRemoveDuplicates(myArray) {
    return myArray.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
  }

  // Apply the price for single coverage
  applyPricing(pval, kindx) {
    this.coverageAreaData[kindx].pricing = pval;
    localStorage.setItem('formchange', '');
    this.isAnyFormFieldEdited = true;
    localStorage.setItem('formchange', JSON.stringify({ isfieldchanged: this.isAnyFormFieldEdited }));
    localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: this.coverageAreaData }));
  }



  // Apply the price to all coverages
  applyPricingToAll(priceVal) {
    console.log(priceVal);
    this.coverageAreaData.forEach(eachdata => {
      eachdata.pricing = priceVal;
    });
    localStorage.setItem('formchange', '');
    this.isAnyFormFieldEdited = true;
    localStorage.setItem('formchange', JSON.stringify({ isfieldchanged: this.isAnyFormFieldEdited }));
    localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: this.coverageAreaData }));
  }

  // apply the tat for single coverage
  applyTat(tval, tindx) {
    this.coverageAreaData[tindx].tat = tval;
    localStorage.setItem('formchange', '');
    this.isAnyFormFieldEdited = true;
    localStorage.setItem('formchange', JSON.stringify({ isfieldchanged: this.isAnyFormFieldEdited }));
    localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: this.coverageAreaData }));
  }

  // apply the tat for all coverages.
  applyTatToAll(tatval) {
    this.coverageAreaData.forEach(eachdata => {
      eachdata.tat = tatval;
    });
    localStorage.setItem('formchange', '');
    this.isAnyFormFieldEdited = true;
    localStorage.setItem('formchange', JSON.stringify({ isfieldchanged: this.isAnyFormFieldEdited }));
    localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: this.coverageAreaData }));
  }

  // cursor entered to text input
  isCursorEnetered(rname, index) {
    if (rname === 'tat') {
      this.coverageAreaData.forEach(eachdata => {
        eachdata.isTatEntered = false;
      });
      this.coverageAreaData.forEach(eachdata => {
        eachdata.isPricingEntered = false;
      });
      if (this.coverageAreaData[index].isTatEntered) {
        this.coverageAreaData[index].isTatEntered = false;
      } else {
        this.coverageAreaData[index].isTatEntered = true;
      }
    } else {
      this.coverageAreaData.forEach(eachdata => {
        eachdata.isPricingEntered = false;
      });
      this.coverageAreaData.forEach(eachdata => {
        eachdata.isTatEntered = false;
      });
      if (this.coverageAreaData[index].isPricingEntered) {
        this.coverageAreaData[index].isPricingEntered = false;
      } else {
        this.coverageAreaData[index].isPricingEntered = true;
      }
    }

  }

  // is cursor out event
  isCursorOutFun() {
    this.coverageAreaData.forEach(eachdata => {
      eachdata.isTatEntered = false;
    });
    this.coverageAreaData.forEach(eachdata => {
      eachdata.isPricingEntered = false;
    });
  }
  // saving the coverage details

  cancelCoverageArea() {
    const dref = this.dialogService.showDialog('Are you sure you want to cancel?', 'Yes', '400');
    dref.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result) {
        this.isCoverageAdd = false;
      } else {

      }
    });
  }

  // sorting the coverages table
  onCoverageSorted($event) {
    this.getSortedCoveragesData($event);
  }

  // Sorting the table
  getSortedCoveragesData(criteria) {
    console.log(criteria);
    return this.coverageAreaData.sort((a, b) => {
      if (criteria.sortDirection === 'asc') {
        if (a[criteria.sortColumn] < b[criteria.sortColumn]) {
          return -1;
        } else if (a[criteria.sortColumn] > b[criteria.sortColumn]) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (a[criteria.sortColumn] < b[criteria.sortColumn]) {
          return 1;
        } else if (a[criteria.sortColumn] > b[criteria.sortColumn]) {
          return -1;
        } else {
          return 0;
        }
      }
    });
  }

  // checking array contains duplicates or not
  deepIndexOfAbbreviation(arr, obj, abbr) {
    let isSuccess = false;
    arr.findIndex((cur) => {
      if (obj === cur[abbr]) {
        isSuccess = true;
      }
    });
    return isSuccess;
  }
  checkAllCoverageData() {
    let coverageTempObj: any;
    let finalTempObj: any;
    let coverageOBj = [];
    coverageOBj = this.coverageAreaData;
    // this.spinner.show();
    console.log(localStorage);
    coverageTempObj = localStorage.getItem('coverageareadata') ? JSON.parse(localStorage.getItem('coverageareadata')) : [];
    finalTempObj = localStorage.getItem('finalcoveragedata') ? JSON.parse(localStorage.getItem('finalcoveragedata')) : [];
    console.log(coverageTempObj.coveragedata);
    console.log(finalTempObj.finalcoverage);
    if (finalTempObj.finalcoverage !== undefined) {
      this.finalZipcodesandcounty = finalTempObj.finalcoverage;
    }

    if (coverageTempObj.coveragedata !== undefined) {
      coverageOBj = coverageTempObj.coveragedata;
    }

    if (this.finalZipcodesandcounty.length > 0) {
      this.finalZipcodesandcounty.forEach(data => {
        if (data.serviceName === this.serviceName) {
          coverageOBj.push(data);
        }
      });
    }
    return this.allTrue(coverageOBj);
  }
  allTrue(arr) {
    // console.log(arr);
    let isTrue = {'coverage': false, 'coverageAttest': false};    
    for (let i = 0, len = arr.length; i < len; i++) {
      for (var o in arr[i]) {       
        if (this.validStatesForAttestation.includes(arr[i].state)) {          
          if (arr[i][o] === '' || arr[i][o] === '0' || arr[i][o] === null) {
            isTrue.coverageAttest = true;
          }
        } else {
          if (arr[i][o] === '' || arr[i][o] === '0') {
            isTrue.coverage = true;
          }
        }
       
      }  
    }     
    return isTrue;
}

  // save entire service
  saveService(isaccordian) {
    if (isaccordian) {
      this.saveServiceCoverage(isaccordian);
    } else {
      const countiesVal = this.coverageAreaForm.get('county').value;
      const zipcodesVal = this.coverageAreaForm.get('zipcode').value;
      let dref: any;            
      if (this.isEditCoverage) {
        let isEMptyData = this.checkAllCoverageData();
        if (isEMptyData.coverage || isEMptyData.coverageAttest) {
          dref = this.dialogService.showDialog('This coverage area is missing information. It will not be available for use until all information has been added. Would you like to save anyway?', 'Yes', '400');
        } else {
          dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
        }   
      } else {
        if (countiesVal === '' || zipcodesVal === '') {
          dref = this.dialogService.showDialog('This coverage area is missing information. It will not be available for use until all information has been added. Would you like to save anyway?', 'Yes', '400');
        } else {
          dref = this.dialogService.showDialog('Are you sure you want to save?', 'Yes', '400');
        }   
      }
          
      dref.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
        if (result) {          
          if (countiesVal === '' || zipcodesVal === '') {
            this.missingData.push({
              'serviceName': this.serviceName, 'state': this.coverageAreaForm.get('state').value, 'county': '',
              'zipcode': '', 'pricing': '', 'tat': '', 'isTatEntered': false, 'isPricingEntered': false
            });
          }
          this.saveServiceCoverage(isaccordian);
        } else {
          this.isCoverageAdd = false;
        }
      });
    }

  }
  getAttestationCounty(county) {
    let attestCounty = '';
    if (county != '') {
      for (let i = 0, len = this.coverageAreaData.length; i < len; i++) {
        if (this.coverageAreaData[i].county === county) {
          if (this.coverageAreaData[i].attestation) {
            attestCounty = this.coverageAreaData[i].county;
          }
        }
      }
    }    
    return attestCounty;
  }

  getAttestationObj(countyVal) {
    let attestObj = null;
    for (let i = 0, len = this.coverageAreaData.length; i < len; i++) {
      if (this.coverageAreaData[i].county === countyVal) {
        if (this.coverageAreaData[i].attestation) {
          attestObj = this.coverageAreaData[i].attestation;
        }
      }
    }
    return attestObj;
  }
  // Save coverage data api call.
  saveServiceCoverage(isaccordian) {
    let coverageTempData: any;
    let finalTempData: any;
    // this.spinner.show();
    console.log(localStorage);
    coverageTempData = localStorage.getItem('coverageareadata') ? JSON.parse(localStorage.getItem('coverageareadata')) : [];
    finalTempData = localStorage.getItem('finalcoveragedata') ? JSON.parse(localStorage.getItem('finalcoveragedata')) : [];
    console.log(coverageTempData.coveragedata);
    console.log(finalTempData.finalcoverage);    
    if (finalTempData.finalcoverage !== undefined) {
      this.finalZipcodesandcounty = finalTempData.finalcoverage;
    }
    if (coverageTempData.coveragedata !== undefined) {
      this.coverageAreaData = coverageTempData.coveragedata;
    }
    
    if (this.missingData.length > 0) {
      this.coverageAreaData.push(this.missingData[0]);
    }
    if (this.finalZipcodesandcounty.length > 0) {
      this.finalZipcodesandcounty.forEach(data => {
        if (data.serviceName === this.serviceName) {
          this.coverageAreaData.push(data);
        }

      });
    }
    console.log(this.coverageAreaData);
    let resObj: any;
    let coverageArea: any = {};
    let states: any = [];
    let counties: any = [];
    let zipCodes: any = [];
    let vendorService: any = [];
    if (this.coverageAreaData.length > 0) {
      for (let i = 0, len = this.coverageAreaData.length; i < len; i++) {        
        console.log(this.coverageAreaData[i].state);
        if (states.length === 0) {
          states.push({ 'stateAbbreviation': this.coverageAreaData[i].state, 'name': '' });
        } else if (states.length > 0 && !this.deepIndexOfAbbreviation(states, this.coverageAreaData[i].state, 'stateAbbreviation')) {
          
          states.push({ 'stateAbbreviation': this.coverageAreaData[i].state, 'name': '' });
        }        
        if (counties.length === 0) {
          counties.push({ 'stateAbbreviation': this.coverageAreaData[i].state, 'countyName': this.coverageAreaData[i].county ? this.coverageAreaData[i].county : '' });
        } else if (counties.length > 0 && !this.deepIndexOfAbbreviation(counties, this.coverageAreaData[i].county, 'countyName')) {
          counties.push({ 'stateAbbreviation': this.coverageAreaData[i].state, 'countyName': this.coverageAreaData[i].county ? this.coverageAreaData[i].county : '' });
        }
        let price = '';
        if (this.coverageAreaData[i].pricing && this.coverageAreaData[i].pricing !== '') {
          if (this.coverageAreaData[i].pricing.indexOf('$') >= 0) {
            price = this.coverageAreaData[i].pricing.split('$')[1];
          } else {
            price = this.coverageAreaData[i].pricing;
          }
        } else {
          price = '0';
        }

        //for (let k = 0, len = this.validStatesForAttestation.length; k < len; k++) {
        if (this.getAttestationCounty(this.coverageAreaData[i].county) != '' && this.validStatesForAttestation.includes(this.coverageAreaData[i].state)) {
          zipCodes.push({
            'stateAbbreviation': this.coverageAreaData[i].state,
            'countyName': this.coverageAreaData[i].county ? this.coverageAreaData[i].county : '',
            'zipCode': this.coverageAreaData[i].zipcode ? this.coverageAreaData[i].zipcode : '',
            'pricing': price, 'tat': this.coverageAreaData[i].tat ? this.coverageAreaData[i].tat : '0',
            'attestation': this.getAttestationObj(this.coverageAreaData[i].county) != null ? this.getAttestationObj(this.coverageAreaData[i].county) : null
          });
        } else {
          zipCodes.push({
            'stateAbbreviation': this.coverageAreaData[i].state,
            'countyName': this.coverageAreaData[i].county ? this.coverageAreaData[i].county : '',
            'zipCode': this.coverageAreaData[i].zipcode ? this.coverageAreaData[i].zipcode : '',
            'pricing': price, 'tat': this.coverageAreaData[i].tat ? this.coverageAreaData[i].tat : '0',
            'attestation': null
          })
        }
        // }

      }
      coverageArea = {
        'states': states, 'counties': counties, 'zipCodes': zipCodes
      };
      if (this.serviceName === 'HVR+' && this.isSelectH) {
        vendorService.push({
          'vendorId': this.vendorid,
          'serviceName': this.serviceName,
          'id': this.serviceId,
          'coverageAreas': coverageArea,
          'isSelected': true,
          'updatedVendorSection': 0
        });
      }
      if (this.serviceName === 'Exterior Inspection' && this.isSelectEx) {
        vendorService.push({
          'vendorId': this.vendorid,
          'serviceName': this.serviceName,
          'id': this.serviceId,
          'coverageAreas': coverageArea,
          'isSelected': true,
          'updatedVendorSection': 0
        });
      }


    } else {
      if (this.isSelectH) {
        vendorService.push({
          'vendorId': this.vendorid,
          'serviceName': 'HVR+',
          'id': '',
          'coverageAreas': null,
          'isSelected': true
        });
      }
      if (this.isSelectEx) {
        vendorService.push({
          'vendorId': this.vendorid,
          'serviceName': 'Exterior Inspection',
          'id': '',
          'coverageAreas': null,
          'isSelected': true
        });
      }
    }
    resObj = {
      'vendorServices': vendorService
    };
    //  console.log(resObj);
    this.vendorSandbox.addServiceCoverage(resObj);
    this.vendorSandbox.addServiceCoverageResp$.subscribe((data) => {
      console.log(data);
      localStorage.clear();
      localStorage.setItem('formchange', '');
      localStorage.setItem('coveragechange', '');
      localStorage.setItem('coverageareadata', '');
      localStorage.setItem('finalcoveragedata', '');
      // this.toastr.success('Service added successfully!', 'Success');
      // this.router.navigate(['services', this.vendorid]);
      this.coverageAreaForm = this.$fb.group({
        state: [, Validators.required],
        county: [],
        zipcode: [],
        attestation: []
      });
      this.coverageAreaForm.get('attestation').setValue(false);
      this.isCoverageAdd = false;
      this.finalZipcodesandcounty = [];
      this.missingData = [];
      this.coverageAreaData = [];
      this.isAnyFormFieldEdited = false;
      this.isEditCoverage = false;
      this.messageEvent.emit({ 'isSuccess': true, isaccordian: isaccordian });
    }, error => this.globalErrorHandler.handleError(error),
      () => {

      });
  }

  // ShowConfirmationDialog For Attestation
  showConfirmationDialog(index, attestationObject) {
    if (this.coverageAreaForm.get('attestation').value) {
      const dref = this.dialogService.showDialog(
        'By checking the box,I hereby attest that I am geographically competent to perform work in (state/county)', 'Okay', '400');
      dref.afterClosed().subscribe(result => {
        if (result) {
          const attestaionDialogref = this.dialogService.showAttestationDialog(null);
          attestaionDialogref.afterClosed().subscribe(resultFromAttestationDialog => {

            if (resultFromAttestationDialog) {
              this.coverageAreaData[index].attestation = this.attestationDetails;
              localStorage.setItem('formchange', '');
              this.isAnyFormFieldEdited = true;
              localStorage.setItem('formchange', JSON.stringify({ isfieldchanged: this.isAnyFormFieldEdited }));
              localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: this.coverageAreaData }));


            } else {
              this.coverageAreaForm.get('attestation').setValue(false);
            }
          });

        } else {
          this.coverageAreaForm.get('attestation').setValue(false);

        }
      });
    } else {
      this.attestationDetails = null;
      localStorage.setItem('formchange', '');
      this.isAnyFormFieldEdited = true;
      localStorage.setItem('formchange', JSON.stringify({ isfieldchanged: this.isAnyFormFieldEdited }));
      localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: this.coverageAreaData }));

      this.coverageAreaForm.get('attestation').setValue(false);
    }
  }

  isValidStateForAttestation(state: string) {
    let isValid = false;
    if (this.validStatesForAttestation.includes(state)) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid;
  }

  // Display attestation dialog in view mode
  viewAttestationDialog(attestationDetailsObject) {
    this.dialogService.showAttestationDialog(attestationDetailsObject);
  }
  getEditedCoverageCounties() {
    this.tempCoverageAreaData = this.coverageAreaData;
    let allCounties: any = [];
    for (let i = 0, len = this.coverageAreaData.length; i < len; i++) {
      this.vendorSandbox.getVendorCoverageCounties(this.coverageAreaData[i].state);
      this.vendorSandbox.getVendorCoverageCountiesList$.subscribe((data) => {
        allCounties = data.counties;
      }, error => this.globalErrorHandler.handleError(error),
        () => {
          if (allCounties) {
            this.tempCoverageAreaData[i].counties = allCounties;
            if (this.coverageAreaData[i].county) {
              this.getEditCoverageZips(i, this.coverageAreaData[i].county, this.coverageAreaData[i].zipcode);
            }
          }
         // console.log(this.tempCoverageAreaData);
        });        
    }    
  }  
  getEditCoverageZips(index, county, tempzip) {    
    for (let j = 0, len = this.tempCoverageAreaData[index].counties.length; j < len; j++) {
      if (county === this.tempCoverageAreaData[index].counties[j].countyName) {        
        this.tempCoverageAreaData[index].reszips = this.tempCoverageAreaData[index].counties[j].zipcode;
      }       

    }
    for (let k = 0, len = this.tempCoverageAreaData.length; k < len; k++) {
      if (tempzip != this.tempCoverageAreaData[k].zipcode) {
        let indx = this.tempCoverageAreaData[index].reszips.indexOf(this.tempCoverageAreaData[k].zipcode);        
        if (indx > -1) {
          this.tempCoverageAreaData[index].reszips.splice(indx, 1);
        }
      } 
    }
    
  }
  onChangeCounty(indx, zipval) {    
    console.log(this.coverageAreaData);
    this.coverageAreaData[indx].county = zipval;
    localStorage.setItem('formchange', '');
    this.isAnyFormFieldEdited = true;
    localStorage.setItem('formchange', JSON.stringify({ isfieldchanged: this.isAnyFormFieldEdited }));
    localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: this.coverageAreaData }));    
  }
  onChangeZipcode(zipval, indx) {
    this.coverageAreaData[indx].zipcode = zipval;
    localStorage.setItem('formchange', '');
    this.isAnyFormFieldEdited = true;
    localStorage.setItem('formchange', JSON.stringify({ isfieldchanged: this.isAnyFormFieldEdited }));
    localStorage.setItem('coverageareadata', JSON.stringify({ coveragedata: this.coverageAreaData }));
  }
  
}
