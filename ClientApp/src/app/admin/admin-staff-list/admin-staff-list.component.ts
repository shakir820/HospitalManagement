import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-staff-list',
  templateUrl: './admin-staff-list.component.html',
  styleUrls: ['./admin-staff-list.component.css']
})
export class AdminStaffListComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private router: Router) {
    this._baseUrl = baseUrl;
  }


  @ViewChild('f') searchForm: NgForm;

  _baseUrl: string;
  fetchingStaffList: boolean = false;
  sortBy:string = 'ascending';
  all_staff_list:User[] = [];
  filtered_staff_list: User[] = [];
  filerBy:string = 'All';
  search_string: string;
  selectedRole: string;
  allStaffRoles:string[] = [];
  sortOrderBy: string;

  ngOnInit(): void {
    this.getStaffList();
  }




  onSearchSubmit(){

  }


  staffSearchOnInput(event_data){

  }


  showAllStaffList(event_data){

  }

  showActiveStaffList(event_data){

  }
  showInactiveStaffList(event_data){

  }


  selectedRoleChanged(event_data){

  }


  sortStaffList(event_data, order_name:string){

  }


  onStaffDeactivate(event_data, staff_id){

  }


  onStaffActivate(event_data, staff_id){

  }





  getStaffList(){
    this.fetchingStaffList = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      staff_list: User[],
      error_msg: string
    }>(this._baseUrl + 'api/Staff/GetAllStaffList').subscribe(result => {
      console.log(result);
      this.fetchingStaffList = false;
      if (result.success) {
         this.all_staff_list = result.staff_list;
         this.filtered_staff_list = this.all_staff_list.slice();
      }
    });
  }
}
