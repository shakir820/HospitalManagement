import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InvestigationTag } from 'src/app/models/investigation-tag.model';
import { PrescriptionPatientExamination } from 'src/app/models/prescription.model';



@Component({
  selector: 'app-pres-edit-investigation-dialog',
  templateUrl: './pres-edit-investigation-dialog.component.html',
  styleUrls: ['./pres-edit-investigation-dialog.component.css']
})
export class PresEditInvestigationDialogComponent implements OnInit {

  constructor( private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,) {
    this._baseUrl = baseUrl;
   }



  _baseUrl: string;
  investigationName: string;
  @ViewChild('examinationForm') examinationForm: NgForm;
  submitted: boolean = false;
  patient_examination: PrescriptionPatientExamination;
  @Output() examinationChanged: EventEmitter<{examination: PrescriptionPatientExamination, is_new: boolean}>
  = new EventEmitter<{examination: PrescriptionPatientExamination, is_new: boolean}>();
  isNew: boolean = false;
  fetchingInvestigaitonList: boolean = false;
  investigation_tag_list: InvestigationTag[];
  showDropDown:boolean = false;


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






  onInvestigationInput(event_data){
    if(this.investigationName != undefined || this.investigationName != ''){
      var regExp = /[a-zA-Z]/;
      if(regExp.test(this.investigationName)){
        if(this.showDropDown == false){
          this.showDropDown = true;
        }
        this.getInvestigations(this.investigationName);

      } else {

      }
    }
  }


  onInvestigationTagItemClicked(event_data, investigation_tag_id){
    //$('dfas').dropdown('hide')
    this.showDropDown = false;
  }





  getInvestigations(search_key){

    this.fetchingInvestigaitonList = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      investigations: InvestigationTag[],
      error_msg: string
    }>(this._baseUrl + 'api/Investigation/GetInvestigations', {params: {search_key: search_key}}).subscribe(result => {
      console.log(result);
      this.fetchingInvestigaitonList = false;
      if (result.success) {
        this.investigation_tag_list = [];
        if(result.investigations != undefined){
          result.investigations.forEach(val => {
            var inv = new InvestigationTag();
            inv.abbreviation = val.abbreviation;
            inv.id = val.id;
            inv.name = val.name;
            this.investigation_tag_list.push(inv);
          });
        }

      }
      else{
        this.investigation_tag_list = [];
      }
    },
    error => {
      this.fetchingInvestigaitonList = false;
    });
  }


}
