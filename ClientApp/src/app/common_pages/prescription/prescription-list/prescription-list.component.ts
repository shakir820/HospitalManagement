import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { DoctorAppointment } from 'src/app/models/doctor-appointment.model';
import { Prescription } from 'src/app/models/prescription.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css']
})
export class PrescriptionListComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private route: ActivatedRoute) {
    this._baseUrl = baseUrl;
  }



  _baseUrl: string;
  search_string: string;
  sortOrderBy: string = 'Date';
  filteredPrescriptionList:Prescription[] = [];
  prescriptionList: Prescription[] = [];
  sortByAsscending: boolean = true;
  fetchingPrescription:boolean = false;

  ngOnInit(): void {
    this.getPrescriptionList();
  }



  getPrescriptionList(){

    this.fetchingPrescription = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      prescription_list: Prescription[],
      error_msg: string
    }>(this._baseUrl + 'api/Prescription/GetPrescriptionListByPatientId', { params: { patient_id: this.userService.user.id.toString() } }).subscribe(result => {
      console.log(result);
      this.fetchingPrescription = false;
      if (result.success) {
        this.prescriptionList = [];
        this.filteredPrescriptionList = [];
        if (result.prescription_list != undefined) {
          this.prescriptionList = result.prescription_list;
        }

        if (this.prescriptionList.length > 0) {
          this.filteredPrescriptionList = this.prescriptionList.slice();
          this.sortPrescriptionList(null, 'Date');
        }
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: result.error_msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }





  onSearchSubmit(){
    if (this.search_string != undefined) {
      if (this.search_string.replace(/\s/g, '').length) {
        var sk = this.search_string.toUpperCase();
        this.filteredPrescriptionList = this.prescriptionList.filter(a => a.doctor.name.toUpperCase().includes(sk));
      }
    }
  }


  doctorSearchOnInput(event_data){
    if(this.search_string.length == 0){
      this.filteredPrescriptionList = this.prescriptionList.slice();
    }
  }



  sortPrescriptionList(event_data, order_name:string){
    switch (order_name) {
      case 'Date':
        if (this.sortOrderBy == order_name) {
          this.sortByAsscending = !this.sortByAsscending;
        }
        if (this.sortByAsscending) {
          this.filteredPrescriptionList.sort(sortBy('created_date'));
        }
        else {
          this.filteredPrescriptionList.sort(sortBy('-created_date'));
        }
        break;

      case 'Doctor':
        if (this.sortOrderBy == order_name) {
          this.sortByAsscending = !this.sortByAsscending;
        }
        if (this.sortByAsscending) {
          this.filteredPrescriptionList.sort(sortBy('doctor.name'));
        }
        else {
          this.filteredPrescriptionList.sort(sortBy('-doctor.name'));
        }
        break;
    }

    this.sortOrderBy = order_name;
  }


  onViewPrescriptionClicked(event_data, prescription_id: number){
    this.router.navigate(['Prescription/ViewPrescription'], {queryParams: { prescription_id: prescription_id}});
  }
}
