import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '../../../../../node_modules/@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'app-attestation-details',
  templateUrl: './attestation-details.component.html',
  styleUrls: ['./attestation-details.component.scss']
})
export class AttestationDetailsComponent implements OnInit {

  // Variables
  public attestationObject: any;
public appraisalMethodologies: FormGroup;
public appraisalProperties: FormGroup;
public attestationForm: FormGroup;
public methodologies = [];
public properties = [];


// Flags for display
isOtherMethodologySelected = false;
isOtherPropertySelected = false;
isDisableConfirm = true;
  viewProperties: any[];
  viewMethodologies: any[];
  isAddAttestationDetails: boolean;
  isViewAttestationDetails: boolean;
  viewOtherMethodology: any;
  viewOtherProperty: any;

// Initialize services
constructor(public $fb: FormBuilder,
  public broadService: BroadcastService,
  public dialogRef: MatDialogRef<AttestationDetailsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
this.attestationObject = data.msg;
}
// On Page Load
  ngOnInit() {

// console.log('on init dialog', this.attestationObject);
if (!this.attestationObject) {
    this.isAddAttestationDetails = true;
  this.isViewAttestationDetails = false;

  this.methodologies = ['Sales Comparison', 'Cost Approach', 'Income Capitalization', 'Other'];
  this.properties = ['Residential', 'Commercial', 'Land', 'Condo', 'Multi-family', 'Other'];


    // Initialize Methodology Checkbox list
    const defaultMethodologies = [];
    this.appraisalMethodologies = this.$fb.group({
      methodologies: this.$fb.array(this.methodologies.map(x => defaultMethodologies.indexOf(x) > -1)),
      otherMethodology: ['', Validators.required]
    });

    // Initialize property checkbox list
    const defaultProperties = [];
    this.appraisalProperties = this.$fb.group({
      properties: this.$fb.array(this.properties.map(x => defaultProperties.indexOf(x) > -1)),
      otherProperty: ['', Validators.required]
    });

  } else {   

this.isViewAttestationDetails = true;
this.isAddAttestationDetails = false;
    const defaultMethodologiesView = [];
    const selectedMethodologiesViewArray = [];

    // for (let i = 0; i < this.attestationObject.methodologies.length; i++) {
    //   if (this.attestationObject.methodologies[i].isOther === true) {
    //    // this.appraisalMethodologies.get('otherMethodology').setValue(this.attestationObject.methodologies[i].methodology);
    //   this.isOtherMethodologySelected = true;
    //    this.viewOtherMethodology = this.attestationObject.methodologies[i].methodology;
    //   } else {
    //       selectedMethodologiesViewArray.push(this.attestationObject.methodologies[i].methodology);
    //   }
    //  }
 for (let i = 0; i < this.attestationObject.methodologies.length; i++) {
  selectedMethodologiesViewArray.push(this.attestationObject.methodologies[i]);
  }
     this.methodologies = selectedMethodologiesViewArray;

     const defaultPropertiesView = [];
     const selectedPropertiesViewArray = [];

    //  for (let i = 0; i < this.attestationObject.properties.length; i++) {
    //    if (this.attestationObject.properties[i].isOther === true) {
    //    // this.appraisalProperties.get('otherProperty').setValue(this.attestationObject.properties[i].property);
    //    this.isOtherPropertySelected = true;
    //    this.viewOtherProperty = this.attestationObject.properties[i].property;
    //    } else {
    //    selectedPropertiesViewArray.push(this.attestationObject.properties[i].property);
    //    }
    //   }

    for (let i = 0; i < this.attestationObject.properties.length; i++) {
      selectedPropertiesViewArray.push(this.attestationObject.properties[i]);
    }
       //  this.appraisalMethodologies = this.$fb.group({
    //   methodologies: this.$fb.array(this.methodologies.map(x => defaultMethodologiesView.indexOf(x) > -1))
    // });

      //  this.properties = selectedPropertiesViewArray;
      // this.appraisalProperties = this.$fb.group({
      //   properties: this.$fb.array(this.properties.map(x => defaultPropertiesView.indexOf(x) > -1))

      // });

    //   this.groupForm.controls['groupChapters'].setValue(
    //     this.groupForm.controls['groupChapters'].value
    //         .map(value => true);
    // );
      // this.appraisalMethodologies.disable();
      // this.appraisalProperties.disable();

      this.viewProperties = selectedPropertiesViewArray;
      this.viewMethodologies = selectedMethodologiesViewArray;

console.log('api selected property', selectedPropertiesViewArray);
console.log('api selected methodology', selectedMethodologiesViewArray);






  //   "attestation": {
  //     "properties": [
  //       {
  //         "property": "string",
  //         "isOther": true
  //       }
  //     ],
  //     "methodologies": [
  //       {
  //         "methodology": "string",
  //         "isOther": true
  //       }
  //     ]
  //   }


  }

  }



// Display or hide other textbox- methodology
  checkOtherMethodologySelected() {
    const selectedMethodologies = this.convertToValue('methodologies', this.appraisalMethodologies);

      if (selectedMethodologies.length > 0) {
        for (let i = 0; i < selectedMethodologies.length; i++) {
          if (selectedMethodologies[i] === 'Other') {
      this.isOtherMethodologySelected = true;
      this.isDisableConfirm = true;
      break;
          } else {
            this.isOtherMethodologySelected = false;
          }

        }
      } else {
        this.isOtherMethodologySelected = false;
        this.isDisableConfirm = true;
        this.appraisalMethodologies.get('otherMethodology').setValue('');
      }

if (!this.isOtherMethodologySelected) {
  this.appraisalMethodologies.get('otherMethodology').setValue('');
}
this.enableConfirmButton();

  }


// Display Hide text box -property
  checkOtherPropertySelected() {

    const selectedProperties = this.convertToValue('properties', this.appraisalProperties);

      if (selectedProperties.length > 0) {
        for (let i = 0; i < selectedProperties.length; i++) {
          if (selectedProperties[i] === 'Other') {
      this.isOtherPropertySelected = true;

      this.isDisableConfirm = true;
      break;
          } else {
            this.isOtherPropertySelected = false;

          }

        }
      } else {
        this.isOtherPropertySelected = false;
        this.isDisableConfirm = true;
        this.appraisalProperties.get('otherProperty').setValue('');
      }

      if (!this.isOtherPropertySelected) {
        this.appraisalProperties.get('otherProperty').setValue('');
      }

this.enableConfirmButton();

  }



// Toggle confirm button based on both sections of checkboxes
  enableConfirmButton() {
    const selectedMethodologies = this.convertToValue('methodologies', this.appraisalMethodologies);

    const selectedProperties = this.convertToValue('properties', this.appraisalProperties);


    if (selectedMethodologies.length <= 0 && selectedProperties.length <= 0 ) {

      this.isDisableConfirm = true;

         } else if (selectedMethodologies.length > 0 && selectedProperties.length > 0 ) {
          if (!this.isOtherMethodologySelected && !this.isOtherPropertySelected) {
          this.isDisableConfirm = false;
          this.isOtherMethodologySelected = false;
          this.isOtherPropertySelected = false;
         } else {
           if (this.isOtherMethodologySelected) {
           if (this.appraisalMethodologies.get('otherMethodology').value === '') {
           this.isDisableConfirm = true;
         } else {
          this.isDisableConfirm = false;
         }
        }
        if (this.isOtherPropertySelected) {
          if (this.appraisalProperties.get('otherProperty').value === '') {
            this.isDisableConfirm = true;
        } else {
         this.isDisableConfirm = false;
        }
       }

       if (this.isOtherMethodologySelected && this.isOtherPropertySelected) {
        if (this.appraisalProperties.get('otherProperty').value === '' ||
        this.appraisalMethodologies.get('otherMethodology').value === '' ) {
       this.isDisableConfirm = true;
        }
         }
        }
  }
}


// Convert checkbox values
  convertToValue(key: string, formGroupName: FormGroup) {
    return formGroupName.value[key].map((x, i) => x && this[key][i]).filter(x => !!x);
  }

