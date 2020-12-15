import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { EditUserRoleDialogComponent } from 'src/app/modal-dialogs/edit-user-role-dialog/edit-user-role-dialog.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

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
  @ViewChild('editUserRoleDialog') editUserRoleDialog: EditUserRoleDialogComponent;

  _baseUrl: string;
  fetchingStaffList: boolean = false;
  sortByAsscending:boolean = true;
  all_staff_list:User[] = [];
  filtered_staff_list: User[] = [];
  filterBy:string = 'All';
  search_string: string;
  selectedRole: string = 'All';
  allStaffRoles:string[] = [];
  sortOrderBy: string = 'Id';

  ngOnInit(): void {
    this.getStaffList();
    this.getstaffRoles();
  }




  onSearchSubmit(){
    if(this.search_string.length > 0){
      var sk = this.search_string.toUpperCase();
      this.filtered_staff_list =  this.all_staff_list.filter(a => a.name.toUpperCase().includes(sk));
      this.sortStaffListDefault();
    }
  }


  staffSearchOnInput(event_data){
    if(this.search_string.length == 0){
      this.filtered_staff_list = this.all_staff_list.slice();
      this.filterBy = 'All';
      this.selectedRole = 'All'
      this.sortStaffListDefault();
    }
  }


  showAllStaffList(event_data){
    this.search_string = '';
    this.filtered_staff_list = this.all_staff_list.slice();
    this.filterBy = 'All';
    this.sortStaffListDefault();
  }

  showActiveStaffList(event_data){
    this.filtered_staff_list = this.all_staff_list.filter(a => a.isActive == true);
    this.filterBy = 'Active';
    this.sortStaffListDefault();
  }
  showInactiveStaffList(event_data){
    this.filtered_staff_list = this.all_staff_list.filter(a => a.isActive == false);
    this.filterBy = 'Inactive'
    this.sortStaffListDefault();
  }


  selectedRoleChanged(event_data){
    this.filtered_staff_list = [];
    if(this.selectedRole == 'All'){
      this.filtered_staff_list = this.all_staff_list.slice();
      this.sortStaffListDefault();
      return;
    }

    this.all_staff_list.forEach(val => {
      var roles = val.roles;
      if(roles.includes(this.selectedRole)){
        this.filtered_staff_list.push(val);
      }
    });

    this.sortStaffListDefault();
  }




  sortStaffList(event_data, order_name:string){
    if(this.sortOrderBy == order_name){
      this.sortByAsscending = !this.sortByAsscending;
   }
    switch(order_name){
      case 'Id':
        if(this.sortByAsscending){
          this.filtered_staff_list.sort(sortBy('id'));
        }
        else{
          this.filtered_staff_list.sort(sortBy('-id'));
        }
      break;

      case 'Name':
      if(this.sortByAsscending){
        this.filtered_staff_list.sort(sortBy('name'));
      }
      else{
        this.filtered_staff_list.sort(sortBy('-name'));
      }
      break;


      case 'Status':
      if(this.sortByAsscending){
        this.filtered_staff_list.sort(sortBy('isActive'));
      }
      else{
        this.filtered_staff_list.sort(sortBy('-isActive'));
      }
      break;


      case 'Date':
      if(this.sortByAsscending){
        this.filtered_staff_list.sort(sortBy('created_date'));
      }
      else{
        this.filtered_staff_list.sort(sortBy('-created_date'));
      }
      break;

    }

    this.sortOrderBy = order_name;
  }


  sortStaffListDefault(){
    switch(this.sortOrderBy){
      case 'Id':
        if(this.sortByAsscending){
          this.filtered_staff_list.sort(sortBy('id'));
        }
        else{
          this.filtered_staff_list.sort(sortBy('-id'));
        }
      break;

      case 'Name':
      if(this.sortByAsscending){
        this.filtered_staff_list.sort(sortBy('name'));
      }
      else{
        this.filtered_staff_list.sort(sortBy('-name'));
      }
      break;


      case 'Status':
      if(this.sortByAsscending){
        this.filtered_staff_list.sort(sortBy('isActive'));
      }
      else{
        this.filtered_staff_list.sort(sortBy('-isActive'));
      }
      break;


      case 'Date':
      if(this.sortByAsscending){
        this.filtered_staff_list.sort(sortBy('created_date'));
      }
      else{
        this.filtered_staff_list.sort(sortBy('-created_date'));
      }
      break;

    }
  }


  onStaffDeactivate(event_data, staff_id){
    var user = this.all_staff_list.find(a => a.id == staff_id);
    this.httpClient.get<{success: boolean, error: boolean, error_msg: string}>
    (this._baseUrl + 'api/admin/DeactivateUser', {params: { id: user.id.toString()} }).subscribe(result => {
      if(result.success){
        user.isActive = false;
      }
    });
  }


  onStaffActivate(event_data, staff_id){
    var user = this.all_staff_list.find(a => a.id == staff_id);
    this.httpClient.get<{success: boolean, error: boolean, error_msg: string}>
    (this._baseUrl + 'api/admin/ActivateUser', {params: { id: user.id.toString()} }).subscribe(result => {
      if(result.success){
        user.isActive = true;
      }
    });
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


  getstaffRoles(){
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      staff_roles: string[],
      error_msg: string
    }>(this._baseUrl + 'api/Staff/GetStaffRoles').subscribe(result => {
      console.log(result);
      if (result.success) {
         this.allStaffRoles = result.staff_roles;
      }
    });
  }


  onEditUserRole(event_data, user_id){
    var user = this.all_staff_list.find(a => a.id == user_id);
    var _user = new User();
    _user.id = user.id;
    _user.name = user.name;
    _user.roles = user.roles.slice();
    this.editUserRoleDialog.showModal(_user);
  }


  onUserRoleChanged(role_changed_user: User){
    this.httpClient.post<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/UserManager/ChangeRole', { id: role_changed_user.id, roles: role_changed_user.roles }).subscribe( result => {
      if(result.success){
        var user = this.all_staff_list.find(a => a.id == role_changed_user.id);
        user.roles = role_changed_user.roles.slice();
      }
      else{
        Swal.fire({
          title: 'Error!',
          text: result.error_msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    },
    error => {

    });
  }
}
