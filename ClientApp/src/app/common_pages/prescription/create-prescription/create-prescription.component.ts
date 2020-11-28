import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EditMedicineDialogComponent } from 'src/app/modal-dialogs/edit-medicine-dialog/edit-medicine-dialog.component';
import { PresEditComplainDialogComponent } from 'src/app/modal-dialogs/pres-edit-complain-dialog/pres-edit-complain-dialog.component';
import { PresEditExaminationDialogComponent } from 'src/app/modal-dialogs/pres-edit-examination-dialog/pres-edit-examination-dialog.component';
import { PresEditInvestigationDialogComponent } from 'src/app/modal-dialogs/pres-edit-investigation-dialog/pres-edit-investigation-dialog.component';
import { PresEditNoteDialogComponent } from 'src/app/modal-dialogs/pres-edit-note-dialog/pres-edit-note-dialog.component';
import { InvestigationTag } from 'src/app/models/investigation-tag.model';
import { InvestigationDoc, Prescription, PrescriptionMedicine, PrescriptionNote, PrescriptionPatientComplain, PrescriptionPatientExamination } from 'src/app/models/prescription.model';
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
  @ViewChild('investigationModalComponent') investigationDialog: PresEditInvestigationDialogComponent;
  @ViewChild('medicineModalComponent') medicineDialog: EditMedicineDialogComponent;
  @ViewChild('noteModalComponent') noteDialog: PresEditNoteDialogComponent;

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

  onInvestigationItemChanged(event_data: {investigation: InvestigationTag}){
    var existed_item = this.prescription.patient_investigations.find( a => a.investigation_tag_id == event_data.investigation.id);
      if(existed_item != undefined){
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
  }



  onMedicineChanged(event_data:{prescription_medicine: PrescriptionMedicine, is_new: boolean}){
    if(event_data.is_new){
      var existed_medicine = this.prescription.medicines.find(a => a.medicine_id == event_data.prescription_medicine.medicine_id);
      if(existed_medicine == undefined){
        event_data.prescription_medicine.doctor_id = this.userService.user.id;
        event_data.prescription_medicine.id = event_data.prescription_medicine.medicine_id;
        event_data.prescription_medicine.patient_id = this.patient_id;
        this.prescription.medicines.push(event_data.prescription_medicine);
      }
    }
    else{

    }
  }


  onNoteItemChanged(event_data: {note: PrescriptionNote, is_new: boolean}){
    if(event_data.is_new){
      var new_note = new PrescriptionNote();
       if(this.prescription.notes.length > 0){
        var new_id = Math.max.apply(Math, this.prescription.notes.map(function(o) { return o.id; }));
        new_note.id = new_id;
      }
      else{
        new_note.id = this.prescription.notes.length + 1;
      }
      new_note.note = event_data.note.note;
      this.prescription.notes.push(new_note);
    }
    else{
      var specific_note = this.prescription.notes.find(a => a.id == event_data.note.id);
      specific_note.note = event_data.note.note;
    }
  }




  onComplainItemClicked(event_data, complain_id){
    var complain = this.prescription.patient_complains.find(a => a.id == complain_id);
    this.complainDialog.showModal(complain, false);
  }

  onMedicineItemClicked(event_data, medicine_id){
    var medicine = this.prescription.medicines.find(a => a.id == medicine_id);
    this.medicineDialog.showMedicineDialog(medicine, false, this.prescription.medicines);
  }


  onNoteItmeClicked(event_data, note_id){
    var note_item = this.prescription.notes.find(a => a.id == note_id);
    var note = new PrescriptionNote();
    note.id = note_id;
    note.note = note_item.note;
    this.noteDialog.showModal(note, false);
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
    this.investigationDialog.showModal();
  }


  onAddMedicineBtnClicked(event_data){
    this.medicineDialog.showMedicineDialog(new PrescriptionMedicine(), true, this.prescription.medicines);
  }


  onNoteDeleteBtnClicked(event_data, note_id){
    var note_index = this.prescription.notes.findIndex(a => a.id == note_id);
    this.prescription.notes.splice(note_index, 1);
  }


  onAddNoteBtnClicked(event_data){
    this.noteDialog.showModal(new PrescriptionNote(), true);
  }



  onInvestigationDeleteBtnClicked(event_data, investigation_id){
    var inv_index = this.prescription.patient_investigations.findIndex(a => a.id == investigation_id);
    this.prescription.patient_investigations.splice(inv_index, 1);
  }



  onMedicineDeleteBtnClicked(event_data, medicine_id){
    var medicine_index = this.prescription.medicines.findIndex(a => a.id == medicine_id);
    this.prescription.medicines.splice(medicine_index, 1);
  }
}
