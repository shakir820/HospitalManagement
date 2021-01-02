import { HttpClient } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
  }


  _baseUrl: string;
  title: string = "Home";
  @ViewChild('f') contactMsgForm: NgForm;
  sendingMsg: boolean = false;
  submitted: boolean = false;
  phoneNumber: string;
  invalidMobileNumber: boolean = false;
  msgSentSuccess: boolean = false;




  validatePhoneNumber(event_data) {
    let enteredPhoneNumber: string = event_data.target.value;
    let plusExpression: RegExp = /^\+/;
    let regexExpression: RegExp = /\D/;

    if (regexExpression.test(enteredPhoneNumber)) {
      if (plusExpression.test(enteredPhoneNumber)) {
        let enteredPhoneNumber2 = enteredPhoneNumber.slice(1);

        if (regexExpression.test(enteredPhoneNumber2)) {
          this.invalidMobileNumber = true;
        }
        else {
          this.invalidMobileNumber = false;
        }
      }
      else {
        this.invalidMobileNumber = true;
      }
    }
    else {
      this.invalidMobileNumber = false;
    }
  }


  onSubmit() {
    this.sendingMsg = true;
    this.submitted = true;

    if (this.contactMsgForm.valid && !this.invalidMobileNumber) {
      this.submitted = false;

      this.httpClient.post<{
        success: boolean,
        error: boolean,
        error_msg: string
      }>(this._baseUrl + 'api/ContactUs/SendContactUsMessage',
        {
          customer_name: this.contactMsgForm.controls['contact_name'].value,
          mobile: this.phoneNumber,
          message: this.contactMsgForm.controls['contact_description'].value
        }).subscribe(result => {
          this.sendingMsg = false;
          console.log(result);

          if (result.success) {
            //this.msgSentSuccess = true;
            //show success icon/notification/alert
            Swal.fire({
              title: 'Success!',
              text: 'Message sent',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          }
          else {
            this.msgSentSuccess = false;
            Swal.fire({
              title: 'Error!',
              text: result.error_msg,
              icon: 'error',
              confirmButtonText: 'Ok'
            });

          }
        });
    }



  }
}
