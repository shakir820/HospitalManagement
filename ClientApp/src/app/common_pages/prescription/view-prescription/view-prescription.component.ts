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


  ngOnInit(): void {
    this.route.queryParams.subscribe((params:Params) => {
      this.appointment_id = +params['appointment_id'];

      this.getPrescriptionData();

   });

  }





  getPrescriptionData(){
    console.log("Getting Prescription data");
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      prescription: Prescription,
      error_msg: string
    }>(this._baseUrl + 'api/Prescription/GetPrescriptionByAppointmentId', {params: {appointment_id: this.appointment_id.toString()}}).subscribe(result => {
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

      //  this.showEditBtn = true;
      //  this.showSaveBtn = false;

      }
      else{

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
