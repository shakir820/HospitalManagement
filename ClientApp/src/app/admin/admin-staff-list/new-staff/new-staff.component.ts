import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-staff',
  templateUrl: './new-staff.component.html',
  styleUrls: ['./new-staff.component.css']
})
export class NewStaffComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private router: Router) {
    this._baseUrl = baseUrl;
  }

  @ViewChild('f') staffCreateForm: NgForm;
  creatingStaff: boolean = false;
  staffRoles: string[];
  staffSelectedRole: string;
  staff_name: string;
  staff_username: string;
  staff_password: string;
  checkingUsername: boolean = false;
  usernameTaken: boolean = false;
  _baseUrl: string;
  submitted: boolean = false;
  uniqueUsername: boolean = false;



  ngOnInit(): void {
    this.getStaffRoles();

  }



  onUsernameInputChanged(event_data){
    if(this.staff_username.length == 0){
      this.usernameTaken = false;
      this.uniqueUsername = false;
    }
  }

  getStaffRoles(){

    this.httpClient.get<{
      success: boolean,
      error: boolean,
      staff_roles: string[],
      error_msg: string
    }>(this._baseUrl + 'api/Staff/GetStaffRoles').subscribe(result => {
      if (result.success) {
         this.staffRoles = result.staff_roles;
         this.staffSelectedRole = "Investigator";
      }
    });
  }



  onFormSubmit(){
    this.submitted = true;

    if(this.usernameTaken == false && this.staffCreateForm.valid){
      this.submitted = false;

      this.creatingStaff = true;
      var staff_user = new User();
      staff_user.name = this.staff_name;
      staff_user.username = this.staff_username;
      staff_user.password = this.staff_password;
      staff_user.roles = [];
      staff_user.roles.push(this.staffSelectedRole);

      var uifd = JSON.stringify(staff_user);


      this.httpClient.post<{
        success: boolean,
        error: boolean,
        user: User,
        error_msg: string
      }>(this._baseUrl + 'api/staff/CreateStaff', { json_data: uifd } ).subscribe(result => {
        this.creatingStaff = false;
        if(result.success){
          Swal.fire({
            title: 'Success!',
            text: 'Staff created',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }
        else{
          Swal.fire({
            title: 'Error!',
            text: result.error_msg,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      }, error => {
        console.log(error);
        this.creatingStaff = false;
      });
    }
  }



  onUsernameChanged(event_data){

    if(this.staff_username.length == 0){
      return;
    }

    this.checkingUsername = true;
    this.httpClient.get<{
      unique_username: boolean
    }>(this._baseUrl + 'api/UserManager/CheckForUniqueUsername', {params: { username: this.staff_username }}).subscribe(result => {
      this.checkingUsername = false;
       if(result.unique_username){
         this.usernameTaken = false;
         this.uniqueUsername = true;
       }
       else{
         this.usernameTaken = true;
         this.uniqueUsername = false;
       }
    });

  }
}
