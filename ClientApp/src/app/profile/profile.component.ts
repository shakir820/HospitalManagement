import { state, style, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Language } from '../models/langauge.model';
import { Speciality } from '../models/speciality.model';
import { LocationService } from '../services/location.service';
import { ProfileService } from '../services/profile.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  constructor(public userService: UserService, locationService: LocationService, private profileService: ProfileService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.location_service = locationService;
    this._baseUrl = baseUrl;
  }

  ngAfterViewInit(): void {
    this.userName = this.userService.user.username;
    this.proposedEmail = this.userService.user.email;
    this.email = this.userService.user.email;
    this.proposedUsername = this.userService.user.username;
    this.selectedGender = this.userService.user.gender;
    this.selectedRole = this.userService.user.roles[0];
    this.user_name = this.userService.user.name;
    this.selectedAge = this.userService.user.age;
    this.phoneNumber = this.userService.user.phoneNumber;
    this.selectedBlood = this.userService.user.bloodGroup;
    this.bmdc_certificate = this.userService.user.bmdc_certifcate;
    this.doctorApproved = this.userService.user.approved;

    this.ShowProfileImage();
    this.resolveCountryStateCity();
    this.resolveSpecialityTag();
    this.resolveLanguages();
  }



  ngOnInit(): void {

  }

  @ViewChild('f') profileForm: NgForm;

  //#region  variables
  //variables
  _baseUrl: string
  genders: string[] = ["Male", "Female", "Other"];
  location_service: LocationService;
  submitted: boolean = false;
  isUniqueEmailAddress: boolean = true;
  selectedGender: string = "Male";
  selectedRole: string = "Patient";
  roles: string[] = ['Doctor', 'Patient'];
  email: string;
  proposedEmail: string;
  registering: boolean = false;
  error_msg: string;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  selectedBlood: string;
  phoneNumber: string;
  selectedAge: number;
  bmdc_certificate: string;
  doctorApproved: boolean = false;
  negativeAgeValue: boolean = false;
  invalidAge: boolean = false;
  checkingUsername: boolean = false;
  invalidMobileNumber: boolean = false;
  uniqueUsername: boolean = true;
  userName: string;
  proposedUsername: string;
  checkingEmail: boolean = false;
  user_name: string;
  savingProfileData: boolean = false;
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  imgData: any;


  //doctor's info
  showDoctorInfoForm: boolean = false;
  specialityTagIsRequired: boolean = false;
  selectedSpeciality: number;
  suggestedSpecialities: Speciality[] = [];
  allSpecialities: Speciality[] = [];
  selectedSpecialities: Speciality[] = [];
  languageTagIsRequired: boolean = false;
  selectedLanguage: number;
  suggestedLanguages: Language[] = [];
  selectedLanguages: Language[] = [];

  //#endregion




  @ViewChild('imageInput', { static: true }) imageInputRef: ElementRef;
  @ViewChild('imagePreview', { static: true }) imagePreviewRef: ElementRef;





  ShowProfileImage() {
    (<HTMLElement>this.imagePreviewRef.nativeElement).style.backgroundImage = `url(${this._baseUrl}` +
      'api/usermanager/GetProfilePic?id=' + this.userService.user.id.toString() + ')';
  }




  selectedRoleChanged(evet_data){
    if(this.selectedRole == 'Doctor'){
      this.showDoctorInfoForm = true;
    }
    else{
      this.showDoctorInfoForm = false;
    }
  }




  async resolveCountryStateCity() {
    if (this.location_service.access_token == undefined || this.location_service.access_token == '' || this.location_service.access_token == null) {
      await this.location_service.getAccessToken();
    }
    if (this.location_service.countryList.length == 0) {
      await this.location_service.getCountryList();
    }

    if (this.userService.user.country_name != null || this.userService.user.country_name != undefined) {
      console.log(this.userService.user.country_name);
      this.selectedCountry = this.userService.user.country_name;
      await this.location_service.getStateList(this.selectedCountry);
      if (this.userService.user.state_name != null || this.userService.user.state_name != undefined) {
        this.selectedState = this.userService.user.state_name;
        await this.location_service.getCityList(this.selectedState);
        if (this.userService.user.city_name != null || this.userService.user.city_name != undefined) {
          this.selectedCity = this.userService.user.city_name;
        }
      }
    }
  }


  onEmailInput(event_data) {
    if (this.profileForm.controls['email'].valid == true) {

      if (this.checkingEmail == false) {
        //check for email
        this.checkingEmail = true;
        setTimeout(async () => {
          if (this.profileForm.controls['email'].valid == true) {
            if (this.userService.user.email != this.proposedEmail) {
              this.isUniqueEmailAddress = await this.userService.checkIfEmailisUnique(this.proposedEmail);

              this.checkingEmail = false;
            }
            else {
              this.isUniqueEmailAddress = true;
              this.checkingEmail = false;
            }
          }
          else {
            this.checkingEmail = false;
          }
        }, 2000);

      }
    }
    else {
      this.checkingEmail = false;
    }
  }


  onImageChange(event_data) {
    var reader = new FileReader();
    reader.onload = e => {
      let result_data = e.target.result;
      (<HTMLElement>this.imagePreviewRef.nativeElement).style.backgroundImage = `url(${result_data})`;
    }
    reader.readAsDataURL(event_data.target.files[0]);
  }




  onUsernameInput(event_data) {
    if (this.proposedUsername === null || this.proposedUsername === '' || this.proposedUsername == undefined) {
      return;
    }
    if (this.checkingUsername == false) {
      //check for username
      this.checkingUsername = true;
      setTimeout(async () => {
        if (this.proposedUsername !== null && this.proposedUsername !== '' && this.proposedUsername !== undefined) {
          if (this.userName != this.proposedUsername) {

            this.uniqueUsername = await this.userService.checkForUniqueUsername(this.proposedUsername);
            this.checkingUsername = false;

          }
          else {
            this.uniqueUsername = true;
            this.checkingUsername = false;
          }
        }
        else {
          this.checkingUsername = false;
        }
      }, 2000);
    }
  }




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





  validateAge(event_data) {
    var enteredAge = event_data.target.value;
    let regexExpression: RegExp = /\D/;

    if (regexExpression.test(enteredAge)) {
      this.invalidAge = true;
    }
    else {
      this.invalidAge = false;
    }
  }




  async onCountryChanged(event_data) {
    if (this.selectedCountry != null || this.selectedCountry != undefined) {
      this.selectedCity = undefined;
      this.selectedState = undefined;
      await this.location_service.getStateList(this.selectedCountry);
    }
  }


  async onStateChanged(event_data) {
    if (this.selectedState != null || this.selectedState != undefined) {
      this.selectedCity = undefined;
      this.location_service.getCityList(this.selectedState);
    }
  }




  checkIfSpecialityTagsAreRequired():boolean{
    if(this.selectedRole == 'Doctor'){
      if(this.selectedSpecialities.length > 0){
        return false;
      }
      else{
        return true;
      }
    }
    else{
      return false;
    }
  }


  checkIfLanguageTagsAreRequired():boolean{
    if(this.selectedRole == 'Doctor'){
      if(this.selectedLanguages.length > 0){
        return false;
      }
      else{
        return true;
      }
    }
    else{
      return false;
    }
  }



  async onSubmit() {

    this.submitted = true;


    this.specialityTagIsRequired = this.checkIfSpecialityTagsAreRequired();
    this.languageTagIsRequired = this.checkIfLanguageTagsAreRequired();

    if (this.profileForm.valid && this.isUniqueEmailAddress && !this.invalidAge && !this.invalidMobileNumber && this.uniqueUsername
      && !this.specialityTagIsRequired && !this.languageTagIsRequired) {

      try {

        this.savingProfileData = true;
        this.submitted = false;

        var formData = new FormData();

        if (this.proposedEmail != this.email) {
          formData.append('email', this.proposedEmail);
        }

        formData.append('age', this.profileForm.controls['age'].value);

        if (this.proposedUsername != this.userName) {
          formData.append('username', this.proposedUsername);
        }

        formData.append('name', this.profileForm.controls['user_name'].value);
        formData.append('id', this.userService.user.id.toString());
        if (this.phoneNumber !== null && this.phoneNumber !== undefined) {
          formData.append('phoneNumber', this.phoneNumber);
        }

        formData.append('gender', this.selectedGender);
        formData.append('role', this.selectedRole);

        if (this.selectedCountry !== null && this.selectedCountry !== undefined) {
          var selectedCountry_obj = this.location_service.countryList.find(a => a.country_name == this.selectedCountry);
          formData.append('country_name', this.selectedCountry);
          formData.append('country_short_name', selectedCountry_obj.country_short_name);
          formData.append('country_phone_code', selectedCountry_obj.country_phone_code.toString());
          formData.append('state_name', this.selectedState);
          formData.append('city_name', this.selectedCity);
        }

        formData.append('bloodGroup', this.selectedBlood);

        var selectedFiles = (<HTMLInputElement>this.imageInputRef.nativeElement).files;
        if (selectedFiles.length > 0) {
          var profile_pic_fie = selectedFiles[0];
          formData.append('profilePic', profile_pic_fie, profile_pic_fie.name);
        }

        if (this.selectedRole == 'Doctor') {
          var bmdc_cert_no = this.profileForm.controls['bmdc'].value;
          formData.append('bmdc_certifcate', bmdc_cert_no);
          // formData.append('bmdc_certifcate', bmdc_cert_no);
          // formData.append('bmdc_certifcate', bmdc_cert_no);
          // formData.append('bmdc_certifcate', bmdc_cert_no);


        }



        this.httpClient.post<{
          error_msg: string,
          error: boolean,
          success: boolean,
          role_added: boolean,
          user: {
            age: number, id: number, name: string, username: string, role: string, roles: string[], gender: string, email: string,
            password: string, bloodGroup: string, bmdc_certifcate: string, city_name: string, country_name: string, country_phone_code: number,
            country_short_name: string, state_name: string, phoneNumber: string, approved: boolean
          }
        }>(this._baseUrl + 'api/UserManager/UpdateProfileData', formData, { headers: { 'enctype': 'multipart/form-data' } }).subscribe(result => {
          this.savingProfileData = false;
          console.log(result);
          if (result.success == true) {
            //Do success stuff
            //this.userService.fetchProfilePic(this.userService.user.id);
            //this.userService.tryLoginUser();

            this.userService.user.age = result.user.age;
            this.userService.user.id = result.user.id;
            this.userService.user.email = result.user.email;
            this.userService.user.gender = result.user.gender;
            this.userService.user.name = result.user.name;
            this.userService.user.username = result.user.username;
            this.userService.user.phoneNumber = result.user.phoneNumber;
            this.userService.user.roles = [];
            result.user.roles.forEach(val => {
              this.userService.user.roles.push(val);
            });
            this.userService.roleChanged.emit(this.userService.user.roles);
            this.userService.user.bloodGroup = result.user.bloodGroup;
            this.userService.user.bmdc_certifcate = result.user.bmdc_certifcate;
            this.userService.user.approved = result.user.approved;
            this.userService.user.city_name = result.user.city_name;
            this.userService.user.country_name = result.user.country_name;
            this.userService.user.country_phone_code = result.user.country_phone_code;
            this.userService.user.country_short_name = result.user.country_short_name;
            this.userService.user.state_name = result.user.state_name;
            // console.log(this.user.roles);
            this.userService.fireUserApprovedChangedEvent();
            this.userService.fetchProfilePic(result.user.id);
            this.userService.clearUserData('/');
            this.userService.clearUserData('/admin');
            this.userService.SaveUserCredientials();

          }
          else {
            this.error_msg = result.error_msg;
          }
        }, error => {
          console.error(error);
          this.savingProfileData = false;
        });
      }
      catch (error) {
        console.log(error);
      }


    }
  }


  ProgressProfileComplete(event_data) {
    console.log('input/change event: I am from 2nd event handler');
    console.log(event_data);
  }





  //#region speciality tag

  deleting_tags = false;
  resolveSpecialityTag(){
    if(this.userService.doctorSpecialityTags !== undefined && this.userService.doctorSpecialityTags.length > 0){

      this.allSpecialities = this.userService.doctorSpecialityTags;
      this.suggestedSpecialities = this.allSpecialities.slice();

    }
  }



  onSpecialityChanged(event_data) {

    if (this.selectedSpeciality !== undefined && this.selectedSpeciality !== null && this.selectedSpeciality != -1 && this.deleting_tags == false) {

      var selected_tag = this.suggestedSpecialities.find(a => a.id == this.selectedSpeciality);
      if (selected_tag != null) {
        this.selectedSpecialities.push(selected_tag);
      }
    }
  }

  onSpecialityDeleteClicked(tag_id: number) {
    var selected_tag = this.selectedSpecialities.find(a => a.id == tag_id);
    if (selected_tag !== undefined && selected_tag !== null) {
      var startIndex = this.selectedSpecialities.indexOf(selected_tag);
      this.selectedSpecialities.splice(startIndex, 1);
    }
  }


  //#endregion




  //#region  languages
  resolveLanguages(){
    this.suggestedLanguages = this.userService.languageList;
  }


  onLanguageChanged(event_data){
    if(this.selectedLanguage != undefined && this.selectedLanguage != -1, this.selectedLanguage != null){
      var selected_lang = this.suggestedLanguages.find(a => a.id == this.selectedLanguage);
      if (selected_lang != null) {
        this.selectedLanguages.push(selected_lang);
        this.selectedLanguage = -1;
      }
    }
  }



  onLanguageDeleteClicked(tag_id: number) {
    var selected_tag = this.selectedLanguages.find(a => a.id == tag_id);
    if (selected_tag !== undefined && selected_tag !== null) {
      var startIndex = this.selectedLanguages.indexOf(selected_tag);
      this.selectedLanguages.splice(startIndex, 1);
    }
  }




  //#endregion

}