  // Broadcast the attestation details
  saveAttestationDetails() {
    const methodologyArray = [];
    const propertyArray = [];
    const selectedMethodologies = this.convertToValue('methodologies', this.appraisalMethodologies);
    const selectedProperties = this.convertToValue('properties', this.appraisalProperties);
   // const attestationObj = {selectedMethodologies, selectedProperties};


   for (let i = 0; i < selectedMethodologies.length; i++) {
    if (selectedMethodologies[i] === 'Other') {
      methodologyArray.push({'methodology': this.appraisalMethodologies.get('otherMethodology').value, 'isOther': true});
       } else {
        methodologyArray.push({'methodology': selectedMethodologies[i], 'isOther': false});
       }


   }

   for (let i = 0; i < selectedProperties.length; i++) {
     if (selectedProperties[i] === 'Other') {
      propertyArray.push({'property': this.appraisalProperties.get('otherProperty').value, 'isOther': true});
     } else {
      propertyArray.push({'property': selectedProperties[i], 'isOther': false});
     }

   }


 const attestationObj =   {'properties': propertyArray,
    'methodologies': methodologyArray };






    this.broadService.broadcast('attestationDetails', attestationObj);
    this.dialogRef.close(true);
  }

  // Close Dialog of attestation details
 cancelAttestationDetails() {
    this.dialogRef.close(false);
  }


}
