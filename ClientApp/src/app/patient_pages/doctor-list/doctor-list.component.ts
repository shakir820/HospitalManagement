import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { Helper } from 'src/app/helper-methods/helper.model';
import { Language } from 'src/app/models/langauge.model';
import { Speciality } from 'src/app/models/speciality.model';
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
    @Inject('BASE_URL') baseUrl: string,
    private router: Router) {
      this._baseUrl = baseUrl;

    }


    _baseUrl: string;
    fetchingDoctorList: boolean = false;
    doctorList: User[] = [];
    allDoctorList: User[] = [];
    allSpecialities: Speciality[] = [];
    search_string:string;
    selectedTag: number;
    ascending_sort: boolean = true;
  ngOnInit(): void {
    this.getDoctorList();
    this.resolveSpecialityTag();
  }




  toggleDoctorListSort(event_data){
    this.ascending_sort = !this.ascending_sort;
    this.doctorList = this.sortDoctorList(this.doctorList);
  }




  specialityTagChanged(event_data){
    console.log('Tag select changed');
    this.search_string = null
    if(this.selectedTag == 0){
      var doctor_List = this.allDoctorList.slice();
      this.doctorList = this.sortDoctorList(doctor_List);
    }
    else{
      var doc_List = [];
      this.allDoctorList.forEach(doctor => {
        var specialities = doctor.specialities.filter(val => {
          if(val.id == this.selectedTag) return val;
        });
        if(specialities.length > 0){
          doc_List.push(doctor);
        }
      });
      this.doctorList = this.sortDoctorList(doc_List);
    }
  }




  onSearchSubmit(){

    var filtered_doc_list = [];

    if(this.selectedTag == 0){
      filtered_doc_list = this.allDoctorList.slice();
    }
    else{

      this.allDoctorList.forEach(doctor => {
        var specialities = doctor.specialities.filter(val => {
          if(val.id == this.selectedTag) return val;
        });
        if(specialities.length > 0){
          filtered_doc_list.push(doctor);
        }
      });
    }




    filtered_doc_list = filtered_doc_list.filter((val:User) => {
      var search_param = this.search_string.toUpperCase();
      if (val.name.toUpperCase().includes(search_param)) {
        return val;
      }
    });

    this.doctorList = this.sortDoctorList(filtered_doc_list);
    //this.doctorList = filtered_doc_list;
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
        Helper.resolveDoctorListResult(result.doctor_list, this.allDoctorList);
        var doc_list = this.allDoctorList.slice();
        this.doctorList = this.sortDoctorList(doc_list);
      }
    });
  }






  resolveSpecialityTag() {
    if (this.userService.doctorSpecialityTags != undefined && this.userService.doctorSpecialityTags.length > 0) {
      var all_speciality = new Speciality();
      all_speciality.id = 0;
      all_speciality.specialityName = 'All';
      this.allSpecialities.push(all_speciality);
      var sorted_speciality_tags = this.userService.doctorSpecialityTags.sort(sortBy('specialityName'));
      this.allSpecialities.push(...sorted_speciality_tags);
      this.selectedTag = 0;
    }
  }






  sortDoctorList(list:User[]){
    var sorted_list = [];
    if(this.ascending_sort == true){
      sorted_list = list.sort(sortBy('name'));
    }
    else{
      sorted_list = list.sort(sortBy('-name'));
    }
    return sorted_list;
  }




  getAppointment(event_data, doctor_id:number){
    this.router.navigate(['Appointment/NewAppointment'], {queryParams: {id: doctor_id}});
  }
}
