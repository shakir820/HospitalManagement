import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { DoctorAppointment } from 'src/app/models/doctor-appointment.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private route: ActivatedRoute) {
    this._baseUrl = baseUrl;

  }


  _baseUrl: string;
  fetchingAppointments: boolean = false;
  appointmentList: DoctorAppointment[];
  filteredAppointmentList: DoctorAppointment[];
  cancelingAllAppointments: boolean = false;
  error_msg: string;
  search_string: string;
  sortByAsscending: boolean = true;
  sortOrderBy: string = 'Date';

  ngOnInit(): void {
    this.appointmentList = [];
    this.filteredAppointmentList = [];
    this.getAppointments();
  }




  onCancelAppointmentClicked(event_data, appointment_id: number){
    this.error_msg = undefined;
    this.httpClient.post<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/Appointment/CancelAppointment', { id: appointment_id }).subscribe(result => {
      console.log(result);

      if (result.success) {
        var element_index = this.appointmentList.findIndex(a => a.id == appointment_id);
        this.appointmentList.splice(element_index, 1);
        var element_index = this.filteredAppointmentList.findIndex(a => a.id == appointment_id);
        if(element_index != undefined){
          this.filteredAppointmentList.splice(element_index, 1);
        }

        Swal.fire({
          title: 'Success!',
          text: 'Appointment cancelled',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }
      else {
        this.error_msg = result.error_msg;
        Swal.fire({
          title: 'Error!',
          text: result.error_msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }



  appointmentSearchOnInput(event_data){
    if(this.search_string.length == 0){
      this.filteredAppointmentList = this.appointmentList.slice();
    }
  }


  onViewPrescriptionClicked(event_data, appointment_id: number){
    this.router.navigate(['Prescription/ViewPrescription'], {queryParams: {appointment_id: appointment_id}});
  }










  sortAppointmentList(event_data, order_name: string) {
    switch (order_name) {
      case 'Date':
        if (this.sortOrderBy == order_name) {
          this.sortByAsscending = !this.sortByAsscending;
        }
        if (this.sortByAsscending) {
          this.filteredAppointmentList.sort(sortBy('appointment_date'));
        }
        else {
          this.filteredAppointmentList.sort(sortBy('-appointment_date'));
        }
        break;

      case 'Doctor':
        if (this.sortOrderBy == order_name) {
          this.sortByAsscending = !this.sortByAsscending;
        }
        if (this.sortByAsscending) {
          this.filteredAppointmentList.sort(sortBy('doctor_name'));
        }
        else {
          this.filteredAppointmentList.sort(sortBy('-doctor_name'));
        }
        break;

      case 'Serial':
        if (this.sortOrderBy == order_name) {
          this.sortByAsscending = !this.sortByAsscending;
        }
        if (this.sortByAsscending) {
          this.filteredAppointmentList.sort(sortBy('serial_no'));
        }
        else {
          this.filteredAppointmentList.sort(sortBy('-serial_no'));
        }
        break;


      case 'Price':
        if (this.sortOrderBy == order_name) {
          this.sortByAsscending = !this.sortByAsscending;
        }
        if (this.sortByAsscending) {
          this.filteredAppointmentList.sort(sortBy('visiting_price'));
        }
        else {
          this.filteredAppointmentList.sort(sortBy('-visiting_price'));
        }
        break;
    }


    this.sortOrderBy = order_name;
  }





  onSearchSubmit() {
    if (this.search_string != undefined) {
      if (this.search_string.replace(/\s/g, '').length) {
        var sk = this.search_string.toUpperCase();
        this.filteredAppointmentList = this.appointmentList.filter(a => a.doctor_name.toUpperCase().includes(sk));
      }
    }
  }







  getAppointments() {

    this.error_msg = undefined;
    this.fetchingAppointments = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      appointments: DoctorAppointment[],
      error_msg: string
    }>(this._baseUrl + 'api/Appointment/GetAppointmentsByPatient', { params: { patient_id: this.userService.user.id.toString() } }).subscribe(result => {
      console.log(result);
      this.fetchingAppointments = false;
      if (result.success) {
        this.appointmentList = [];
        if (result.appointments != undefined) {
          this.appointmentList = result.appointments;
          // result.appointments.forEach(val => {

          //   var appointment = new  DoctorAppointment();
          //   appointment.appointment_date = new Date(val.appointment_date_str);
          //   appointment.created_date = new Date(val.created_date);
          //   appointment.doctor_id = val.doctor_id;
          //   appointment.doctor_name = val.doctor_name;
          //   appointment.end_time = new Date(val.end_time);
          //   appointment.id = val.id;
          //   appointment.patient_id = val.patient_id;
          //   appointment.patient_name = val.patient_name;
          //   appointment.serial_no = val.serial_no;
          //   appointment.visiting_price = val.visiting_price;
          //   appointment.start_time = new Date(val.start_time);
          //   this.appointmentList.push(appointment);

          // });

        }

        if (this.appointmentList.length > 0) {
          this.filteredAppointmentList = this.appointmentList.slice();
          this.filteredAppointmentList.sort(sortBy('appointment_date'));
        }
      }
      else {
        this.error_msg = result.error_msg;
      }
    });
  }

  onCancelBtnClicked(event_data) {
    this.error_msg = undefined;
    this.cancelingAllAppointments = true;
    this.httpClient.post<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/Appointment/CancelAllAppointmentsByPatient', { id: this.userService.user.id }).subscribe(result => {
      console.log(result);

      this.cancelingAllAppointments = false;
      if (result.success) {
        this.appointmentList = [];
        this.filteredAppointmentList = this.appointmentList;
        Swal.fire({
          title: 'Success!',
          text: 'All appointments are cancelled',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }
      else {
        this.error_msg = result.error_msg;
        Swal.fire({
          title: 'Error!',
          text: result.error_msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }








}
