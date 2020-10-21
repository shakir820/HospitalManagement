import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmailValidator, NgForm } from '@angular/forms';
import { LocationService } from '../services/location.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit , AfterViewInit{

  constructor(private userService: UserService, locationService: LocationService) {
    this.location_service = locationService;
   }

   ngAfterViewInit():void{
     this.userName = this.userService.user.username;
     this.proposedEmail = this.userService.user.email;
     this.email = this.userService.user.email;
     this.proposedUsername = this.userService.user.username;
     this.selectedGender = this.userService.user.gender;
     this.selectedRole = this.userService.user.roles[0];
     this.user_name = this.userService.user.name;
     this.resolveCountryStateCity();

   }



  ngOnInit(): void {

  }

  @ViewChild('f') profileForm: NgForm;

  genders: string[] = ["Male", "Female", "Other"];
  location_service: LocationService;
  submitted: boolean = false;
  isUniqueEmailAddress: boolean = true;
  selectedGender: string = "Male";
  selectedRole: string = "Patient";
  roles: string[] = ['Doctor', 'Patient'];
  email: string;
  proposedEmail:string;
  registering: boolean = false;
  errorList: string[] = [];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  selectedBlood: string;
  placeHolderImage:string = 'assets/default-avatar.png';
  negativeAgeValue:boolean = false;
  invalidAge:boolean = false;
  checkingUsername: boolean = false;
  invalidMobileNumber: boolean = false;
  uniqueUsername: boolean = true;
  userName:string;
  proposedUsername:string;
  checkingEmail: boolean = false;
  user_name:string;
  validPhoneNumber: boolean = true;
  savingProfileData: boolean = false;
  selectedCountry: string;



   onSubmit() {
     this.savingProfileData = true;
    console.log(this.profileForm);
  }

  @ViewChild('imageInput', {static: true}) imageInputRef: ElementRef;
  @ViewChild('imagePreview', {static: true}) imagePreviewRef: ElementRef;

   imgData: any;



   async resolveCountryStateCity(){
     if(this.location_service.countryList.length == 0){
       await this.location_service.getCountryList();

     }

   }

   onEmailInput(event_data){
     if(this.profileForm.controls['email'].valid == true){

      if(this.checkingEmail == false){
        //check for email
        this.checkingEmail = true;
        setTimeout(async ()=>{
          if(this.profileForm.controls['email'].valid == true){
            if(this.userService.user.email != this.proposedEmail){
              this.isUniqueEmailAddress = await this.userService.checkIfEmailisUnique(this.proposedEmail);
              console.log(this.isUniqueEmailAddress);
              this.checkingEmail = false;
            }
            else{
              this.isUniqueEmailAddress = true;
              this.checkingEmail = false;
            }
          }
          else{
            this.checkingEmail = false;
          }
        }, 2000);

      }
     }
     else{
       this.checkingEmail = false;
     }
   }


  onImageChange(event_data){
    var reader = new FileReader();
    console.log(event_data);
    reader.onload = e=>{
      console.log(e);
      let result_data = e.target.result;
      (<HTMLElement>this.imagePreviewRef.nativeElement).style.backgroundImage = `url(${result_data})`;

    }
    reader.readAsDataURL(event_data.target.files[0]);
  }




  onUsernameInput(event_data){
    console.log(event_data);
    console.log(this.checkingUsername);
    console.log(this.userName);
    console.log(this.proposedUsername);

    if(this.proposedUsername === null || this.proposedUsername === '' || this.proposedUsername == undefined ){
      return;
    }
    if(this.checkingUsername == false){
      //check for username
      this.checkingUsername = true;
      setTimeout(async ()=>{
        if(this.proposedUsername !== null && this.proposedUsername !== '' && this.proposedUsername !== undefined ){
          if(this.userName != this.proposedUsername){
            console.log(this.userName);
            console.log(this.proposedUsername);
            this.uniqueUsername = await this.userService.checkForUniqueUsername(this.proposedUsername);
            this.checkingUsername = false;
            console.log(this.uniqueUsername);
          }
          else{
            this.uniqueUsername = true;
            this.checkingUsername = false;
          }
        }
        else{
          this.checkingUsername = false;
        }
      }, 2000);
    }
  }




  validatePhoneNumber(event_data){
    let enteredPhoneNumber:string = event_data.target.value;
    let plusExpression: RegExp = /^\+/;
    let regexExpression: RegExp = /\D/;

    if(regexExpression.test(enteredPhoneNumber)){
      if(plusExpression.test(enteredPhoneNumber)){
        let enteredPhoneNumber2 = enteredPhoneNumber.slice(1);
        console.log(enteredPhoneNumber2);
        console.log(regexExpression.test(enteredPhoneNumber2));
        if(regexExpression.test(enteredPhoneNumber2)){
          this.invalidMobileNumber = true;
        }
        else{
          this.invalidMobileNumber = false;
        }
      }
      else{
        this.invalidMobileNumber = true;
      }
    }
    else{
      this.invalidMobileNumber = false;
    }

    //this.invalidMobileNumber = regexExpression.test(enteredPhoneNumber);
  }





  validateAge(event_data){
    var enteredAge = event_data.target.value;
    let regexExpression: RegExp = /\D/;

    if(regexExpression.test(enteredAge)){
      this.invalidAge = true;
    }
    else{
      this.invalidAge = false;
    }

  }


}
