import { HttpClient } from '@angular/common/http';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Inject, Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { CookieService } from 'ngx-cookie-service';
import { promise } from 'protractor';
import { stringify } from 'querystring';
import { observable, Observable } from 'rxjs';
import { URL } from 'url';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string, private cookieService: CookieService) {
    this._baseUrl = baseUrl;
  }

  _baseUrl: string;
  user: User;
  isLoggedIn: boolean = false;



  tryLoginUser(): boolean {

    let user_id_str = this.cookieService.get('skt_hospital_user_id');

    //console.log(user_id_str);
    if (user_id_str !== null && user_id_str !== '' && user_id_str != undefined) {
      this.isLoggedIn = true;

      this.httpClient.get<{
        error_msg: string,
        error: boolean,
        success: boolean,
        user: { age: number, id: number, name: string, username: string, role: string, roles: string[], gender: string, email: string, password: string, bloodGroup: string,
          bmdc_certifcate: string, city_name: string, country_name: string, country_phone_code: number, country_short_name: string, state_name: string, phoneNumber: string },
        msg: string
      }>(this._baseUrl + 'api/UserManager/getUserById', { params: { id: user_id_str } }).subscribe(result => {
        if (result.success) {
          if(this.user === null || this.user === undefined){
            this.user = new User();
          }

          this.user.age = result.user.age;
          this.user.email = result.user.email;
          this.user.gender = result.user.gender;
          this.user.id = result.user.id;
          this.user.name = result.user.name;
          this.user.username = result.user.username;
          this.user.phoneNumber = result.user.phoneNumber?? undefined;
          //console.log(result.user.roles);
          this.user.roles = [];
          result.user.roles.forEach(val => {
            this.user.roles.push(val);
          });
          this.user.bloodGroup = result.user.bloodGroup;
          this.user.bmdc_certifcate = result.user.bmdc_certifcate;
          this.user.city_name = result.user.city_name;
          this.user.country_name = result.user.country_name;
          this.user.country_phone_code = result.user.country_phone_code;
          this.user.country_short_name = result.user.country_short_name;
          this.user.state_name = result.user.state_name;
          //console.log(this.user.roles);

          //console.log(this.user);
          // get profile pic
          this.fetchProfilePic(this.user.id);
        }
        else {
          // do some error stuff here

        }
      });
    }
    return this.isLoggedIn;

  }




  fetchProfilePic(user_id: number){
    if(user_id == null || user_id == undefined){
      return;
    }
    this.httpClient.get(this._baseUrl + 'api/usermanager/GetProfilePic', {params: {id: user_id.toString()}, responseType: 'blob'}).subscribe(result=>{
      if(result != null && result != undefined){
        var reader = new FileReader();
        reader.onload = (e)=>{
          var base64 =   e.target.result;
          if(this.user != null){
            this.user.profile_pic = base64;
          }

        };
        reader.readAsDataURL(result);
      }
    });
  }





  checkForUniqueUsername(username: string):Promise<boolean>{
    let promise = new Promise<boolean>((resolve, reject) => {
      this.httpClient.get<{ unique_username: boolean }>(this._baseUrl + 'api/usermanager/CheckForUniqueUsername', { params: { username: username } }).subscribe(result => {
        console.log(result);
        resolve(result.unique_username);
      }, error => {
        console.error(error);
        resolve(false);
      });
    });
    return promise;
  }


  private SaveUserCredientials() {

    this.cookieService.set('skt_hospital_user_id', this.user.id.toString());
    this.cookieService.set('skt_hospital_user_email', this.user.email);
    this.cookieService.set('skt_hospital_user_role_count', this.user.roles.length.toString());

    this.user.roles.forEach((val, index) => {
      this.cookieService.set(`skt_hospital_user_roles[${index}]`, val);
    });

  }




  clearUserData(){
    this.cookieService.deleteAll();
  }







  checkIfEmailisUnique(email: string): Promise<boolean> {

    let promise = new Promise<boolean>((resolve, reject) => {
      this.httpClient.get<{ unique_emailAddress: boolean }>(this._baseUrl + 'api/EmailService/checkIfEmailisUnique', { params: { email: email } }).subscribe(result => {
        console.log(result);
        resolve(result.unique_emailAddress);
      }, error => console.error(error));
    });
    return promise;

  }



  SignIn(email: string, password: string): Promise<{ msg: string, success: boolean, emailExist: boolean }> {
    let promise = new Promise<{ msg: string, success: boolean, emailExist: boolean }>((resolve, rejects) => {
      this.httpClient.post<{
        error_msg: string,
        error: boolean,
        success: boolean,
        user: { age: number, id: number, name: string, username: string, role: string, roles: string[], gender: string, email: string, password: string, bloodGroup: string,
          bmdc_certifcate: string, city_name: string, country_name: string, country_phone_code: number, country_short_name: string, state_name: string, phoneNumber: string }
        msg: string,
        emailExist: boolean,
        wrong_password: boolean
      }>(this._baseUrl + 'api/UserManager/SigninUser', { email: email, Password: password }).subscribe(result => {
        if (result.success == true) {
          console.log(result);
          this.user = new User();
          this.user.age = result.user.age;
          this.user.id = result.user.id;
          this.user.email = email;
          this.user.gender = result.user.gender;
          this.user.name = result.user.name;
          this.user.username = result.user.username;
          this.user.phoneNumber = result.user.phoneNumber;
          this.user.roles = [];
          result.user.roles.forEach(val => {
            this.user.roles.push(val);
          });
          this.user.bloodGroup = result.user.bloodGroup;
          this.user.bmdc_certifcate = result.user.bmdc_certifcate;
          this.user.city_name = result.user.city_name;
          this.user.country_name = result.user.country_name;
          this.user.country_phone_code = result.user.country_phone_code;
          this.user.country_short_name = result.user.country_short_name;
          this.user.state_name = result.user.state_name;
         // console.log(this.user.roles);
          this.fetchProfilePic(result.user.id);
          this.SaveUserCredientials();
          resolve({ msg: result.msg, success: true, emailExist: true });

        }
        else {
          if (result.error) {
            resolve({ msg: result.error_msg, success: false, emailExist: result.emailExist });
          }
          else {
            resolve({ msg: result.msg, success: false, emailExist: result.emailExist });
          }
        }
      }, error => {
        console.error(error);
        rejects();
      });
    });

    return promise;
  }






  CreateNewUser(name: string, password: string, email: string, role: string, age: number, gender: string):
  Promise<{ error: boolean, error_msg: string, success: boolean, msg: string }> {

    let promise = new Promise<{ error: boolean, error_msg: string, success: boolean, msg: string }>((resolve, reject) => {
      this.httpClient.post<{ success: boolean, user_id: number, username:string, user_name: string, user_gender: string, user_age: number, error: boolean, error_msg: string, error_list: string[], role_list: string[] }>(
        this._baseUrl + "api/usermanager/CreateNewUser", { name: name, password: password, email: email, role: role, gender: gender, age: age }).subscribe(result => {
          if (result.success == true && result.user_id != null) {

            this.user = new User();
            this.user.email = email;
            this.user.id = result.user_id;
            this.user.name = name;
            this.user.password = password;
            this.user.age = age;
            this.user.gender = gender;
            result.role_list.forEach(val => {
              this.user.roles.push(val);
            });
            this.user.username = email;
            this.SaveUserCredientials();
            this.isLoggedIn = true;
            this.fetchProfilePic(result.user_id);
            resolve({ error: false, error_msg: null, success: true, msg: null });
          }
          else {

            resolve({ error: result.error, error_msg: result.error_msg, success: false, msg: null });
          }

        }, error => console.error(error)
        );
    });

    return promise;
  }
}
