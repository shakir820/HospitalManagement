import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Language } from 'src/app/models/langauge.model';
import { Speciality } from 'src/app/models/speciality.model';
import { User } from 'src/app/models/user.model';
import { LocationService } from 'src/app/services/location.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit, AfterViewInit {

  constructor(public userService: UserService, private profileService: ProfileService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
  }


  @ViewChild('f') profileForm: NgForm;
  @ViewChild('imageInput', { static: true }) imageInputRef: ElementRef;
  @ViewChild('imagePreview', { static: true }) imagePreviewRef: ElementRef;




  //#region  variables
  //variables

  _baseUrl: string
  submitted: boolean = false;
  checkingUsername: boolean = false;
  username: string;
  proposedUsername: string;
  savingProfileData: boolean = false;
  imgData: any;
  user_name: string;
  unique_username: boolean = true;









  ngOnInit(): void {
    this.username = this.userService.user.username;
    this.proposedUsername = this.userService.user.username;
    this.user_name = this.userService.user.name;
  }




  ngAfterViewInit(): void {
    this.ShowProfileImage();
  }




  ShowProfileImage() {
    (<HTMLElement>this.imagePreviewRef.nativeElement).style.backgroundImage = `url(${this._baseUrl}` +
      'api/usermanager/GetProfilePic?id=' + this.userService.user.id.toString() + ')';
  }



  onImageChange(event_data) {
    var reader = new FileReader();
    reader.onload = e => {
      let result_data = e.target.result;
      (<HTMLElement>this.imagePreviewRef.nativeElement).style.backgroundImage = `url(${result_data})`;
    }
    reader.readAsDataURL(event_data.target.files[0]);
  }




  onUsernameInput(event_data){
    if(this.proposedUsername.length == 0){
      this.unique_username = true;
    }
  }


  onUsernameChanged(event_data){

    if(this.username.length != 0){
      if(this.proposedUsername == this.username){
        return;
      }

      this.checkingUsername = true;
      this.httpClient.get<{
        unique_username: boolean
      }>(this._baseUrl + 'api/usermanager/CheckForUniqueUsername', {params: {username: this.proposedUsername}}).subscribe(result =>{
        this.checkingUsername = false;
        this.unique_username =result.unique_username;

      });
    }


  }




  onFormSubmit(){
    if(this.profileForm.valid && this.unique_username == true){
      this.savingProfileData = true;

      var formData = new FormData();
      formData.append('id', this.userService.user.id.toString());
      formData.append('username', this.proposedUsername);
      formData.append('name', this.user_name);

      var selectedFiles = (<HTMLInputElement>this.imageInputRef.nativeElement).files;

      if (selectedFiles.length > 0) {
        var profile_pic_fie = selectedFiles[0];
        formData.append('profilePic', profile_pic_fie, profile_pic_fie.name);
      }


      this.httpClient.post<{
        success: boolean,
        error: boolean,
        error_msg: string,
        user: User
      }>(this._baseUrl + 'api/Admin/UpdateAdminProfile', formData,  { headers: { 'enctype': 'multipart/form-data' } }).subscribe(result => {
        this.savingProfileData = false;
        console.log(result);

        if(result.success){
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile saved'
          });


          this.userService.user.name = result.user.name;
          this.userService.user.username = result.user.username;

          this.userService.fetchProfilePic(this.userService.user.id);
          this.userService.clearUserData('/');
          this.userService.clearUserData('/admin');
          this.userService.SaveUserCredientials();
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: result.error_msg
          });
        }
      },
      error => {
        this.savingProfileData = false;
        console.log(error);
      });

    }

  }





}
