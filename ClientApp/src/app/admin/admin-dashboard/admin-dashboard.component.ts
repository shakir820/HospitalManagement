import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  _baseUrl: string;
  total_patient: number;
  total_staff: number;
  total_doctor: number;
  completed_investigation: number;
  inprogress_investigation: number;
  pending_investigation: number;
  total_pending_doctor: number;
  fetchingSummary: boolean;


  todayTime: Date = new Date(Date.now());

  ngOnInit(): void {

    this.getAdminSummary();

  }




  getAdminSummary(){
    this.fetchingSummary = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      error_msg: string,
      total_completed_investigation: number,
      total_inprogress_investigation: number,
      total_pending_investigation: number,
      total_pending_doctor: number,
      total_patient: number,
      total_doctor: number,
      total_staff: number
    }>(this._baseUrl + 'api/Admin/GetAdminSummary').subscribe(result => {
      this.fetchingSummary = false;
      if(result.success){
        this.total_doctor = result.total_doctor;
        this.total_staff = result.total_staff;
        this.total_patient = result.total_patient;
        this.completed_investigation = result.total_completed_investigation;
        this.pending_investigation = result.total_pending_investigation;
        this.inprogress_investigation = result.total_inprogress_investigation;
        this.total_pending_doctor = result.total_pending_doctor;
      }
      else{
        console.log(result.error_msg);
      }
    },
    error => {
      this.fetchingSummary = false;
      console.log(error);
    });
  }

}
