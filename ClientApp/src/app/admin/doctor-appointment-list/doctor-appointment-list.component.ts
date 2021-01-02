import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { DoctorAppointment } from 'src/app/models/doctor-appointment.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-appointment-list',
  templateUrl: './doctor-appointment-list.component.html',
  styleUrls: ['./doctor-appointment-list.component.css']
})
export class DoctorAppointmentListComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private route: ActivatedRoute) {
    this._baseUrl = baseUrl;
  }


  user_id: number;
  _baseUrl: string;
  fetchingUserDetails: boolean = false;
  user: User;
  isDoctor: boolean = false;
  isInvestigator: boolean = false;
  isStaff: boolean = false;
  selected_date: string;
  fetchingAppointments: boolean = false;
  appointment_list: DoctorAppointment[];
  showAppointmentList: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      var uid = params['user_id'];
      this.user_id = Number.parseFloat(uid);
    });
    this.getUserDetails();
  }



  onPatientClick(event_data, patient_id: number){
    this.router.navigate(['admin/UserDetails'], {queryParams: {user_id: patient_id}});
  }




  getUserDetails(){
    this.fetchingUserDetails = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      user: User
    }>(this._baseUrl + 'api/admin/GetUserDetails', {params: {user_id: this.user_id.toString()}}).subscribe(result => {
      this.fetchingUserDetails = true;
      if(result.success){
        this.user = result.user;

        var doc_role = this.user.roles.find(a => a == 'Doctor');
        if(doc_role != undefined){
          this.isDoctor = true;
        }

        var inv_role = this.user.roles.find(a => a == 'Investigator');
        if(inv_role != undefined){
          this.isInvestigator = true;
        }


        var staff_role = this.user.roles.find(a => a == 'Staff');
        if(staff_role != undefined){
          this.isStaff = true;
        }
      }
    },
    error => {
      this.fetchingUserDetails = false;
      console.log(error);
    });
  }




  onSubmit(){
    console.log(this.selected_date);
    if(this.selected_date.length > 0){
       this.fetchingAppointments = true;
       this.showAppointmentList = false;
       var sd = (new Date(this.selected_date)).toLocaleDateString();

       this.httpClient.get<{
         success: boolean,
         error: boolean,
         error_msg: string,
         appointments: DoctorAppointment[]
       }>(this._baseUrl + 'api/Admin/GetDoctorAppointmentList', {params: {selected_date: sd, doctor_id: this.user_id.toString() }}).subscribe(result => {
         this.fetchingAppointments = false;
         if(result.success){
           this.appointment_list = result.appointments;
           this.appointment_list.sort(sortBy('serial_no'));
           this.showAppointmentList = true;
         }
         else{
           Swal.fire({
             icon: 'error',
             title: 'Error!',
             text: result.error_msg
           });
         }
       });
    }
  }

}
