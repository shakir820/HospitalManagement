import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorAppointment } from '../models/doctor-appointment.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router) {
    this._baseUrl = baseUrl;
  }
  // constructor( private userService: UserService) { }

  _baseUrl: string;
  isApproved:boolean = false;
  isDoctor:boolean = false;
  isPatient: boolean = false;
  isInvestigator: boolean = false;
  todayTime: Date = new Date (Date.now());
  fethingAppointments: boolean = false;
  todayAppointments: DoctorAppointment[] = [];
  upcomingAppointments: DoctorAppointment[] = [];
  doctors:User[] = [];
  total_patient_count: number;
  patient_served_count: number;
  total_investigations: number;
  total_appointments: number;
  pending_investigations: number;
  completed_investigations: number;
  patient_total_documents: number;

  ngOnInit(): void {

    this.isApproved = this.userService.user.approved;

  if(this.userService.user.roles.length > 0){

        var uroles = this.userService.user.roles;
        var doctorRole = uroles.find(a=>a == 'Doctor');
        if(doctorRole){
          this.isDoctor = true;
        }
        else{
          this.isDoctor = false;
        }

        var patientRole = uroles.find(a=>a == 'Patient');
        if(patientRole){
          this.isPatient = true;
        }
        else{
          this.isPatient = false;
        }

        var investigatorRole = uroles.find(a=>a == 'Investigator');
        if(investigatorRole){
          this.isInvestigator = true;
        }
        else{
          this.isInvestigator = false;
        }
      }


    this.userService.approvedChanged.subscribe((val)=>{
      this.isApproved = val;
    });

    this.userService.roleChanged.subscribe((roles: string[])=>{
      this.isPatient = false;
      this.isInvestigator = false;
      this.isDoctor= false;

      if(roles.length > 0){

        var doctorRole = roles.find(a=>a == 'Doctor');
        if(doctorRole){
          this.isDoctor = true;
        }
        else{
          this.isDoctor = false;
        }

        var patientRole = roles.find(a=>a == 'Patient');
        if(patientRole){
          this.isPatient = true;
        }
        else{
          this.isPatient = false;
        }

        var investigatorRole = roles.find(a=>a == 'Investigator');
        if(investigatorRole){
          this.isInvestigator = true;
        }
        else{
          this.isInvestigator = false;
        }
      }
    });


    if(this.isDoctor){
      this.getTodayAppointmentsByDoctor();
      this.getPatientInfoByDoctor();
    }

    if(this.isPatient){
      this.getUpcomingAppointmentsByPatient();
      this.getDoctorList();
      this.GetPatientSummaryInfo();
    }



    if(this.isInvestigator){
      this.getInvestigationSummaryByInvestigator();
    }




  }







  getInvestigationSummaryByInvestigator(){
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      total_investigations: number,
      pending_investigations: number,
      completed_investigations: number
    }>(this._baseUrl + 'api/Investigation/GetInvestigationSummaryByInvestigator', { params: {investigator_id: this.userService.user.id.toString() } }).subscribe(result => {

      if(result.success){
        this.total_investigations = result.total_investigations;
        this.pending_investigations = result.pending_investigations;
        this.completed_investigations = result.completed_investigations;
      }
    },
    error => {
    });
  }




  onViewProfileClicked(event_data){
    this.router.navigate(['/profile']);
  }





  onGetAppointmentBtnClicked(event_data){
    this.router.navigate(['/DoctorList']);
  }






  GetPatientSummaryInfo(){
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      total_appointments: number,
      total_investigations: number,
      total_documents: number
    }>(this._baseUrl + 'api/UserManager/GetPatientSummaryInfo', { params: {patient_id: this.userService.user.id.toString() } }).subscribe(result => {

      if(result.success){
        this.total_appointments = result.total_appointments;
        this.total_investigations = result.total_investigations;
        this.patient_total_documents = result.total_documents;
      }
    },
    error => {
    });
  }


  getDoctorList(){

    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      doctor_list: User[]
    }>(this._baseUrl + 'api/Doctor/GetAllDoctors').subscribe(result => {

      if(result.success){
        this.doctors = result.doctor_list;
      }
    },
    error => {
    });
  }




  getUpcomingAppointmentsByPatient(){
    this.fethingAppointments = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      appointment_list: DoctorAppointment[]
    }>(this._baseUrl + 'api/appointment/GetUpcomingAppointmentsByPatient', {params: { patient_id: this.userService.user.id.toString() }}).subscribe(result => {
      this.fethingAppointments = false;
      if(result.success){
        this.upcomingAppointments = result.appointment_list;
      }
    },
    error => {
      this.fethingAppointments = false;
    });
  }




  getTodayAppointmentsByDoctor(){
    this.fethingAppointments = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      appointment_list: DoctorAppointment[]
    }>(this._baseUrl + 'api/appointment/GetTodayAppointmentsByDoctor', {params: { doctor_id: this.userService.user.id.toString() }}).subscribe(result => {
      this.fethingAppointments = false;
      if(result.success){
        this.todayAppointments = result.appointment_list;
      }
    },
    error => {
      this.fethingAppointments = false;
    });
  }



  getPatientInfoByDoctor(){
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      patient_served_count: number,
      total_patient_count: number
    }>(this._baseUrl + 'api/UserManager/GetPatientInfoByDoctor', {params: { doctor_id: this.userService.user.id.toString() }}).subscribe(result => {
      if(result.success){
        this.patient_served_count = result.patient_served_count;
        this.total_patient_count = result.total_patient_count;
      }

    },
    error => {
    });
  }




}
