import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EditMedicineDialogComponent } from 'src/app/modal-dialogs/edit-medicine-dialog/edit-medicine-dialog.component';
import { PresEditComplainDialogComponent } from 'src/app/modal-dialogs/pres-edit-complain-dialog/pres-edit-complain-dialog.component';
import { PresEditExaminationDialogComponent } from 'src/app/modal-dialogs/pres-edit-examination-dialog/pres-edit-examination-dialog.component';
import { PresEditInvestigationDialogComponent } from 'src/app/modal-dialogs/pres-edit-investigation-dialog/pres-edit-investigation-dialog.component';
import { PresEditNoteDialogComponent } from 'src/app/modal-dialogs/pres-edit-note-dialog/pres-edit-note-dialog.component';
import { DoctorAppointment } from 'src/app/models/doctor-appointment.model';
import { InvestigationTag } from 'src/app/models/investigation-tag.model';
import { InvestigationDoc, Prescription, PrescriptionMedicine, PrescriptionNote, PrescriptionPatientComplain, PrescriptionPatientExamination } from 'src/app/models/prescription.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

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
  savingPrescription: boolean = false;
  appointment_id: number;
  canCreatePrescription: boolean = false;
  canEditPrescription: boolean = true;
  saveBtnDisabled: boolean = true;
  showEditBtn: boolean = false;
  showSaveBtn: boolean = true;
  inEditMode: boolean = false;
  viewPrescription: number = 0;
  @ViewChild('complainModalComponent') complainDialog: PresEditComplainDialogComponent;
  @ViewChild('examinationModalComponent') examinationDialog: PresEditExaminationDialogComponent;
  @ViewChild('investigationModalComponent') investigationDialog: PresEditInvestigationDialogComponent;
  @ViewChild('medicineModalComponent') medicineDialog: EditMedicineDialogComponent;
  @ViewChild('noteModalComponent') noteDialog: PresEditNoteDialogComponent;

  ngOnInit(): void {
    this.today_date = new Date(Date.now());

    this.route.queryParams.subscribe((params: Params) => {
      this.patient_id = +params['patient_id'];
      this.appointment_id = +params['appointment_id'];
      this.viewPrescription = (<number>params['prescription_view']);
      this.prescription = new Prescription();
      this.prescription.doctor = new User();
      this.prescription.doctor.id = this.userService.user.id;
      this.prescription.medicines = [];
      this.prescription.notes = [];
      this.prescription.patient_complains = [];
      this.prescription.patient_examinations = [];
      this.prescription.patient = new User();
      this.prescription.patient.id = this.patient_id;
      this.prescription.patient_investigations = [];
      this.getPatientDetails();

      console.log(this.viewPrescription);
      if (this.viewPrescription == 1) {
        this.getPrescriptionData();
      }
    });





    //this.checkIfCanCreatePrescription();
  }







  getPrescriptionData() {

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
        //  this.prescription.appointment = new DoctorAppointment();
        //  this.prescription.appointment.id = result.prescription.appointment.id;
        //  this.prescription.created_date = new Date(result.prescription.created_date);
        // //  this.prescription.doctor.id = result.prescription.doctor.id;
        //  this.prescription.id = result.prescription.id;
        //  this.prescription.medicines = [];
        //  if(result.prescription.medicines != undefined){
        //   result.prescription.medicines.forEach(val => {
        //     var medicine = new PrescriptionMedicine();
        //     medicine.doctor_id = val.doctor_id;
        //     medicine.duration = val.duration;
        //     medicine.id = val.id;
        //     medicine.medicine_id = val.medicine_id;
        //     medicine.note = val.note;
        //     medicine.patient_id = val.patient_id;
        //     medicine.prescription_id = val.prescription_id;
        //     medicine.schedule = val.schedule;
        //     medicine.title = val.title;
        //     this.prescription.medicines.push(medicine);
        //   });
        //  }

        //  this.prescription.notes = [];
        //  if(result.prescription.notes != undefined){
        //    result.prescription.notes.forEach(val => {
        //      var note = new PrescriptionNote();
        //      note.id = val.id;
        //      note.note = val.note;

        //      this.prescription.notes.push(note);
        //    });
        //  }

        //  this.prescription.patient.id = result.prescription.patient.id;
        //  this.prescription.patient_complains = [];
        //  if(result.prescription.patient_complains != undefined){
        //    result.prescription.patient_complains.forEach(val => {
        //      var complain = new PrescriptionPatientComplain();
        //      complain.description = val.description;
        //      complain.id = val.id;
        //      complain.title = val.title;

        //      this.prescription.patient_complains.push(complain);
        //    });
        //  }

        //  this.prescription.patient_examinations = [];
        //  if(result.prescription.patient_examinations != undefined){
        //    result.prescription.patient_examinations.forEach(val => {
        //      var examination = new PrescriptionPatientExamination();
        //      examination.description = val.description;
        //      examination.id = val.id;
        //      examination.title = val.title;

        //      this.prescription.patient_examinations.push(examination);
        //    });
        //  }

        //  this.prescription.patient_investigations = [];
        //  if(result.prescription.patient_investigations != undefined){
        //    result.prescription.patient_investigations.forEach(val => {
        //      var investigation = new InvestigationDoc();
        //      investigation.abbreviation = val.abbreviation;
        //      investigation.doctor_id = val.doctor_id;
        //      investigation.id = val.id;
        //      investigation.investigation_tag_id = val.investigation_tag_id;
        //      investigation.name = val.name;
        //      investigation.patient_id = val.patient_id;
        //      investigation.prescription_id = val.prescription_id;

        //      this.prescription.patient_investigations.push(investigation);
        //    });
        //  }

        this.showEditBtn = true;
        this.showSaveBtn = false;

      }
      else {
        this.showSaveBtn = false;
        this.showEditBtn = false;

        Swal.fire({
          title: 'Error!',
          text: result.error_msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    },
      error => {
        this.fetchingPatientDetails = false;
      });
  }




  onEidtbtnClicked(event_data) {
    this.showEditBtn = false;
    this.showSaveBtn = true;
    this.inEditMode = true;
  }



  onClearAllbtnClicked(event_data) {
    this.prescription.medicines = [];
    this.prescription.notes = [];
    this.prescription.patient_complains = [];
    this.prescription.patient_examinations = [];
    this.prescription.patient_investigations = [];

    this.saveBtnDisabled = true;
  }


  checkIfCanCreatePrescription() {
    this.httpClient.get<{ can_create_prescription: boolean }>(
      this._baseUrl + 'api/prescription/CanCreatePrescription', { params: { appointment_id: this.appointment_id.toString() } }
    ).subscribe(result => {
      if (result.can_create_prescription) {
        this.canCreatePrescription = true;
      }
      else {
        this.canCreatePrescription = false;
      }
    });
  }



  getPatientDetails() {
    this.fetchingPatientDetails = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      patient: User,
      error_msg: string
    }>(this._baseUrl + 'api/doctor/GetPatientDetails', { params: { patient_id: this.patient_id.toString() } }).subscribe(result => {
      console.log(result);
      this.fetchingPatientDetails = false;
      if (result.success) {

        this.patient = result.patient;
        // this.patient = new User();
        // this.patient.username = result.patient.username;
        // this.patient.id = result.patient.id;
        // this.patient.age  =result.patient.age;
        // this.patient.bloodGroup = result.patient.bloodGroup;
        // this.patient.city_name = result.patient.city_name;
        // this.patient.country_name = result.patient.country_name;
        // this.patient.country_phone_code = result.patient.country_phone_code;
        // this.patient.country_short_name = result.patient.country_short_name;
        // this.patient.email = result.patient.email;
        // this.patient.gender = result.patient.gender;
        // this.patient.isActive = result.patient.isActive;
        // this.patient.name = result.patient.name;
        // this.patient.phoneNumber =result.patient.phoneNumber;
        // this.patient.roles = [];
        // result.patient.roles.forEach(val => {
        //   this.patient.roles.push(val);
        // });
        // this.patient.state_name = result.patient.state_name;
      }
    },
      error => {
        this.fetchingPatientDetails = false;
      });
  }



  checkIfSaveBtnShouldBeDiabledOrNot() {
    if (this.prescription.medicines.length > 0 || this.prescription.patient_complains.length > 0 || this.prescription.patient_examinations.length > 0 ||
      this.prescription.patient_investigations.length > 0 || this.prescription.notes.length > 0) {
      this.saveBtnDisabled = false;
    }
    else {
      this.saveBtnDisabled = true;
    }
  }




  onComplainChanged(event_data: { complain: PrescriptionPatientComplain, is_new: boolean }) {
    if (event_data.is_new == true) {
      var complain = event_data.complain;
      complain.id = this.prescription.patient_complains.length + 1;
      this.prescription.patient_complains.push(complain);
    }

    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }


  onExaminationChanged(event_data: { examination: PrescriptionPatientExamination, is_new: boolean }) {
    if (event_data.is_new == true) {
      var examination = event_data.examination;
      examination.id = this.prescription.patient_examinations.length + 1;
      this.prescription.patient_examinations.push(examination);
    }

    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }

  onInvestigationItemChanged(event_data: { investigation: InvestigationTag }) {
    var existed_item = this.prescription.patient_investigations.find(a => a.investigation_tag_id == event_data.investigation.id);
    if (existed_item != undefined) {
      return;
    }
    var inv = new InvestigationDoc();
    inv.abbreviation = event_data.investigation.abbreviation;
    inv.doctor_id = this.userService.user.id;
    inv.investigation_tag_id = event_data.investigation.id;
    // if(this.prescription.patient_investigations.length > 0){
    //   var new_id = Math.max.apply(Math, this.prescription.patient_investigations.map(function(o) { return o.id; }));
    //   inv.id = new_id;
    // }
    // else{
    //   inv.id = this.prescription.patient_investigations.length + 1;
    // }
    inv.id = event_data.investigation.id;
    inv.name = event_data.investigation.name;
    inv.patient_id = this.patient_id;

    this.prescription.patient_investigations.push(inv);

    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }



  onMedicineChanged(event_data: { prescription_medicine: PrescriptionMedicine, is_new: boolean }) {
    if (event_data.is_new) {
      var existed_medicine = this.prescription.medicines.find(a => a.medicine_id == event_data.prescription_medicine.medicine_id);
      if (existed_medicine == undefined) {
        event_data.prescription_medicine.doctor_id = this.userService.user.id;
        event_data.prescription_medicine.id = event_data.prescription_medicine.medicine_id;
        event_data.prescription_medicine.patient_id = this.patient_id;
        this.prescription.medicines.push(event_data.prescription_medicine);
      }
    }
    else {

    }

    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }


  onNoteItemChanged(event_data: { note: PrescriptionNote, is_new: boolean }) {
    if (event_data.is_new) {
      var new_note = new PrescriptionNote();
      if (this.prescription.notes.length > 0) {
        var new_id = Math.max.apply(Math, this.prescription.notes.map(function (o) { return o.id; }));
        new_note.id = new_id;
      }
      else {
        new_note.id = this.prescription.notes.length + 1;
      }
      new_note.note = event_data.note.note;
      this.prescription.notes.push(new_note);
    }
    else {
      var specific_note = this.prescription.notes.find(a => a.id == event_data.note.id);
      specific_note.note = event_data.note.note;
    }

    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }




  onComplainItemClicked(event_data, complain_id) {
    var complain = this.prescription.patient_complains.find(a => a.id == complain_id);
    this.complainDialog.showModal(complain, false);
  }

  onMedicineItemClicked(event_data, medicine_id) {
    var medicine = this.prescription.medicines.find(a => a.id == medicine_id);
    this.medicineDialog.showMedicineDialog(medicine, false, this.prescription.medicines);
  }


  onNoteItmeClicked(event_data, note_id) {
    var note_item = this.prescription.notes.find(a => a.id == note_id);
    var note = new PrescriptionNote();
    note.id = note_id;
    note.note = note_item.note;
    this.noteDialog.showModal(note, false);
  }

  onExaminationItemClicked(event_data, examination_id) {
    var examination = this.prescription.patient_examinations.find(a => a.id == examination_id);
    this.examinationDialog.showModal(examination, false);
  }

  onComplainDeleteBtnClicked(event_data, complain_id) {
    var complain_index = this.prescription.patient_complains.findIndex(a => a.id == complain_id);
    this.prescription.patient_complains.splice(complain_index, 1);
    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }


  onExaminationDeleteBtnClicked(event_data, examination_id) {
    var examination_index = this.prescription.patient_examinations.findIndex(a => a.id == examination_id);
    this.prescription.patient_examinations.splice(examination_index, 1);

    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }


  onAddMoreComplainBtnClicked(event_data) {
    console.log("Showing Complain Dialog");
    console.log(this.complainDialog);
    this.complainDialog.showModal(new PrescriptionPatientComplain(), true);
  }


  onAddMoreExaminationBtnClicked(event_data) {
    this.examinationDialog.showModal(new PrescriptionPatientExamination(), true);
  }

  onAddMoreInvestigationBtnClicked(event_data) {
    this.investigationDialog.showModal();
  }


  onAddMedicineBtnClicked(event_data) {
    this.medicineDialog.showMedicineDialog(new PrescriptionMedicine(), true, this.prescription.medicines);
  }


  onNoteDeleteBtnClicked(event_data, note_id) {
    var note_index = this.prescription.notes.findIndex(a => a.id == note_id);
    this.prescription.notes.splice(note_index, 1);

    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }


  onAddNoteBtnClicked(event_data) {
    this.noteDialog.showModal(new PrescriptionNote(), true);
  }



  onInvestigationDeleteBtnClicked(event_data, investigation_id) {
    var inv_index = this.prescription.patient_investigations.findIndex(a => a.id == investigation_id);
    this.prescription.patient_investigations.splice(inv_index, 1);

    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }



  onMedicineDeleteBtnClicked(event_data, medicine_id) {
    var medicine_index = this.prescription.medicines.findIndex(a => a.id == medicine_id);
    this.prescription.medicines.splice(medicine_index, 1);
    this.checkIfSaveBtnShouldBeDiabledOrNot();
  }





  onSavebtnClicked(event_data) {
    this.savingPrescription = true;

    this.prescription.appointment = new DoctorAppointment();
    this.prescription.appointment.id = this.appointment_id;
    var pres = JSON.stringify(this.prescription);

    var action_method = 'CreateNewPrescription';
    if (this.inEditMode) {
      action_method = 'EditPrescription';
    }


    this.httpClient.post<{
      error_msg: string,
      error: boolean,
      success: boolean,
      prescription_id: number
    }>(this._baseUrl + `api/Prescription/${action_method}`, { json_data: pres }).subscribe(result => {
      this.savingPrescription = false;
      console.log(result);
      if (result.success == true) {
        this.showSaveBtn = false;
        this.showEditBtn = true;
        this.prescription.id = result.prescription_id;
        var success_msg = 'Prescription created';
        if (this.inEditMode) {
          success_msg = 'Prescription saved'
        }
        Swal.fire({
          title: 'Success!',
          text: success_msg,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }
      else {
        this.showEditBtn = false;
        this.showSaveBtn = true;
        Swal.fire({
          title: 'Error!',
          text: result.error_msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    }, error => {
      console.error(error);
      this.savingPrescription = false;
    });
  }






  onCancelbtnClicked(event_data) {
    this.showSaveBtn = false;
    this.showEditBtn = true;
    this.inEditMode = false;
  }



}
