import { HttpClient } from '@angular/common/http';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Inject, Injectable, Output } from '@angular/core';
import { rejects } from 'assert';
import { CookieService } from 'ngx-cookie-service';
import { EventEmitter } from '@angular/core';
import { stringify } from 'querystring';
import { observable, Observable } from 'rxjs';
import { URL } from 'url';
import { User } from '../models/user.model';
import { Speciality } from '../models/speciality.model';
import { Language } from '../models/langauge.model';
import { Schedule } from '../models/schedule.model';
import { Helper } from '../helper-methods/helper.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string, private cookieService: CookieService) {
    this._baseUrl = baseUrl;
    this.getSpecialityTags();
    this.getLanguages();
  }

  _baseUrl: string;
  user: User;
  isLoggedIn: boolean = false;
  loggingInProgress: boolean = false;
  doctorSpecialityTags: Speciality[];
  languageList: Language[] = [];


  approvedChanged = new EventEmitter<boolean>();
  roleChanged = new EventEmitter<string[]>();






  tryLoginUser(): Promise<boolean> {
    this.loggingInProgress = true;
    var promise = new Promise<boolean>((resolve, rejects) => {
      let user_id_str = this.cookieService.get('skt_hospital_user_id');
      if (user_id_str !== null && user_id_str !== '' && user_id_str != undefined) {

        this.httpClient.get<{
          error_msg: string,
          error: boolean,
          success: boolean,
          user: User,
          msg: string
        }>(this._baseUrl + 'api/UserManager/getUserById2', { params: { id: user_id_str } }).subscribe(result => {
          if (result.success) {

            this.user = result.user;

            this.roleChanged.emit(this.user.roles);

            console.log(this.user);

            this.fireUserApprovedChangedEvent();
            this.fetchProfilePic(this.user.id);
            this.isLoggedIn = true;
            this.loggingInProgress = false;

            resolve(true);
          }
          else {
            // do some error stuff here
            this.loggingInProgress = false;
            resolve(false);
          }
        });
      }
      else {
        this.loggingInProgress = false;
        this.isLoggedIn = false;
        resolve(false);
      }
    });


    return promise;

  }





  fetchProfilePic(user_id: number) {
    if (user_id == null || user_id == undefined) {
      return;
    }
    this.httpClient.get(this._baseUrl + 'api/usermanager/GetProfilePic', { params: { id: user_id.toString() }, responseType: 'blob' }).subscribe(result => {
      if (result != null && result != undefined) {
        var reader = new FileReader();
        reader.onload = (e) => {
          var base64 = e.target.result;
          if (this.user != null) {
            this.user.profile_pic = base64;
          }

        };
        reader.readAsDataURL(result);
      }
    });
  }





  checkForUniqueUsername(username: string): Promise<boolean> {
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


  public SaveUserCredientials() {

    this.cookieService.set('skt_hospital_user_id', this.user.id.toString());
    this.cookieService.set('skt_hospital_user_email', this.user.email);
    this.cookieService.set('skt_hospital_user_role_count', this.user.roles.length.toString());

    this.user.roles.forEach((val, index) => {
      this.cookieService.set(`skt_hospital_user_roles[${index}]`, val);
    });

  }




  clearUserData(path: string) {
    this.cookieService.deleteAll(path, 'localhost');
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






  SignIn(email: string, password: string, remember_me: boolean): Promise<{ msg: string, success: boolean, emailExist: boolean }> {
    let promise = new Promise<{ msg: string, success: boolean, emailExist: boolean }>((resolve, rejects) => {
      this.httpClient.post<{
        error_msg: string,
        error: boolean,
        success: boolean,
        user: User,
        msg: string,
        emailExist: boolean,
        wrong_password: boolean
      }>(this._baseUrl + 'api/UserManager/SigninUser2', { email: email, Password: password }).subscribe(result => {
        if (result.success == true) {
          console.log(result);
          this.user = result.user;

          this.roleChanged.emit(this.user.roles);




          this.fireUserApprovedChangedEvent();
          this.fetchProfilePic(result.user.id);
          this.clearUserData('/');
          this.clearUserData('/admin');
          if (remember_me) {
            this.SaveUserCredientials();
          }

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
      var user2 = new User();
      user2.email = email;
      user2.name = name;
      user2.password = password;
      user2.role = role;
      user2.age = age;
      user2.gender = gender;

      var user_str = JSON.stringify(user2);

      this.httpClient.post<{
        success: boolean,
        error: boolean,
        user: User,
        error_msg: string
      }>(
        this._baseUrl + "api/usermanager/CreateNewUser2", { json_data: user_str }).subscribe(result => {
          if (result.success == true) {

            this.user = result.user;

            this.SaveUserCredientials();
            this.isLoggedIn = true;
            this.roleChanged.emit(this.user.roles);
            this.fireUserApprovedChangedEvent();
            this.fetchProfilePic(this.user.id);
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





  getSpecialityTags() {
    this.httpClient.get<{ success: boolean, error: boolean, specialities: { id: number, specialityName: string }[], error_msg: string }>(
      this._baseUrl + "api/usermanager/GetSpecialityTags").subscribe(result => {
        console.log(result);
        if (result.success === true && result.specialities !== undefined) {
          this.doctorSpecialityTags = [];
          result.specialities.forEach(val => {
            var tag_speciality = new Speciality();
            tag_speciality.id = val.id;
            tag_speciality.specialityName = val.specialityName;
            this.doctorSpecialityTags.push(tag_speciality);
          });
        }
        else {

        }

      },
        error => console.error(error)
      );
  }





  getLanguages() {
    this.httpClient.get<{ success: boolean, error: boolean, languages: { id: number, languageName: string }[], error_msg: string }>(
      this._baseUrl + "api/usermanager/GetLanguages").subscribe(result => {
        console.log(result);
        if (result.success === true && result.languages !== undefined) {
          this.languageList = [];
          result.languages.forEach(val => {
            var lang = new Language();
            lang.id = val.id;
            lang.languageName = val.languageName;
            this.languageList.push(lang);
          });
        }
        else {

        }

      },
        error => console.error(error)
      );
  }




  fireUserApprovedChangedEvent() {
    this.approvedChanged.emit(this.user.approved);
  }
}
