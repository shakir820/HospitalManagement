import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Helper } from 'src/app/helper-methods/helper.model';
import { Language } from 'src/app/models/langauge.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
      this._baseUrl = baseUrl;

    }


    _baseUrl: string;
    fetchingDoctorList: boolean = false;
    doctorList: User[] = [];

  ngOnInit(): void {
    this.getDoctorList();
  }




  toggleDoctorListSort(event_data){

  }
  onSearchSubmit(){

  }

  getDoctorList(){
    this.fetchingDoctorList = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      doctor_list: User[],
      error_msg: string
    }>(this._baseUrl + 'api/Appointment/GetAllDoctorList').subscribe(result => {
      console.log(result);
      this.fetchingDoctorList = false;
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
       this.doctor.doctor_title= result.doctor.doctor_title;
       this.doctor.experience = result.doctor.experience;
       this.doctor.gender = result.doctor.gender;
       this.doctor.isActive = result.doctor.isActive;
       this.doctor.languages =[];
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
}
