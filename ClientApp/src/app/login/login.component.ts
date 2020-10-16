import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {

  }


  @ViewChild('f') signinForm: NgForm;

  submitted:boolean = false;
  emailDoesntExist:boolean = false;
  rememberMe:boolean = false;
  loggingIn: boolean = false;
  emailOrPasswordWrong: boolean = false;
  error_msg:string;





  async onSubmit(){
     console.log(this.signinForm);
     this.submitted = true;
     this.emailDoesntExist = false;
     //check for valid form
     if(this.signinForm.valid){
       this.submitted = false;
       this.loggingIn = true;
        var result = await this.userService.SignIn( this.signinForm.controls['email'].value,  this.signinForm.controls['password'].value);
        this.loggingIn = false;
        if(result.success == true){

        }
        else{
          if(result.emailExist == false){
            this.emailDoesntExist = true;
          }
          else{
            this.error_msg = result.msg;
          }
        }
     }
     else{

     }
  }
}


