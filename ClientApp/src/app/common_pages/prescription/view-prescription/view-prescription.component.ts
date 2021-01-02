import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DoctorAppointment } from 'src/app/models/doctor-appointment.model';
import { InvestigationDoc, Prescription, PrescriptionMedicine, PrescriptionNote, PrescriptionPatientComplain, PrescriptionPatientExamination } from 'src/app/models/prescription.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-prescription',
  templateUrl: './view-prescription.component.html',
  styleUrls: ['./view-prescription.component.css']
})
export class ViewPrescriptionComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private route: ActivatedRoute) {
    this._baseUrl = baseUrl;
  }


  _baseUrl: string;
  prescription: Prescription;
  appointment_id: number;
  prescription_id: number;


  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.appointment_id = params['appointment_id'];
      this.prescription_id = params['prescription_id'];

      console.log(this.prescription_id);
      if (this.prescription_id != undefined && this.prescription_id != NaN && this.prescription_id != null) {
        this.getPrescriptionDataByPrescriptionId();
      }
      else {
        this.getPrescriptionDataByAppointmentId();
      }
    });

  }




  getPrescriptionDataByPrescriptionId() {
    console.log("Getting Prescription data");
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      prescription: Prescription,
      error_msg: string
    }>(this._baseUrl + 'api/Prescription/GetPrescriptionById', { params: { prescription_id: this.prescription_id.toString() } }).subscribe(result => {
      console.log(result);
      if (result.success) {
        this.prescription = result.prescription;
      }
      else {

        Swal.fire({
          title: 'Error!',
          text: result.error_msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    },
      error => {
      });
  }



  getPrescriptionDataByAppointmentId() {
    console.log("Getting Prescription data");
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      prescription: Prescription,
      error_msg: string
    }>(this._baseUrl + 'api/Prescription/GetPrescriptionByAppointmentId', { params: { appointment_id: this.appointment_id.toString() } }).subscribe(result => {
      console.log(result);
      if (result.success) {

        this.prescription = result.prescription;
      }
      else {

        Swal.fire({
          title: 'Error!',
          text: result.error_msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    },
      error => {
      });
  }


}
