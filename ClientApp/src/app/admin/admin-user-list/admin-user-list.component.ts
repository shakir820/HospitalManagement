import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EditUserRoleDialogComponent } from 'src/app/modal-dialogs/edit-user-role-dialog/edit-user-role-dialog.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

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



  @ViewChild('f') searchForm:NgForm;
  search_string: string;
  user_list: User[];
  @ViewChild('editUserRoleDialog') editUserRoleDialog: EditUserRoleDialogComponent;
  fetchingUsers: boolean = false;
  _baseUrl: string;


  ngOnInit(): void {

  }



  userSearchOnInput(event_data){

  }



  onSearchSubmit(){

  }





  onActivateUser(event_data, user_id){

  }



  onDeactivateUser(event_data, user_id){

  }



  onEditUserRole(event_data, user_id){
    this.editUserRoleDialog.showModal();
  }




  getUser(){
    this.fetchingUsers = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      staff_list: User[],
      error_msg: string
    }>(this._baseUrl + 'api/UserManager/GetAllStaffList').subscribe(result => {
      console.log(result);
      this.fetchingUsers = false;
      if (result.success) {
         this.all_staff_list = result.staff_list;
         this.filtered_staff_list = this.all_staff_list.slice();
      }
    });
  }

}
