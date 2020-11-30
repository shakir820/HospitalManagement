import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Medicine } from 'src/app/models/medicine.model';
import { PrescriptionMedicine } from 'src/app/models/prescription.model';

@Component({
  selector: 'app-edit-medicine-dialog',
  templateUrl: './edit-medicine-dialog.component.html',
  styleUrls: ['./edit-medicine-dialog.component.css']
})
export class EditMedicineDialogComponent implements OnInit {

  constructor( private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,) {
    this._baseUrl = baseUrl;
   }


   @ViewChild('medicineDropDown') medicineDropDown: NgbDropdown;
   @ViewChild('medicineForm') medicineForm: NgForm;
   @Output() medicineChanged: EventEmitter<{prescription_medicine: PrescriptionMedicine, is_new: boolean}>
   = new EventEmitter<{prescription_medicine: PrescriptionMedicine, is_new: boolean}>();

   _baseUrl: string;
   selectedPrescriptionMedicine: PrescriptionMedicine;
   medicineName: string;
   medicineSchedule: string;
   medicineDuration: string;
   medicineNote: string;
   selectedMedicine: Medicine;
   medicine_list:Medicine[] = [];
   isNew: boolean = false;
   fetchingMedicineList: boolean = false;
   submitted: boolean = false;
   selectedMedicineList: PrescriptionMedicine[];
   medicineExist: boolean = false;

  ngOnInit(): void {
    this.selectedPrescriptionMedicine = new PrescriptionMedicine();
    //this.selectedMedicine = new Medicine();
  }


  onSubmit(){
    this.submitted = true;
    if(this.medicineForm.valid && this.selectedMedicine != undefined && this.medicineExist == false){
      this.submitted = false;
      this.selectedPrescriptionMedicine.duration = this.medicineDuration;
      this.selectedPrescriptionMedicine.medicine_id = this.selectedMedicine.id;
      this.selectedPrescriptionMedicine.note = this.medicineNote;
      this.selectedPrescriptionMedicine.schedule = this.medicineSchedule;
      this.selectedPrescriptionMedicine.title = this.medicineName;
      this.medicineChanged.emit({prescription_medicine: this.selectedPrescriptionMedicine, is_new: this.isNew});
      var gg =  <HTMLButtonElement>document.getElementById('toggleMedicineModalBtn');
      gg.click();
    }

  }

  showMedicineDialog(prescription_medicine:PrescriptionMedicine, is_new: boolean, selected_medicine_list: PrescriptionMedicine[]){
    this.isNew = is_new;
    this.selectedPrescriptionMedicine = prescription_medicine;
    this.medicineName = prescription_medicine.title;
    this.medicineDuration = prescription_medicine.duration;
    this.medicineNote = prescription_medicine.note;
    this.medicineSchedule = prescription_medicine.schedule;
    this.selectedMedicineList = selected_medicine_list;
    if(is_new == true){
      this.medicineForm.reset();
    }
    var gg =  <HTMLButtonElement>document.getElementById('toggleMedicineModalBtn');
    gg.click();
  }

  onMedicineItemClicked(event_data, medicine_id){
    var medicine = this.medicine_list.find(a => a.id == medicine_id);
    this.medicineExist = false;
    if(this.selectedMedicineList.length > 0){
      var existed_medicine = this.selectedMedicineList.find(a => a.medicine_id == medicine_id);
      if(existed_medicine != undefined){
        if(existed_medicine.medicine_id != this.selectedPrescriptionMedicine.medicine_id){
          this.medicineExist = true;
        }
      }
    }
    this.selectedMedicine = medicine;
    this.medicineName = medicine.name;
    //this.selectedPrescriptionMedicine.medicine_id = medicine_id;
    //this.selectedPrescriptionMedicine.title = medicine.name;
  }




  getMedicines(search_key: string){

    this.fetchingMedicineList = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      medicines: Medicine[],
      error_msg: string
    }>(this._baseUrl + 'api/Medicine/GetMedicines', {params: {search_key: search_key}}).subscribe(result => {
      console.log(result);
      this.fetchingMedicineList = false;
      if (result.success) {
        this.medicine_list = [];
        if(result.medicines != undefined){
          result.medicines.forEach(val => {
            var medicine = new Medicine();
            medicine.description = val.description;
            medicine.id = val.id;
            medicine.name = val.name;
            medicine.medicine_link = val.medicine_link;
            this.medicine_list.push(medicine);
          });
        }

      }
      else{
        this.medicine_list = [];
      }
    },
    error => {
      this.fetchingMedicineList = false;
    });
  }


  onMedicineInputFocusOut(event_data){
    //console.log("focus out!");
  }


  onDropDownOpenChanged(event_data){
    //console.log('dropdown changed detected!');

    // console.log(this.selectedMedicine);
    // if(this.selectedMedicine != undefined){
    //  if(this.medicineName != this.selectedMedicine.name){
    //   this.medicineName = "";
    //  }
    // }
  }



  onMedicineInput(event_data){
    if(this.medicineName != undefined || this.medicineName != ''){
      var regExp = /[a-zA-Z]/;
      if(regExp.test(this.medicineName)){
        if(this.medicineDropDown.isOpen() == false){
          this.medicineDropDown.open();
        }
        this.getMedicines(this.medicineName);

      } else {

      }
    }
  }

}
