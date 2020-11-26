import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PresEditComplainDialogComponent } from 'src/app/modal-dialogs/pres-edit-complain-dialog/pres-edit-complain-dialog.component';
import { PresEditExaminationDialogComponent } from 'src/app/modal-dialogs/pres-edit-examination-dialog/pres-edit-examination-dialog.component';
import { Prescription, PrescriptionPatientComplain, PrescriptionPatientExamination } from 'src/app/models/prescription.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-prescription',
  templateUrl: './create-prescription.component.html',
  styleUrls: ['./create-prescription.component.css']
})
export class CreatePrescriptionComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private route: ActivatedRoute) {
    this._baseUrl = baseUrl;
  }


  patient_id: number;
  patient: User
  _baseUrl: string;
  today_date: Date;
  fetchingPatientDetails: boolean = false;
  prescription: Prescription;
  @ViewChild('complainModalComponent') complainDialog: PresEditComplainDialogComponent;
  @ViewChild('examinationModalComponent') examinationDialog: PresEditExaminationDialogComponent;



  ngOnInit(): void {
    this.today_date = new Date(Date.now());

    this.route.queryParams.subscribe((params:Params) => {
      this.patient_id = params['patient_id'];
   });

   this.prescription = new Prescription();
   this.prescription.doctor_id = this.userService.user.id;
   this.prescription.medicines = [];
   this.prescription.notes = [];
   this.prescription.patient_complains = [];
   this.prescription.patient_examinations = [];
   this.prescription.patient_id = this.patient_id;
   this.prescription.patient_investigations = [];

   this.getPatientDetails();

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




  onComplainChanged(event_data: {complain: PrescriptionPatientComplain, is_new: boolean}){
    if(event_data.is_new == true){
      var complain = event_data.complain;
      complain.id = this.prescription.patient_complains.length + 1;
      this.prescription.patient_complains.push(complain);
    }
  }


  onExaminationChanged(event_data: {examination: PrescriptionPatientExamination, is_new: boolean}){
    if(event_data.is_new == true){
      var examination = event_data.examination;
      examination.id = this.prescription.patient_examinations.length + 1;
      this.prescription.patient_examinations.push(examination);
    }
  }

  onComplainItemClicked(event_data, complain_id){
    var complain = this.prescription.patient_complains.find(a => a.id == complain_id);
    this.complainDialog.showModal(complain, false);
  }

  onExaminationItemClicked(event_data, examination_id){
    var examination = this.prescription.patient_examinations.find(a => a.id == examination_id);
    this.examinationDialog.showModal(examination, false);
  }

  onComplainDeleteBtnClicked(event_data, complain_id){
    var complain_index = this.prescription.patient_complains.findIndex(a => a.id == complain_id);
    this.prescription.patient_complains.splice(complain_index, 1);
  }


  onExaminationDeleteBtnClicked(event_data, examination_id){
    var examination_index = this.prescription.patient_examinations.findIndex(a => a.id == examination_id);
    this.prescription.patient_examinations.splice(examination_index, 1);
  }


  onAddMoreComplainBtnClicked(event_data){
    console.log("Showing Complain Dialog");
    console.log(this.complainDialog);
    this.complainDialog.showModal(new PrescriptionPatientComplain(), true);
  }


  onAddMoreExaminationBtnClicked(event_data){
    this.examinationDialog.showModal(new PrescriptionPatientExamination(), true);
  }

  onAddMoreInvestigationBtnClicked(event_data){

  }


  onAddMedicineBtnClicked(event_data){

  }


  onNoteDeleteBtnClicked(event_data, note_id){

  }


  onAddNoteBtnClicked(event_data){

  }



  onInvestigationDeleteBtnClicked(event_data, investigation_id){

  }



  onMedicineDeleteBtnClicked(event_data, medicine_id){

  }
}
