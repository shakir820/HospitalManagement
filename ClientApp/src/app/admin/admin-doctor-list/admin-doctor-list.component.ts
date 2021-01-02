import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { sortBy } from 'sort-by-typescript';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-doctor-list',
  templateUrl: './admin-doctor-list.component.html',
  styleUrls: ['./admin-doctor-list.component.css']
})
export class AdminDoctorListComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private router: Router) {
    this._baseUrl = baseUrl;
  }
  ngOnInit(): void {

    this.getDoctorList();
  }


  @ViewChild('f') searchForm: NgForm;

  _baseUrl: string;
  fetchingDoctorList: boolean = false;
  sortBy: string = 'ascending';
  allDoctorList: User[] = [];
  doctorList: User[] = [];
  filerBy: string = 'All';





  onSearchSubmit() {
    var search_key: string = this.searchForm.controls['search_string'].value;

    var filtered_doc_list = [];
    switch (this.filerBy) {
      case 'Pending':
        filtered_doc_list = this.allDoctorList.filter(a => a.approved == false)
        break;
      case 'Active':
        filtered_doc_list = this.allDoctorList.filter(a => a.isActive == true);
        break;
      case 'Inactive':
        filtered_doc_list = this.allDoctorList.filter(a => a.isActive == false);
        break;
      default:
        filtered_doc_list = this.allDoctorList.slice();
        break;
    }

    filtered_doc_list = filtered_doc_list.filter((val: User) => {
      var search_param = search_key.toUpperCase();
      if (val.name.toUpperCase().includes(search_param) || val.doctor_title.toUpperCase().includes(search_param)) {
        return val;
      }
    });

    if (this.sortBy == 'ascending') {
      //this.sortBy = 'descending'
      filtered_doc_list = filtered_doc_list.sort(sortBy('-name'));
    }
    else {
      filtered_doc_list = filtered_doc_list.sort(sortBy('name'));
    }

    this.doctorList = filtered_doc_list;

  }



  getDoctorList() {
    this.fetchingDoctorList = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      doctor_list: User[],
      error_msg: string
    }>(this._baseUrl + 'api/admin/GetAllDoctorList').subscribe(result => {
      console.log(result);
      this.fetchingDoctorList = false;
      if (result.success) {
        result.doctor_list.forEach(val => {
          //val.baseUrl = this._baseUrl;
          this.doctorList.push(val);

          this.allDoctorList.push(val);
        });

        this.doctorList = this.doctorList.sort(sortBy('name'));
      }
    });

  }




  showAllDoctorList(event_data) {
    this.filerBy = 'All';
    this.doctorList = this.allDoctorList.slice();
    var searchInput = <HTMLInputElement>document.getElementById('search_string');
    searchInput.value = '';
  }


  showPendingDoctorList(event_data) {
    this.filerBy = 'Pending';
    this.doctorList = this.allDoctorList.filter((val) => {
      if (val.approved == false) {
        return val;
      }
    });
    var searchInput = <HTMLInputElement>document.getElementById('search_string');
    searchInput.value = '';
  }


  showActiveDoctorList(event_data) {
    this.filerBy = 'Active';
    this.doctorList = this.allDoctorList.filter((val) => {
      if (val.isActive == true) {
        return val;
      }
    });
    var searchInput = <HTMLInputElement>document.getElementById('search_string');
    searchInput.value = '';
  }



  showInactiveDoctorList(event_data) {
    this.filerBy = 'Inactive';
    this.doctorList = this.allDoctorList.filter((val) => {
      if (val.isActive == false) {
        return val;
      }
    });
    var searchInput = <HTMLInputElement>document.getElementById('search_string');
    searchInput.value = '';
  }



  toggleDoctorListSort(event_data) {
    if (this.sortBy == 'ascending') {
      this.sortBy = 'descending'
      this.doctorList = this.doctorList.sort(sortBy('-name'));
    }
    else {
      this.sortBy = 'ascending'
      this.doctorList = this.doctorList.sort(sortBy('name'));
    }

  }




  // action methods
  approveDoctor(event_data, id: number) {
    var doctor = this.doctorList.find(a => a.id == id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/ApproveDoctor', { params: { id: doctor.id.toString() } }).subscribe(result => {
        if (result.success) {
          doctor.approved = true;
        }
      });
  }


  unApproveDoctor(event_data, id: number) {
    var doctor = this.doctorList.find(a => a.id == id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/UnapproveDoctor', { params: { id: doctor.id.toString() } }).subscribe(result => {
        if (result.success) {
          doctor.approved = false;
        }
      });
  }


  activeDoctor(event_data, id: number) {
    var doctor = this.doctorList.find(a => a.id == id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/ActivateUser', { params: { id: doctor.id.toString() } }).subscribe(result => {
        if (result.success) {
          doctor.isActive = true;
        }
      });
  }

  inActiveDoctor(event_data, id: number) {
    var doctor = this.doctorList.find(a => a.id == id);
    this.httpClient.get<{ success: boolean, error: boolean, error_msg: string }>
      (this._baseUrl + 'api/admin/DeactivateUser', { params: { id: doctor.id.toString() } }).subscribe(result => {
        if (result.success) {
          doctor.isActive = false;
        }
      });
  }





  viewDoctorDetails(event_data, doctor_id: number) {
    console.log('doctor id before navigate: ' + doctor_id);
    this.router.navigate(['admin/doctorList/DoctorDetails'], { queryParams: { id: doctor_id } });
  }

}
