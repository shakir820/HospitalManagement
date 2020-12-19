import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { InvestigationDoc } from 'src/app/models/investigation-doc.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-requested-investigation-list',
  templateUrl: './requested-investigation-list.component.html',
  styleUrls: ['./requested-investigation-list.component.css']
})
export class RequestedInvestigationListComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private router: Router) {
    this._baseUrl = baseUrl;
  }



  @ViewChild('f') searhForm: NgForm;
  search_string: string;
  selectedInvestigationName: string = 'All';
  all_Investigation_Name_List: string[];
  all_Investigation_List: InvestigationDoc[];
  filtered_investigation_List: InvestigationDoc[];
  fetchingInvestigations: boolean = false;
  _baseUrl: string;
  sortOrderBy: string = 'Id';
  sortByAsscending:boolean = true;

  ngOnInit(): void {
    this.getAllInvestigations();
    this.getAllInvestigationNames();
  }


  searchOnInput(event_data){
    if(this.search_string.length == 0){
      this.filtered_investigation_List = this.all_Investigation_List.slice();
      this.selectedInvestigationName = 'All';
      this.sortInvestigationListDefault();
    }
  }

  onSearchSubmit(){
    if(this.search_string.length > 0){
      var sk = this.search_string.toUpperCase();
      this.filtered_investigation_List =  this.all_Investigation_List.filter(a => a.abbreviation.toUpperCase().includes(sk) ||
      a.doctor.name.toUpperCase().includes(sk) ||
      a.patient.name.toUpperCase().includes(sk));
      this.sortInvestigationListDefault();
    }
  }


  selectInvestigationChanged(event_data){
    if(this.selectedInvestigationName == 'All'){
      this.filtered_investigation_List = this.all_Investigation_List.slice();
      this.sortInvestigationListDefault();
      return;
    }
    this.filtered_investigation_List = this.all_Investigation_List.filter(a => a.abbreviation == this.selectedInvestigationName);
    this.sortInvestigationListDefault();
  }


  getAllInvestigations(){
    this.fetchingInvestigations = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      investigation_list: InvestigationDoc[],
      error_msg: string
    }>(this._baseUrl + 'api/Investigation/GetAllRequestedInvestigation').subscribe(result => {
      console.log(result);
      this.fetchingInvestigations = false;
      if (result.success) {
         this.all_Investigation_List = result.investigation_list;
         this.filtered_investigation_List = result.investigation_list.slice();
         this.sortInvestigationListDefault();
      }
    });
  }


  getAllInvestigationNames(){
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      investigation_abbreviation_list: string[],
      error_msg: string
    }>(this._baseUrl + 'api/Investigation/GetAllInvestigationAbbreviations').subscribe(result => {
      console.log(result);
      if (result.success) {
         this.all_Investigation_Name_List = [];
         this.all_Investigation_Name_List.push('All');
          this.all_Investigation_Name_List.push(...result.investigation_abbreviation_list);
      }
    });
  }












  sortInvestigationList(event_data, order_name:string){
    if(this.sortOrderBy == order_name){
      this.sortByAsscending = !this.sortByAsscending;
   }

   switch(this.sortOrderBy){
    case 'Id':
      if(this.sortByAsscending){
        this.filtered_investigation_List.sort(sortBy('id'));
      }
      else{
        this.filtered_investigation_List.sort(sortBy('-id'));
      }
    break;

    case 'Name':
    if(this.sortByAsscending){
      this.filtered_investigation_List.sort(sortBy('abbreviation'));
    }
    else{
      this.filtered_investigation_List.sort(sortBy('-abbreviation'));
    }
    break;


    case 'Doctor':
    if(this.sortByAsscending){
      this.filtered_investigation_List.sort(sortBy('doctor.name'));
    }
    else{
      this.filtered_investigation_List.sort(sortBy('-doctor.name'));
    }
    break;


    case 'Patient':
    if(this.sortByAsscending){
      this.filtered_investigation_List.sort(sortBy('patient.name'));
    }
    else{
      this.filtered_investigation_List.sort(sortBy('-patient.name'));
    }
    break;


    case 'Date':
      if(this.sortByAsscending){
        this.filtered_investigation_List.sort(sortBy('created_date'));
      }
      else{
        this.filtered_investigation_List.sort(sortBy('-created_date'));
      }
      break;
  }


    this.sortOrderBy = order_name;
  }






  sortInvestigationListDefault(){
    switch(this.sortOrderBy){
      case 'Id':
        if(this.sortByAsscending){
          this.filtered_investigation_List.sort(sortBy('id'));
        }
        else{
          this.filtered_investigation_List.sort(sortBy('-id'));
        }
      break;

      case 'Name':
      if(this.sortByAsscending){
        this.filtered_investigation_List.sort(sortBy('name'));
      }
      else{
        this.filtered_investigation_List.sort(sortBy('-name'));
      }
      break;


      case 'Doctor':
      if(this.sortByAsscending){
        this.filtered_investigation_List.sort(sortBy('doctor.name'));
      }
      else{
        this.filtered_investigation_List.sort(sortBy('-doctor.name'));
      }
      break;


      case 'Patient':
      if(this.sortByAsscending){
        this.filtered_investigation_List.sort(sortBy('patient.name'));
      }
      else{
        this.filtered_investigation_List.sort(sortBy('-patient.name'));
      }
      break;


      case 'Date':
        if(this.sortByAsscending){
          this.filtered_investigation_List.sort(sortBy('created_date'));
        }
        else{
          this.filtered_investigation_List.sort(sortBy('-created_date'));
        }
        break;
    }
  }




  onInvestigationViewClicked(event_data, investigation_id: number){
    this.router.navigate(['Investigation/InvestigationDetails'], {queryParams: {investigation_id: investigation_id}});
  }


  onInvestigationAssignedToMeClicked(event_data, investigation_id: number){

  }

}
