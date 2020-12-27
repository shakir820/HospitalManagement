import { WeekDay } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, Data } from '@angular/router';
import { Helper } from 'src/app/helper-methods/helper.model';
import { DoctorAppointment } from 'src/app/models/doctor-appointment.model';
import { Language } from 'src/app/models/langauge.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Schedule } from '../../models/schedule.model';

@Component({
  selector: 'app-doctor-appointment',
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css']
})
export class DoctorAppointmentComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private route: ActivatedRoute) {
    this._baseUrl = baseUrl;

  }


  _baseUrl: string;
  doctor_id: number;
  fetchingDoctorDetails: boolean = false;
  doctor: User = new User();
  fetchingScheduleInfo: boolean = false;
  availableDates: Date[] = [];
  unavailableDates: Date[] = [];
  selectedDate: Date;
  can_create_appointment: boolean = false;
  existedAppointments: DoctorAppointment[];
  userAppointments: DoctorAppointment[];
  isEnableConfirmBtn: boolean = false;
  confirmingSchedule: boolean = false;
  error_msg: string;
  isScheduleConfirmed: boolean = false;
  gettingAppointmentSerialNo: boolean = false;




  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.doctor_id = Number.parseInt(params['id']);
      this.getDoctorInfo();
      this.getDoctorSchedules();
    });
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
      }
    });
  }




  getDoctorSchedules() {
    this.fetchingScheduleInfo = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      available_dates: Data[],
      unavailable_dates: Data[],
      can_create_new_appointment: boolean,
      appointments: DoctorAppointment[],
      schedules: Schedule[]
    }>(this._baseUrl + 'api/Appointment/GeAvailableAppointmentDates',
      { params: { doctor_id: this.doctor_id.toString(), user_id: this.userService.user.id.toString() } }).subscribe(result => {
        console.log(result);
        this.fetchingScheduleInfo = false;
        if (result.success) {

          if (result.available_dates != undefined) {
            result.available_dates.forEach((val) => {
              this.availableDates.push(<Date>val);
            });
          }
          if (result.unavailable_dates != undefined) {
            result.unavailable_dates.forEach(val => {
              this.unavailableDates.push(<Date>val);
            });
          }

          this.can_create_appointment = result.can_create_new_appointment;
          this.existedAppointments = [];
          if (result.appointments != undefined && result.appointments.length > 0) {
            // Helper.resolveAppointments(result.appointments, this.existedAppointments);
            this.existedAppointments = result.appointments;
          }

          // if (this.existedAppointments.length > 0) {
          //   this.existedAppointments.forEach(val => {
          //     var week_day = val.appointment_date.getDay();
          //     var schedules_obj = result.schedules.find(schedule_val => {
          //       if (schedule_val.day_name == week_day) {
          //         return schedule_val;
          //       }
          //     });

          //     if (schedules_obj != null) {
          //       val.start_time = new Date(schedules_obj.start_time);
          //       val.end_time = new Date(schedules_obj.end_time);
          //     }

          //   });
          // }

        }
      });
  }



  dateSelected(event_data) {

    this.isEnableConfirmBtn = false;
    this.getAppointmentInfoOnSelectedDate();
  }






  getAppointmentInfoOnSelectedDate() {
 this.gettingAppointmentSerialNo = true;
    this.httpClient.post<{
      success: boolean,
      error: boolean,
      error_msg: string,
      serial_no: number,
      visiting_price,
      appointments: DoctorAppointment[]
    }>(this._baseUrl + 'api/Appointment/GetAppointmentSerialNo',
      {
        doctor_id: this.doctor_id,
        patient_id: this.userService.user.id,
        appointment_date: this.selectedDate
      }).subscribe(result => {
        console.log(result);
        this.gettingAppointmentSerialNo = false;
        this.fetchingScheduleInfo = false;
        this.userAppointments = [];
        if (result.success) {
          this.existedAppointments = [];
          var appointment_date = new Date(this.selectedDate);
          var ap = new DoctorAppointment();
          ap.appointment_date = appointment_date;
          ap.doctor_id = this.doctor_id;
          ap.doctor_name = this.doctor.name;
          var schedules_obj = this.doctor.schedules.find(schedule_val => {
            if (schedule_val.day_name == appointment_date.getDay()) {
              return schedule_val;
            }
          });
          if (schedules_obj != null) {
            ap.start_time = new Date(schedules_obj.start_time);
            ap.end_time = new Date(schedules_obj.end_time);
          }
          ap.patient_id = this.userService.user.id;
          ap.patient_name = this.userService.user.name;
          ap.serial_no = result.serial_no;
          ap.visiting_price = result.visiting_price;
          this.existedAppointments.push(ap);

          if (result.appointments != undefined) {
            // result.appointments.forEach(r_ap => {
            //   var appointment = new DoctorAppointment();
            //   appointment.appointment_date = new Date(r_ap.appointment_date);
            //   appointment.created_date = new Date(r_ap.created_date);
            //   appointment.doctor_id = r_ap.doctor_id;
            //   appointment.doctor_name = r_ap.doctor_name;
            //   appointment.start_time = new Date(r_ap.start_time);
            //   appointment.end_time = new Date(r_ap.end_time);
            //   appointment.id = r_ap.id;
            //   appointment.patient_id = r_ap.patient_id;
            //   appointment.patient_name = r_ap.patient_name;
            //   appointment.serial_no = r_ap.serial_no;
            //   this.userAppointments.push(appointment);

            // });
            this.userAppointments = result.appointments;
          }
          this.isEnableConfirmBtn = true;

        }
        else {

        }
      });
  }




  onConfirmBtnClicked() {
    if (this.selectedDate != undefined) {
      var appointment_date = new Date(this.selectedDate);
      console.log(appointment_date);
      var appointment = new DoctorAppointment();
      appointment.appointment_date_str = appointment_date.toISOString();
      console.log(appointment.appointment_date_str);
      appointment.doctor_id = this.doctor_id;
      appointment.doctor_name = this.doctor.name;
      appointment.patient_id = this.userService.user.id;
      appointment.patient_name = this.userService.user.name;
      appointment.visiting_price = this.existedAppointments[0].visiting_price;
      this.confirmingSchedule = true;
      this.isEnableConfirmBtn = false;

      this.httpClient.post<{
        success: boolean,
        error: boolean,
        error_msg: string
      }>(this._baseUrl + 'api/Appointment/ConfirmAppointment',
        appointment).subscribe(result => {
          console.log(result);

          this.confirmingSchedule = false;
          if (result.success) {
            this.isEnableConfirmBtn = false;
            this.isScheduleConfirmed = true;

            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Appointment confirmed'
            });
          }
          else {
            this.isEnableConfirmBtn = true;
            this.error_msg = result.error_msg;
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text:  result.error_msg
            });
          }
        });
    }
  }



}
