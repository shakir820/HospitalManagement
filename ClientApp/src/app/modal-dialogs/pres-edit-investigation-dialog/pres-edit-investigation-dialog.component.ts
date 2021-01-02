import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { InvestigationTag } from 'src/app/models/investigation-tag.model';
import { PrescriptionPatientExamination } from 'src/app/models/prescription.model';



@Component({
  selector: 'app-pres-edit-investigation-dialog',
  templateUrl: './pres-edit-investigation-dialog.component.html',
  styleUrls: ['./pres-edit-investigation-dialog.component.css']
})
export class PresEditInvestigationDialogComponent implements OnInit {

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,) {
    this._baseUrl = baseUrl;
  }



  _baseUrl: string;
  investigationName: string;
  @ViewChild('investigaitonForm') investigaitonForm: NgForm;
  submitted: boolean = false;
  fetchingInvestigaitonList: boolean = false;
  investigation_tag_list: InvestigationTag[];
  selectedInvestigation: InvestigationTag;
  @ViewChild('investigationsDropDown') investigationDropDown: NgbDropdown;
  @Output() investigationItemChanged: EventEmitter<{ investigation: InvestigationTag }>
    = new EventEmitter<{ investigation: InvestigationTag }>();

  ngOnInit(): void {

  }





  onFormSubmit() {
    this.submitted = true;
    if (this.investigaitonForm.valid) {
      this.submitted = false;
      this.investigationItemChanged.emit({ investigation: this.selectedInvestigation });
      var gg = <HTMLButtonElement>document.getElementById('toggleInvestigationModalBtn');
      gg.click();
    }

  }




  showModal() {
    this.submitted = false;
    this.investigaitonForm.reset();
    var gg = <HTMLButtonElement>document.getElementById('toggleInvestigationModalBtn');
    gg.click();
  }






  onInvestigationInput(event_data) {
    if (this.investigationName != undefined || this.investigationName != '') {
      var regExp = /[a-zA-Z]/;
      if (regExp.test(this.investigationName)) {
        if (this.investigationDropDown.isOpen() == false) {
          this.investigationDropDown.open();
        }
        this.getInvestigations(this.investigationName);

      } else {

      }
    }
  }


  onInvestigationTagItemClicked(event_data, investigation_tag_id) {
    var investigation_item = this.investigation_tag_list.find(a => a.id == investigation_tag_id);
    this.investigationName = investigation_item.abbreviation;
    this.selectedInvestigation = investigation_item;
  }





  getInvestigations(search_key) {

    this.fetchingInvestigaitonList = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      investigations: InvestigationTag[],
      error_msg: string
    }>(this._baseUrl + 'api/Investigation/GetInvestigations', { params: { search_key: search_key } }).subscribe(result => {
      console.log(result);
      this.fetchingInvestigaitonList = false;
      if (result.success) {
        this.investigation_tag_list = [];
        if (result.investigations != undefined) {
          result.investigations.forEach(val => {
            var inv = new InvestigationTag();
            inv.abbreviation = val.abbreviation;
            inv.id = val.id;
            inv.name = val.name;
            this.investigation_tag_list.push(inv);
          });
        }

      }
      else {
        this.investigation_tag_list = [];
      }
    },
      error => {
        this.fetchingInvestigaitonList = false;
      });
  }


}
