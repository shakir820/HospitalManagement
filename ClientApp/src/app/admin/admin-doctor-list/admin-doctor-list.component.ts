import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { sortBy } from 'sort-by-typescript';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-doctor-list',
  templateUrl: './admin-doctor-list.component.html',
  styleUrls: ['./admin-doctor-list.component.css']
})
export class AdminDoctorListComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private router: Router) {
    this._baseUrl = baseUrl;
  }
  ngOnInit(): void {

    this.getDoctorList();
  }


  @ViewChild('f') searchForm: NgForm;

  _baseUrl: string;
  search_string: string;
  fetchingDoctorList: boolean = false;
  sortByAscending: boolean = true;
  sortOrderBy: string = 'Id';
  allDoctorList: User[] = [];
  doctorList: User[] = [];
  filerBy: string = 'All';



  doctorSearchOnInput(event_data){
    if(this.search_string.length == 0){

      this.sortDoctorListDefault();
    }
  }



  sortDoctorListDefault(){
    var temp_doctor_list = [];

    switch(this.filerBy){
      case 'All':
        temp_doctor_list = this.allDoctorList.slice();
        break;

      case 'Active':
        temp_doctor_list = this.allDoctorList.filter(a => a.isActive == true);
        break;

      case 'Inactive':
        temp_doctor_list = this.allDoctorList.filter( a => a.isActive == false);
        break;

      case 'Pending':
        temp_doctor_list = this.allDoctorList.filter( a => a.approved == false);
        break;
    }

    switch(this.sortOrderBy){
      case 'Id':
        if(this.sortByAscending){
          temp_doctor_list.sort(sortBy('id'));
        }
        else{
          temp_doctor_list.sort(sortBy('-id'));
        }
        break;

      case 'Name':
        if(this.sortByAscending){
          temp_doctor_list.sort(sortBy('name'));
        }
        else{
          temp_doctor_list.sort(sortBy('-name'))
        }
        break;

      case 'Date':
        if(this.sortByAscending){
          temp_doctor_list.sort(sortBy('created_date'));
        }
        else{
          temp_doctor_list.sort(sortBy('-created_date'));
        }
        break;
    }

    this.doctorList = temp_doctor_list;
  }


  sortDoctorList(event_data, order_name: string){

    if(order_name == this.sortOrderBy){
      this.sortByAscending = !this.sortByAscending;
    }

    switch(order_name){
      case 'Id':
        if(this.sortByAscending){
          this.doctorList.sort(sortBy('id'));
        }
        else{
          this.doctorList.sort(sortBy('-id'));
        }
        break;

      case 'Name':
        if(this.sortByAscending){
          this.doctorList.sort(sortBy('name'));
        }
        else{
          this.doctorList.sort(sortBy('-name'))
        }
        break;

      case 'Date':
        if(this.sortByAscending){
          this.doctorList.sort(sortBy('created_date'));
        }
        else{
          this.doctorList.sort(sortBy('-created_date'));
        }
        break;
    }

    this.sortOrderBy = order_name;
  }



  onSearchSubmit() {
   if(this.search_string.length == 0){
     return;
   }

   this.filerBy = 'All';
   var sk = this.search_string.toUpperCase();
   this.doctorList = this.allDoctorList.filter(a => a.name.toUpperCase().includes(sk) || a.id.toString() == sk );

   switch(this.sortOrderBy){
    case 'Id':
      if(this.sortByAscending){
        this.doctorList.sort(sortBy('id'));
      }
      else{
        this.doctorList.sort(sortBy('-id'));
      }
      break;

    case 'Name':
      if(this.sortByAscending){
        this.doctorList.sort(sortBy('name'));
      }
      else{
        this.doctorList.sort(sortBy('-name'))
      }
      break;

    case 'Date':
      if(this.sortByAscending){
        this.doctorList.sort(sortBy('created_date'));
      }
      else{
        this.doctorList.sort(sortBy('-created_date'));
      }
      break;
    }

  }



  getDoctorList() {
    this.fetchingDoctorList = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      doctor_list: User[],
      error_msg: string
    }>(this._baseUrl + 'api/admin/GetAllDoctorList').subscribe(result => {
      console.log(result);
      this.fetchingDoctorList = false;
      if (result.success) {
        this.filerBy = 'All';
        this.allDoctorList = result.doctor_list;
        this.sortDoctorListDefault();
      }
    });

  }




  showAllDoctorList(event_data) {
    this.filerBy = 'All';
    this.search_string = '';
    this.sortDoctorListDefault();
  }


  showPendingDoctorList(event_data) {
    this.filerBy = 'Pending';
    this.search_string = '';
    this.sortDoctorListDefault();
  }


  showActiveDoctorList(event_data) {
    this.filerBy = 'Active';
    this.search_string = '';
    this.sortDoctorListDefault();
  }



  showInactiveDoctorList(event_data) {
    this.filerBy = 'Inactive';
    this.search_string = '';
    this.sortDoctorListDefault();
  }








  // action methods
  approveDoctor(event_data, id: number) {
    var doctor = this.doctorList.find(a => a.id == id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/ApproveDoctor', { params: { id: doctor.id.toString() } }).subscribe(result => {
        if (result.success) {
          doctor.approved = true;
        }
      });
  }


  unApproveDoctor(event_data, id: number) {
    var doctor = this.doctorList.find(a => a.id == id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/UnapproveDoctor', { params: { id: doctor.id.toString() } }).subscribe(result => {
        if (result.success) {
          doctor.approved = false;
        }
      });
  }


  activeDoctor(event_data, id: number) {
    var doctor = this.doctorList.find(a => a.id == id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/ActivateUser', { params: { id: doctor.id.toString() } }).subscribe(result => {
        if (result.success) {
          doctor.isActive = true;
        }
      });
  }

  inActiveDoctor(event_data, id: number) {
    var doctor = this.doctorList.find(a => a.id == id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/DeactivateUser', { params: { id: doctor.id.toString() } }).subscribe(result => {
        if (result.success) {
          doctor.isActive = false;
        }
      });
  }





  viewDoctorDetails(event_data, doctor_id: number) {
    console.log('doctor id before navigate: ' + doctor_id);
    this.router.navigate(['admin/UserDetails'], { queryParams: { user_id: doctor_id } });
  }

}
