import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EditUserRoleDialogComponent } from 'src/app/modal-dialogs/edit-user-role-dialog/edit-user-role-dialog.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.css']
})
export class AdminUserListComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private router: Router) {
    this._baseUrl = baseUrl;
  }



  @ViewChild('f') searchForm: NgForm;
  search_string: string;
  user_list: User[];
  @ViewChild('editUserRoleDialog') editUserRoleDialog: EditUserRoleDialogComponent;
  fetchingUsers: boolean = false;
  _baseUrl: string;


  ngOnInit(): void {

  }



  userSearchOnInput(event_data) {
    if (this.search_string.length == 0) {
      this.user_list = [];
    }
  }



  onSearchSubmit() {
    if (this.search_string.length > 0) {
      this.getUsers();
    }
  }





  onActivateUser(event_data, user_id) {
    var user = this.user_list.find(a => a.id == user_id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/ActivateUser', { params: { id: user.id.toString() } }).subscribe(result => {
        if (result.success) {
          user.isActive = true;
        }
      });
  }



  onDeactivateUser(event_data, user_id) {
    var user = this.user_list.find(a => a.id == user_id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/DeactivateUser', { params: { id: user.id.toString() } }).subscribe(result => {
        if (result.success) {
          user.isActive = false;
        }
      });
  }



  onEditUserRole(event_data, user_id) {
    var user = this.user_list.find(a => a.id == user_id);
    var _user = new User();
    _user.id = user.id;
    _user.name = user.name;
    _user.roles = user.roles.slice();
    this.editUserRoleDialog.showModal(_user);
  }




  getUsers() {
    this.fetchingUsers = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      user_list: User[],
      error_msg: string
    }>(this._baseUrl + 'api/UserManager/GetUsers', { params: { search_key: this.search_string } }).subscribe(result => {
      console.log(result);
      this.fetchingUsers = false;
      if (result.success) {
        this.user_list = result.user_list;
      }
    });
  }





  onUserRoleChanged(role_changed_user: User) {
    this.httpClient.post<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/UserManager/ChangeRole', { id: role_changed_user.id, roles: role_changed_user.roles }).subscribe(result => {
      if (result.success) {
        var user = this.user_list.find(a => a.id == role_changed_user.id);
        user.roles = role_changed_user.roles.slice();
      }
      else {
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




  onUserClicked(event_data, u_id:number){
    this.router.navigate(['admin/UserDetails'], {queryParams: {user_id: u_id}});
  }



}
