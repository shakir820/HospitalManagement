import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { DoctorAppointment } from 'src/app/models/doctor-appointment.model';
import { InvestigationDoc } from 'src/app/models/investigation-doc.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private route: ActivatedRoute) {
    this._baseUrl = baseUrl;
  }


  _baseUrl: string;
  patient_id: number;
  patient:User;
  fetchingPatientDetails: boolean = false;
  fetchingAppointmentList: boolean = false;
  fetchingInvestigationList: boolean = false;
  appointmentList:DoctorAppointment[];
  investigationGroupList: {group_name: string, investigations: InvestigationDoc[] }[];





  ngOnInit(): void {
    this.route.queryParams.subscribe((params:Params) => {
       this.patient_id = params['patient_id'];
    });
    console.log(this.patient_id);
    this.getPatientDetails();
    this.getPatientAppointmentList();
    this.getAllInvestigations();
  }




  getPatientDetails(){
    this.fetchingPatientDetails = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      patient: User,
      error_msg: string
    }>(this._baseUrl + 'api/doctor/GetPatientDetails', {params: {patient_id: this.patient_id.toString()}}).subscribe(result => {
      console.log(result);
      this.fetchingPatientDetails = false;
      if (result.success) {

        this.patient = new User();
        this.patient.username = result.patient.username;
        this.patient.id = result.patient.id;
        this.patient.age  =result.patient.age;
        this.patient.bloodGroup = result.patient.bloodGroup;
        this.patient.city_name = result.patient.city_name;
        this.patient.country_name = result.patient.country_name;
        this.patient.country_phone_code = result.patient.country_phone_code;
        this.patient.country_short_name = result.patient.country_short_name;
        this.patient.email = result.patient.email;
        this.patient.gender = result.patient.gender;
        this.patient.isActive = result.patient.isActive;
        this.patient.name = result.patient.name;
        this.patient.phoneNumber =result.patient.phoneNumber;
        this.patient.roles = [];
        result.patient.roles.forEach(val => {
          this.patient.roles.push(val);
        });
        this.patient.state_name = result.patient.state_name;
      }
    },
    error => {
      this.fetchingPatientDetails = false;
    });
  }




  getPatientAppointmentList(){
    this.fetchingAppointmentList = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      appointments:DoctorAppointment[],
      error_msg: string
    }>(this._baseUrl + 'api/Appointment/GetPatientAllAppointmentList', {params: {patient_id: this.patient_id.toString()}}).subscribe(result => {
      console.log(result);
      this.fetchingAppointmentList = false;
      if (result.success) {

        this.appointmentList = [];

        result.appointments.forEach(doc_app => {
          var appointment = new DoctorAppointment();
          appointment.appointment_date  = new Date(doc_app.appointment_date);
          appointment.consulted = true;
          appointment.created_date = new Date(doc_app.created_date);
          appointment.doctor_id = doc_app.doctor_id;
          appointment.doctor_name = doc_app.doctor_name;
          appointment.end_time = new Date(doc_app.end_time);
          appointment.id = doc_app.id;
          appointment.patient_id = doc_app.patient_id;
          appointment.patient_name = doc_app.patient_name;
          appointment.serial_no = doc_app.serial_no;
          appointment.start_time = new Date(doc_app.start_time);
          appointment.visiting_price = doc_app.visiting_price;

          this.appointmentList.push(appointment);
        });

        this.appointmentList.sort(sortBy('appointment_date'));
      }
    },
    error => {
      this.fetchingAppointmentList = false;
    });
  }






  getAllInvestigations(){
    this.fetchingInvestigationList = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      investigations:InvestigationDoc[],
      error_msg: string
    }>(this._baseUrl + 'api/Investigation/GetAllInvestigationsByPatient', {params: {patient_id: this.patient_id.toString()}}).subscribe(result => {
      console.log(result);
      this.fetchingInvestigationList = false;
      if (result.success) {

        this.investigationGroupList = [];

        result.investigations.forEach(inv => {
         var investigation = new InvestigationDoc();
         investigation.abbreviation = inv.abbreviation;
         investigation.created_date = new Date(inv.created_date);
         investigation.doctor_id = inv.doctor_id;
         //investigation.file_location = inv.file_location;
         investigation.id = inv.id;
         investigation.investigation_tag_id = inv.investigation_tag_id;
         investigation.investigator_id = inv.investigator_id;
         investigation.name = inv.name;
         investigation.patient_id = inv.patient_id;
         investigation.prescription_id = inv.prescription_id;

         var test_item = this.investigationGroupList.find( a => a.group_name == investigation.abbreviation);
         if(test_item != undefined || test_item != null){
           test_item.investigations.push(investigation);
         }
         else{
           var gp = {
             group_name: investigation.abbreviation,
             investigations: []
            };
            gp.investigations.push(investigation);
            this.investigationGroupList.push(gp);
         }
        });
        console.log(this.investigationGroupList);
      }
    },
    error => {
      this.fetchingInvestigationList = false;
    });
  }
}
