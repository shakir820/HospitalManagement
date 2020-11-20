import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { Helper } from 'src/app/helper-methods/helper.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    private router: Router,
    @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;

  }



  _baseUrl: string;
  error_msg: string;
  fetchingPatients:boolean = false;
  search_string: string;
  allPatients:User[];
  filteredPatients:User[];
  sortByAscending:boolean = true;



  ngOnInit(): void {
  }

  @ViewChild('f') searchForm: NgForm;

  onSearchSubmit(){
    if(this.search_string != undefined && this.search_string != '' && this.search_string != null){
      this.getPatients(this.search_string);
    }
  }

  toggleDoctorListSort(event_data){
    this.sortByAscending = !this.sortByAscending;
    if(this.sortByAscending){
      this.filteredPatients.sort(sortBy('name'));
    }
    else{
      this.filteredPatients.sort(sortBy('-name'));
    }
  }



  getPatients(search_str: string){
    this.error_msg = undefined;
    this.fetchingPatients = true;

    this.httpClient.get<{
      success: boolean,
      error: boolean,
      patient_list: User[],
      error_msg: string
    }>(this._baseUrl + 'api/Doctor/GetAllPatients', {params: {search_key: search_str}}).subscribe(result => {
      console.log(result);
      this.fetchingPatients = false;
      if (result.success) {
        this.allPatients = [];
        this.filteredPatients = [];
        Helper.resolveUserListResult(result.patient_list, this.allPatients);
        this.filteredPatients = this.allPatients;
        if(this.sortByAscending){
          this.filteredPatients.sort(sortBy('name'));
        }
        else{
          this.filteredPatients.sort(sortBy('-name'));
        }
      }
      else{
        this.error_msg = result.error_msg;
      }
    });
  }



  onPatientDetailsBtnClicked(event_data, id:number){
    this.router.navigate(['Patients/PatientDetails',], {queryParams: {patient_id: id}});
  }
}
