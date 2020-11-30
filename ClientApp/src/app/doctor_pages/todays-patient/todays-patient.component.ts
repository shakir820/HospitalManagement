import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { Helper } from 'src/app/helper-methods/helper.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-todays-patient',
  templateUrl: './todays-patient.component.html',
  styleUrls: ['./todays-patient.component.css']
})
export class TodaysPatientComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    private router: Router,
    @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;

  }


  _baseUrl: string;
  error_msg: string;
  fetchingPatients: boolean = false;
  search_string: string;
  allPatients: User[];
  filteredPatients: User[];
  sortByAscending: boolean = true;
  @ViewChild('f') searchForm: NgForm;
  sortBy: string = 'Serial No';


  ngOnInit(): void {
    this.getPatients();
  }




  onSearchSubmit() {
    var sk = this.search_string.toUpperCase();
    this.filteredPatients = this.allPatients.filter(a => a.name.toUpperCase().includes(sk));

    // if(this.search_string != undefined && this.search_string != '' && this.search_string != null){
    //   this.getPatients(this.search_string);
    // }
  }




  sortOrderChanged(event_data, sort_order){
    this.sortBy = sort_order;
    this.sortDoctorList();
  }

  toggleDoctorListSort(event_data) {
    this.sortByAscending = !this.sortByAscending;
    this.sortDoctorList();
  }



  sortDoctorList(){
    if(this.sortBy == 'Name'){
      if (this.sortByAscending) {
        this.filteredPatients.sort(sortBy('name'));
      }
      else {
        this.filteredPatients.sort(sortBy('-name'));
      }
    }
    else{
      if (this.sortByAscending) {
        this.filteredPatients.sort(sortBy('appointment.serial_no'));
      }
      else {
        this.filteredPatients.sort(sortBy('-appointment.serial_no'));
      }
    }
  }


  getPatients() {
    this.error_msg = undefined;
    this.fetchingPatients = true;

    this.httpClient.get<{
      success: boolean,
      error: boolean,
      patients: User[],
      error_msg: string
    }>(this._baseUrl + 'api/Doctor/GetTodayPatients', { params: { doctor_id: this.userService.user.id.toString() } }).subscribe(result => {
      console.log(result);
      this.fetchingPatients = false;
      if (result.success) {
        this.allPatients = [];
        this.filteredPatients = [];
        Helper.resolveUserListResult(result.patients, this.allPatients);
        this.filteredPatients = this.allPatients;
        if (this.sortByAscending) {
          this.filteredPatients.sort(sortBy('appointment.serial_no'));
        }
        else {
          this.filteredPatients.sort(sortBy('-appointment.serial_no'));
        }
      }
      else {
        this.error_msg = result.error_msg;
      }
    });
  }



  onPatientDetailsBtnClicked(event_data, id: number) {
    this.router.navigate(['Patients/PatientDetails',], { queryParams: { patient_id: id } });
  }
}
