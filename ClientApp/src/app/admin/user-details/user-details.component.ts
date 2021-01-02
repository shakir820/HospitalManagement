import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditUserRoleDialogComponent } from 'src/app/modal-dialogs/edit-user-role-dialog/edit-user-role-dialog.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private route: ActivatedRoute) {
    this._baseUrl = baseUrl;
  }


  @ViewChild('editUserRoleDialog') editUserRoleDialog: EditUserRoleDialogComponent;
  user_id: number;
  _baseUrl: string;
  fetchingUserDetails: boolean = false;
  user: User;
  isDoctor: boolean = false;
  isInvestigator: boolean = false;
  isStaff: boolean = false;


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      var uid = params['user_id'];
      this.user_id = Number.parseFloat(uid);
    });
    this.getUserDetails();
  }




  getUserDetails(){
    this.fetchingUserDetails = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      user: User
    }>(this._baseUrl + 'api/admin/GetUserDetails', {params: {user_id: this.user_id.toString()}}).subscribe(result => {
      this.fetchingUserDetails = true;
      if(result.success){
        this.user = result.user;

        var doc_role = this.user.roles.find(a => a == 'Doctor');
        if(doc_role != undefined){
          this.isDoctor = true;
        }

        var inv_role = this.user.roles.find(a => a == 'Investigator');
        if(inv_role != undefined){
          this.isInvestigator = true;
        }


        var staff_role = this.user.roles.find(a => a == 'Staff');
        if(staff_role != undefined){
          this.isStaff = true;
        }
      }
    },
    error => {
      this.fetchingUserDetails = false;
      console.log(error);
    });
  }




  onEditUserRole(event_data){

    var _user = new User();
    _user.id = this.user.id;
    _user.name = this.user.name;
    _user.roles = this.user.roles.slice();
    this.editUserRoleDialog.showModal(_user);
  }

  onUserUnapprove(event_data){

    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/admin/UnapproveDoctor', {params: {id: this.user.id.toString() }}).subscribe(result => {
      if(result.success){
        this.user.approved = false;

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Doctor unapproved'
        });
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.error_msg
        });

      }
    });

  }

  onUserApprove(event_data){
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/admin/ApproveDoctor', {params: {id: this.user.id.toString() }}).subscribe(result => {
      if(result.success){
        this.user.approved = true;

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Doctor approved'
        });
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.error_msg
        });

      }
    });
  }


  onUserDeactivate(event_data){
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/admin/DeactivateUser', {params: {id: this.user.id.toString() }}).subscribe(result => {
      if(result.success){
        this.user.isActive = false;

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User deactivated'
        });
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.error_msg
        });

      }
    });
  }

  onUserActivate(event_data){

    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/admin/ActivateUser', {params: {id: this.user.id.toString() }}).subscribe(result => {
      if(result.success){
        this.user.isActive = true;

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User activated'
        });
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.error_msg
        });

      }
    });

  }



  onViewAppointments(event_data){
    this.router.navigate(['admin/DoctorAppointmentList'], {queryParams: {user_id: this.user_id}});
  }




  onUserRoleChanged(role_changed_user: User) {
    this.httpClient.post<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/UserManager/ChangeRole', { id: role_changed_user.id, roles: role_changed_user.roles }).subscribe(result => {
      if (result.success) {
        this.user.roles = role_changed_user.roles.slice();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Role changed'
        });
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

}
