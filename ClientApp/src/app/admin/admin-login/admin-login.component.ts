import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  _baseUrl: string;
  title: string = 'admin-login';
  constructor( private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private cookieService: CookieService) {
      this._baseUrl = baseUrl;
    }

  ngOnInit(): void {

  }


  @ViewChild('f') signinForm: NgForm;
  submitted: boolean = false;
  rememberMe: boolean = false;
  loggingIn: boolean = false;
  error_msg: string;
  usernameExist: boolean = true;
  wrongPassword: boolean = false;



  async onSubmit() {

    console.log(this.signinForm);
    this.submitted = true;

    //check for valid form
    if (this.signinForm.valid) {
      this.submitted = false;
      this.loggingIn = true;

      this.httpClient.post<{
        success: boolean,
        error: boolean,
        error_msg: string,
        wrong_password: boolean,
        user: User
      }>(this._baseUrl + 'api/Admin/Login', {username: this.signinForm.controls['username'].value, password: this.signinForm.controls['password'].value}).subscribe(result => {
      this.loggingIn = false;
      console.log(result);

      if(result.success){
        this.userService.user = result.user;

        this.userService.isLoggedIn = true;
        this.userService.fetchProfilePic(this.userService.user.id);
        this.userService.clearUserData('/admin');
        this.userService.clearUserData('/');
        this.userService.SaveUserCredientials();
        this.userService.roleChanged.emit(this.userService.user.roles);
        this.router.navigate(['admin/dashboard']);
      }

      else if(result.wrong_password){
        this.wrongPassword = true;
      }
      else{
        this.error_msg = result.error_msg;
      }
    });

    //   if (result.success == true) {
    //     this.userService.isLoggedIn = true;
    //     this.router.navigate(['dashboard']);

    //   }
    //   else {
    //     if (result.emailExist == false) {
    //       this.emailDoesntExist = true;
    //     }
    //     else {
    //       this.error_msg = result.msg;
    //     }
    //   }
    // }
    // else {

     }
  }

  onUsernameInput(event_data){
    if(this.usernameExist == false){
      this.usernameExist = true;
    }
  }



  onPasswordInput(event_data){
    if(this.wrongPassword == true){
      this.wrongPassword = false;
    }
  }

}
