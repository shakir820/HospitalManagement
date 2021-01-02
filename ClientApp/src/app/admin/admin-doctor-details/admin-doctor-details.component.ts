import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Helper } from 'src/app/helper-methods/helper.model';
import { Language } from 'src/app/models/langauge.model';
import { Schedule } from 'src/app/models/schedule.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-doctor-details',
  templateUrl: './admin-doctor-details.component.html',
  styleUrls: ['./admin-doctor-details.component.css']
})
export class AdminDoctorDetailsComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.doctor_id = +params['id'];
    });

    this.getDoctorInfo();


  }


  doctor_status: string;
  doctor_id: number;
  _baseUrl: string;
  @ViewChild('imagePreview', { static: true }) imagePreviewRef: ElementRef;
  fetchingDoctorDetails: boolean = false;
  doctor: User = new User();


  ShowProfileImage() {
    (<HTMLElement>this.imagePreviewRef.nativeElement).style.backgroundImage = `url(${this._baseUrl}` +
      'api/usermanager/GetProfilePic?id=' + this.doctor_id.toString() + ')';
  }



  getDoctorInfo() {
    this.fetchingDoctorDetails = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      doctor: User,
      error_msg: string
    }>(this._baseUrl + 'api/admin/GetDoctor', { params: { id: this.doctor_id.toString() } }).subscribe(result => {
      console.log(result);
      this.fetchingDoctorDetails = false;
      if (result.success) {

        this.doctor.username = result.doctor.username;
        this.doctor.email = result.doctor.email;
        this.doctor.id = result.doctor.id;
        this.doctor.age = result.doctor.age;
        this.doctor.approved = result.doctor.approved;
        this.doctor.biography = result.doctor.biography;
        this.doctor.bloodGroup = result.doctor.bloodGroup;
        this.doctor.bmdc_certifcate = result.doctor.bmdc_certifcate;
        this.doctor.city_name = result.doctor.city_name;
        this.doctor.country_name = result.doctor.country_name;
        this.doctor.country_phone_code = result.doctor.country_phone_code;
        this.doctor.country_short_name = result.doctor.country_short_name;
        this.doctor.degree_title = result.doctor.degree_title;
        this.doctor.doctor_title = result.doctor.doctor_title;
        this.doctor.experience = result.doctor.experience;
        this.doctor.gender = result.doctor.gender;
        this.doctor.isActive = result.doctor.isActive;
        this.doctor.languages = [];
        result.doctor.languages.forEach(val => {
          var lang = new Language();
          lang.id = val.id;
          lang.languageName = val.languageName;
          this.doctor.languages.push(lang);
        });
        this.doctor.name = result.doctor.name;
        this.doctor.new_patient_visiting_price = result.doctor.new_patient_visiting_price;
        this.doctor.old_patient_visiting_price = result.doctor.old_patient_visiting_price;
        this.doctor.phoneNumber = result.doctor.phoneNumber;
        this.doctor.roles = [];
        result.doctor.roles.forEach(val => {
          this.doctor.roles.push(val);
        });
        this.doctor.schedules = [];
        Helper.resolveScheduleResult(result.doctor.schedules, this.doctor.schedules);
        this.doctor.specialities = [];
        Helper.resolveSpecialitiesResult(result.doctor.specialities, this.doctor.specialities);
        this.doctor.state_name = result.doctor.state_name;
        this.doctor.types_of = result.doctor.types_of;
        this.resolveDoctorStatus();
        this.ShowProfileImage();
      }
    });
  }


  resolveDoctorStatus() {
    if (this.doctor.isActive == true) {
      if (this.doctor.approved == true) {
        this.doctor_status = "Approved";
      }
      else {
        this.doctor_status = "Not Approved";
      }
    }
    else {
      this.doctor_status = "Inactive";
    }
  }






  // action methods
  approveDoctor(event_data) {
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/ApproveDoctor', { params: { id: this.doctor_id.toString() } }).subscribe(result => {
        if (result.success) {
          this.doctor.approved = true;
        }
      });
  }


  unApproveDoctor(event_data) {
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/UnapproveDoctor', { params: { id: this.doctor_id.toString() } }).subscribe(result => {
        if (result.success) {
          this.doctor.approved = false;
        }
      });
  }


  activeDoctor(event_data) {
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/ActivateUser', { params: { id: this.doctor_id.toString() } }).subscribe(result => {
        if (result.success) {
          this.doctor.isActive = true;
        }
      });
  }

  inActiveDoctor(event_data) {
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/DeactivateUser', { params: { id: this.doctor_id.toString() } }).subscribe(result => {
        if (result.success) {
          this.doctor.isActive = false;
        }
      });
  }

}
