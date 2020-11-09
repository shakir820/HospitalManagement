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

      this.httpClient.post<{success: boolean, error: boolean, error_msg: string,
      user: {name: string, username: string, age: number, bloodGroup: string, city_name: string, country_name: string, country_phone_code: number,
        country_short_name: string, email: string, approved: boolean, gender: string, id: number, roles: string[], phoneNumber: string, state_name: string }
      }>(this._baseUrl + 'api/Admin/Login', {username: this.signinForm.controls['username'].value, password: this.signinForm.controls['password'].value}).subscribe(result => {
      this.loggingIn = false;
      console.log(result);
      if(result.error){
        this.error_msg = result.error_msg;
      }
      else if(result.success){
        this.userService.user = new User();
        this.userService.user.username = result.user.username;
        this.userService.user.email = result.user.email;
        this.userService.user.id = result.user.id;
        this.userService.user.age = result.user.age;
        this.userService.user.bloodGroup = result.user.bloodGroup;
        this.userService.user.city_name = result.user.city_name;
        this.userService.user.country_name = result.user.country_name;
        this.userService.user.country_phone_code = result.user.country_phone_code;
        this.userService.user.country_short_name = result.user.country_short_name;
        this.userService.user.gender = result.user.gender;
        this.userService.user.name = result.user.name;
        this.userService.user.phoneNumber = result.user.phoneNumber;
        this.userService.user.roles = [];
        result.user.roles.forEach(val => {
          this.userService.user.roles.push(val);
        });
        this.userService.user.state_name = result.user.state_name;
        this.userService.isLoggedIn = true;
        this.userService.fetchProfilePic(this.userService.user.id);
        this.userService.clearUserData('/admin');
        this.userService.clearUserData('/');
        this.userService.SaveUserCredientials();
        this.userService.roleChanged.emit(this.userService.user.roles);
        this.router.navigate(['admin/dashboard']);
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



}
