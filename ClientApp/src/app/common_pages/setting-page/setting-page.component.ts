import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
  }




  @ViewChild('f') passwordForm: NgForm;
  _baseUrl: string;
  submitted: boolean = false;
  old_password: string;
  new_password: string;
  changingPassword: boolean = false;
  old_password_incorrect: boolean = false;



  onOldPasswordInput(){
    if(this.old_password.length == 0){
      this.old_password_incorrect = false;
    }
  }




  ngOnInit(): void {



  }





  onSubmit(){
    this.submitted = true;
    if(this.passwordForm.valid){
      this.submitted = false;

      this.changingPassword = true;
      this.old_password_incorrect = false;

      var user_model = { id: this.userService.user.id, password: this.old_password, new_password: this.new_password };
      var json_obj = JSON.stringify(user_model);

      this.httpClient.post<{
        success : boolean,
        error: boolean,
        error_msg: string,
        old_password_incorrect: boolean
      }>(this._baseUrl + 'api/UserManager/ChangePassword', { json_data: json_obj }).subscribe(result =>{
        this.changingPassword = false;
        if(result.success){
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Password changed'
          });

          this.old_password = '';
          this.new_password = '';
        }
        else if(result.old_password_incorrect){
          this.old_password_incorrect = true;
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
  }



}
