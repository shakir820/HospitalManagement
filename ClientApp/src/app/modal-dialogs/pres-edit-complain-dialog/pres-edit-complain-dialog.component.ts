import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PrescriptionPatientComplain } from 'src/app/models/prescription.model';

@Component({
  selector: 'app-pres-edit-complain-dialog',
  templateUrl: './pres-edit-complain-dialog.component.html',
  styleUrls: ['./pres-edit-complain-dialog.component.css']
})
export class PresEditComplainDialogComponent implements OnInit {

  constructor() { }


  @ViewChild('complainForm') complainForm: NgForm;
  // @ViewChild('complainModal') complainModal: any;
  submitted: boolean = false;
  patient_complain: PrescriptionPatientComplain;
  @Output() complainChanged: EventEmitter<{complain: PrescriptionPatientComplain, is_new: boolean}>
  = new EventEmitter<{complain: PrescriptionPatientComplain, is_new: boolean}>();
  isNew: boolean = false;




  ngOnInit(): void {
    this.patient_complain = new PrescriptionPatientComplain();
  }






  onFormSubmit(){
    this.submitted =true;
    if(this.complainForm.valid){
      this.submitted = false;
      this.complainChanged.emit({complain: this.patient_complain, is_new: this.isNew});
      var gg =  <HTMLButtonElement>document.getElementById('toggleComplainModalBtn');
    gg.click();
    }
    console.log(this.complainForm);
  }




  showModal(complain: PrescriptionPatientComplain, is_new: boolean){
    this.submitted = false;
    this.isNew = is_new;
    this.patient_complain = complain;
    var gg =  <HTMLButtonElement>document.getElementById('toggleComplainModalBtn');
    if(is_new){
      this.complainForm.resetForm();
    }

    gg.click();
  }


}
