import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { promise } from 'protractor';
import { stringify } from 'querystring';
import { observable, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  _baseUrl:string;
  user:User;


   checkIfEmailisUnique(email:string):Promise<boolean> {

    let promise = new Promise<boolean>((resolve, reject)=>{
      this.httpClient.get<{ unique_emailAddress:boolean }>(this._baseUrl + 'api/EmailService/checkIfEmailisUnique', {params: {email:email}}).subscribe(result => {
        console.log(result);
        resolve(result.unique_emailAddress);
      }, error => console.error(error));
    });
    return promise;

  }



  SignIn(email:string, password:string):Promise<{ msg:string, success:boolean, emailExist:boolean }>
  {
    let promise = new Promise<{ msg:string, success:boolean, emailExist: boolean }>((resolve, rejects)=>{
      this.httpClient.post<{
        error_msg:string,
        error:boolean,
        success:boolean,
        user:User
        msg: string,
        emailExist: boolean
       }>(this._baseUrl + 'api/UserManager/SigninUser',  { Email: email, Password: password }).subscribe(result => {
         if(result.success == true){
           this.user = result.user;
           resolve( {msg: result.msg, success: true, emailExist: true });
         }
         else{
          if(result.error){
            resolve({ msg: result.error_msg, success: false , emailExist:result.emailExist });
          }
          else {
            resolve({ msg: result.msg, success: false, emailExist: result.emailExist });
          }
         }
      }, error =>
      {
        console.error(error);
        rejects();
      } );
    });

    return promise;
  }






  CreateNewUser(name:string, password:string, email:string, role:string, age:number, gender:string):
                Promise<{user: User, error: boolean, error_msg: string, error_list: string[], success:boolean }>
                {

                  let promise = new Promise<{user: User, error: boolean, error_msg: string, error_list: string[], success:boolean }>((resolve, reject)=>{
                    let user:User = new User();
                    let success: boolean = false;
                    let error:boolean = false;
                    let error_msg: string;
        let error_list: string[] = [];

        this.httpClient.post<{
          success:boolean,
          user_id:number,
          user_name:string,
          user_gender:string,
          user_age:number,
          error:boolean,
          error_msg:string,
          error_list:string[],
          role_list:string[]
        }>(this._baseUrl + "api/usermanager/CreateNewUser", { Name: name, Password: password, Email:email, Role:role, Gender:gender, Age: age}).subscribe(result => {
          if(result.success == true && result.user_id != null){

            user.Email = email;
            user.Id = result.user_id;
            user.Name = name;
            user.Password = password;
            user.Roles = result.role_list;
            user.Gender = result.user_gender;
            user.Age = result.user_age;
            success = result.success;
          }
          else{
            error = result.error;
            error_msg = result.error_msg;
            error_list = result.error_list;
          }
          console.log(result);
          resolve({user: user, error: error, error_msg: error_msg, error_list: error_list, success:success});
      }, error => console.error(error)

      );


                  });

    return promise;
  }
}
