import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PrescriptionPatientComplain, PrescriptionPatientExamination } from 'src/app/models/prescription.model';

@Component({
  selector: 'app-pres-edit-examination-dialog',
  templateUrl: './pres-edit-examination-dialog.component.html',
  styleUrls: ['./pres-edit-examination-dialog.component.css']
})
export class PresEditExaminationDialogComponent implements OnInit {

  constructor() { }



  @ViewChild('examinationForm') examinationForm: NgForm;
  submitted: boolean = false;
  patient_examination: PrescriptionPatientExamination;
  @Output() examinationChanged: EventEmitter<{examination: PrescriptionPatientExamination, is_new: boolean}>
  = new EventEmitter<{examination: PrescriptionPatientExamination, is_new: boolean}>();
  isNew: boolean = false;



  ngOnInit(): void {
    this.patient_examination = new PrescriptionPatientExamination();
  }





  onFormSubmit(){
    this.submitted =true;
    if(this.examinationForm.valid){
      this.submitted = false;
      this.examinationChanged.emit({examination: this.patient_examination, is_new: this.isNew});
      var gg =  <HTMLButtonElement>document.getElementById('toggleExaminationModalBtn');
      gg.click();
    }

  }




  showModal(examination: PrescriptionPatientExamination, is_new: boolean){
    this.submitted = false;
    this.isNew = is_new;
    this.patient_examination = examination;
    var gg =  <HTMLButtonElement>document.getElementById('toggleExaminationModalBtn');
    if(this.isNew){
      this.examinationForm.resetForm();
    }
    gg.click();
  }

}
