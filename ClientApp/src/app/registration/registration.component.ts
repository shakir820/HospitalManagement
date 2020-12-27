import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  title = "register";
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {

  }





  @ViewChild('f') registerForm: NgForm;

  genders: string[] = ["Male", "Female", "Other"];
  submitted: boolean = false;
  isUniqueEmailAddress: boolean = true;
  selectedGender: string = "Male";
  selectedRole: string = "Patient";
  roles: string[] = ['Doctor', 'Patient', 'Staff'];
  email: string;
  registering: boolean = false;
  //errorList: string[] = [];
  error_msg: string;

  async onSubmit() {
    //console.log(this.registerForm);
    this.submitted = true;

    if (this.registerForm.valid) {

      this.registering = true;
      this.error_msg = null;
      this.submitted = false;
      //check for isUniqueEmailAddress
      this.isUniqueEmailAddress = await this.userService.checkIfEmailisUnique(this.registerForm.controls['email'].value);
      if (this.isUniqueEmailAddress) {
        // this.errorList = [];
        var createUserResult = await this.userService.CreateNewUser(this.registerForm.controls['user_name'].value,
          this.registerForm.controls['password'].value,
          this.registerForm.controls['email'].value,
          this.selectedRole, <number>this.registerForm.controls['age'].value, this.selectedGender);
        this.registering = false;
        if (createUserResult.error) {
          // this.errorList = createUserResult.error_list;
          // this.errorList.push(createUserResult.error_msg);
          this.error_msg = createUserResult.error_msg;

        }
        else if (createUserResult.success) {
          this.router.navigate(['/dashboard']);
        }
      }
      else {
        this.registering = false;
      }

    }
    else {
      this.registering = false;
    }


    // var emailAddress = <string>this.signinForm.controls['email'].value;
    // var password = <string>this.signinForm.controls['password'].value;

    // var result = this.userService.SignIn(emailAddress, password);


  }
}
