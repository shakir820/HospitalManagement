import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { sortBy } from 'sort-by-typescript';
import { InvestigationDoc, InvestigationStatus } from 'src/app/models/investigation-doc.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-investigation-list',
  templateUrl: './my-investigation-list.component.html',
  styleUrls: ['./my-investigation-list.component.css']
})
export class MyInvestigationListComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
  }



  @ViewChild('f') searhForm: NgForm;
  search_string: string;
  selectedInvestigationName: string = 'All';
  all_Investigation_Name_List: string[];
  all_Investigation_List: InvestigationDoc[] = [];
  filtered_investigation_List: InvestigationDoc[] = [];
  fetchingInvestigations: boolean = false;
  showEmptyIcon: boolean = false;
  _baseUrl: string;
  sortOrderBy: string = 'Id';
  sortByAsscending: boolean = true;

  ngOnInit(): void {
    this.getAllInvestigations();
    this.getAllInvestigationNames();
  }


  searchOnInput(event_data) {
    if (this.search_string.length == 0) {
      this.filtered_investigation_List = this.all_Investigation_List.slice();
      this.selectedInvestigationName = 'All';
      this.sortInvestigationListDefault();
    }
  }

  onSearchSubmit() {
    if (this.search_string.length > 0) {
      var sk = this.search_string.toUpperCase();
      this.filtered_investigation_List = this.all_Investigation_List.filter(a => a.abbreviation.toUpperCase().includes(sk) ||
        a.doctor.name.toUpperCase().includes(sk) ||
        a.investigator.name.toUpperCase().includes(sk));
      this.sortInvestigationListDefault();
    }
  }


  selectInvestigationChanged(event_data) {
    if (this.selectedInvestigationName == 'All') {
      this.filtered_investigation_List = this.all_Investigation_List.slice();
      this.sortInvestigationListDefault();
      return;
    }
    this.filtered_investigation_List = this.all_Investigation_List.filter(a => a.abbreviation == this.selectedInvestigationName);
    this.sortInvestigationListDefault();
  }


  getAllInvestigations() {
    this.fetchingInvestigations = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      investigations: InvestigationDoc[],
      error_msg: string
    }>(this._baseUrl + 'api/Investigation/GetAllInvestigationsByPatient', { params: { patient_id: this.userService.user.id.toString() } }).subscribe(result => {
      console.log(result);
      this.fetchingInvestigations = false;
      if (result.success) {
        this.all_Investigation_List = result.investigations;
        this.filtered_investigation_List = this.all_Investigation_List.slice();
        this.sortInvestigationListDefault();
      }
    });
  }


  getAllInvestigationNames() {
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












  sortInvestigationList(event_data, order_name: string) {
    if (this.sortOrderBy == order_name) {
      this.sortByAsscending = !this.sortByAsscending;
    }

    switch (this.sortOrderBy) {
      case 'Id':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('id'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-id'));
        }
        break;

      case 'Name':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('abbreviation'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-abbreviation'));
        }
        break;


      case 'Doctor':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('doctor.name'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-doctor.name'));
        }
        break;


      case 'Investigator':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('investigator.name'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-investigator.name'));
        }
        break;


      case 'Date':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('result_publish_date'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-result_publish_date'));
        }
        break;
    }


    this.sortOrderBy = order_name;
  }






  sortInvestigationListDefault() {
    switch (this.sortOrderBy) {
      case 'Id':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('id'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-id'));
        }
        break;

      case 'Name':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('name'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-name'));
        }
        break;


      case 'Doctor':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('doctor.name'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-doctor.name'));
        }
        break;


      case 'Investigator':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('investigator.name'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-investigator.name'));
        }
        break;


      case 'Date':
        if (this.sortByAsscending) {
          this.filtered_investigation_List.sort(sortBy('result_publish_date'));
        }
        else {
          this.filtered_investigation_List.sort(sortBy('-result_publish_date'));
        }
        break;
    }
  }





  onDeleteInvestigationClicked(event_data, investigation_id: number) {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.httpClient.post<{
          success: boolean,
          error: boolean,
          error_msg: string
        }>(this._baseUrl + 'api/Investigation/DeleteInvestigaitonDocument', { id: investigation_id },).subscribe(result => {
          console.log(result);
          if (result.success) {
            Swal.fire(
              'Deleted!',
              'Your investigation file has been deleted.',
              'success'
            );

            var inv_index = this.all_Investigation_List.findIndex(a => a.id == investigation_id);
            this.all_Investigation_List.splice(inv_index, 1);

            inv_index = this.filtered_investigation_List.findIndex(a => a.id == investigation_id);
            this.filtered_investigation_List.splice(inv_index, 1);

            if (this.filtered_investigation_List.length == 0) {
              this.showEmptyIcon = true;
            }
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: result.error_msg
            });
          }
        });
      }
    });
  }






}
