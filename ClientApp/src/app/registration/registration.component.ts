import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {

  }





  @ViewChild('f') registerForm: NgForm;

  genders:string[] = ["Male", "Female", "Other"];
  submitted:boolean = false;
  isUniqueEmailAddress:boolean = true;
  selectedGender:string = "Male";
  selectedRole:string = "Patient";
  roles:string[] = ['Doctor', 'Patient'];
  email:string;
  registering:boolean = false;


  async onSubmit(){
    console.log(this.registerForm);
    this.submitted = true;

    if(this.registerForm.valid){

      this.registering = true;
      this.submitted = false;
      //check for isUniqueEmailAddress
       this.isUniqueEmailAddress = await this.userService.checkIfEmailisUnique(this.registerForm.controls['email'].value);
      if(this.isUniqueEmailAddress){

          this.userService.CreateNewUser(this.registerForm.controls['name'].value,
          this.registerForm.controls['password'].value,
          this.registerForm.controls['email'].value,
          this.selectedRole, <number>this.registerForm.controls['age'].value, this.selectedGender).then(result =>{
          this.registering = false;
       });
      }
      else{
        this.registering = false;
      }

    }
    else{
      this.registering = false;
    }


    // var emailAddress = <string>this.signinForm.controls['email'].value;
    // var password = <string>this.signinForm.controls['password'].value;

    // var result = this.userService.SignIn(emailAddress, password);


  }
}
