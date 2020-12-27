import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { sortBy } from 'sort-by-typescript';
import { PatientDocument } from 'src/app/models/patient-document.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-document-list',
  templateUrl: './patient-document-list.component.html',
  styleUrls: ['./patient-document-list.component.css']
})
export class PatientDocumentListComponent implements OnInit {

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;

  }



  @ViewChild('f') documentForm: NgForm;
  @ViewChild('DocFile', {static: true}) docFile: ElementRef;
  savingDocument: boolean = false;
  submitted:boolean = false;
  document_file: File;
  document_name: string;
  _baseUrl: string;
  document_list: PatientDocument[] = [];
  fetchingDocument:boolean = false;
  showEmptyIcon:boolean = false;
  sortOrderBy: string = 'Id';
  sortByAsscending: boolean = true;

  ngOnInit(): void {
    this.getAllDocument();
  }



  onDocItemClicked(event_data, doc_id: number){

  }



  onDocumentDeleteClicked(event_data, doc_id: number){

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.httpClient.get<{
          success: boolean,
          error: boolean,
          error_msg: string
        }>(this._baseUrl + 'api/PatientDocument/DeletePatientDocument', { params: { document_id: doc_id.toString() } }).subscribe(result => {
          console.log(result);
          if (result.success) {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );

            var doc_index = this.document_list.findIndex(a => a.id == doc_id);
            this.document_list.splice(doc_index, 1);

            if(this.document_list.length == 0){
              this.showEmptyIcon = true;
            }
          }
          else{
            Swal.fire({
              icon:'error',
              title: 'Error!',
              text: result.error_msg
            });
          }
        });
      }
    });

  }









  sortDocumentListDefault(){
    switch(this.sortOrderBy){
      case 'Id':
        if(this.sortByAsscending){
          this.document_list.sort(sortBy('id'));
        }
        else{
          this.document_list.sort(sortBy('-id'));
        }
      break;

      case 'Name':
      if(this.sortByAsscending){
        this.document_list.sort(sortBy('name'));
      }
      else{
        this.document_list.sort(sortBy('-name'));
      }
      break;


      case 'Date':
      if(this.sortByAsscending){
        this.document_list.sort(sortBy('created_date'));
      }
      else{
        this.document_list.sort(sortBy('-created_date'));
      }
      break;
    }
  }

  sortDocumentList(event_data, order_name: string){
    if(this.sortOrderBy == order_name){
      this.sortByAsscending = !this.sortByAsscending;
   }

   switch(this.sortOrderBy){
    case 'Id':
      if(this.sortByAsscending){
        this.document_list.sort(sortBy('id'));
      }
      else{
        this.document_list.sort(sortBy('-id'));
      }
    break;

    case 'Name':
    if(this.sortByAsscending){
      this.document_list.sort(sortBy('name'));
    }
    else{
      this.document_list.sort(sortBy('-name'));
    }
    break;


    case 'Date':
    if(this.sortByAsscending){
      this.document_list.sort(sortBy('created_date'));
    }
    else{
      this.document_list.sort(sortBy('-created_date'));
    }
    break;
  }


    this.sortOrderBy = order_name;
  }


  getAllDocument(){
    this.fetchingDocument = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      document_list: PatientDocument[],
      error_msg: string
    }>(this._baseUrl + 'api/PatientDocument/GetAllDocumentsByPatient', { params: { patient_id: this.userService.user.id.toString() } }).subscribe(result => {
      console.log(result);
      this.fetchingDocument = false;
      if (result.success) {

        this.document_list = result.document_list;
        if(result.document_list.length == 0){
          this.showEmptyIcon = true;
        }
        else{
          this.showEmptyIcon = false;
          this.document_list.sort(sortBy('id'));
        }
      }
    });
  }


  onSubmit(){
    this.submitted = true;
    if(this.documentForm.valid){
      this.submitted = false;

      this.savingDocument = true;

      var formData = new FormData();
      formData.append('patient_id', this.userService.user.id.toString());
      formData.append('name', this.document_name);

      var selectedFiles = (<HTMLInputElement>this.docFile.nativeElement).files;
      formData.append('document', selectedFiles[0], selectedFiles[0].name);


      this.httpClient.post<{
        success:boolean,
        error:boolean,
        error_msg:string,
        patient_document:PatientDocument
      }>(this._baseUrl + 'api/PatientDocument/CreatePatientDocument', formData, { headers: { 'enctype': 'multipart/form-data' } }).subscribe(result => {
        this.savingDocument = false;
        if(result.success){

          Swal.fire({
            title: 'Success',
            text: 'File saved',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          this.document_list.push(result.patient_document);
          this.sortDocumentListDefault();

          if(this.document_list.length > 0){
            this.showEmptyIcon = false;
          }
        }
        else{
          Swal.fire({
            title: 'Error',
            text: result.error_msg,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      },
      error =>{
        console.log(error);
      });

    }
  }



}
