import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestigationDoc, InvestigationStatus } from 'src/app/models/investigation-doc.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-investigation-details',
  templateUrl: './investigation-details.component.html',
  styleUrls: ['./investigation-details.component.css']
})
export class InvestigationDetailsComponent implements OnInit {

  constructor(public userService: UserService,
    private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private route: ActivatedRoute,
    private router: Router) {
    this._baseUrl = baseUrl;
  }


  _baseUrl:string;
  investigation_id: number;
  fetchingInvestigation: boolean = false;
  investigation: InvestigationDoc;
  investigationFile: File;
  canEdit: boolean = false;
  canAssignToMe: boolean = false;
  canView:boolean = false;
  assigningToMe: boolean = false;
  unassigning: boolean = false;
  savingInvestigation: boolean = false;
  fileIsRequiredError: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
       this.investigation_id =  params['investigation_id'];
       this.getInvestigationDetails();
    });
  }


  onFileSelect(event_data){
    console.log(event_data);
    this.investigationFile = event_data.addedFiles[0];
  }


  onFileRemove(event) {
    this.investigationFile = undefined;
  }




  getInvestigationDetails(){
    this.fetchingInvestigation = true;
    this.httpClient.get<{
      success: boolean,
      error: boolean,
      investigation: InvestigationDoc,
      error_msg: string
    }>(this._baseUrl + 'api/Investigation/GetInvestigationById', {params: { id: this.investigation_id.toString() }}).subscribe(result => {
      console.log(result);
      this.fetchingInvestigation = false;
      if (result.success) {
        this.investigation = result.investigation;

        switch(this.investigation.investigation_status){
          case InvestigationStatus.Inprogress:
            if(this.investigation.investigator.id == this.userService.user.id){
              this.canEdit = true;
            }
            break;

            case InvestigationStatus.Pending:
              this.canAssignToMe = true;
              break;

            case InvestigationStatus.Completed:
              this.canView = true;
              break;
        }
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
      console.log(error);
      this.fetchingInvestigation = false;
    });
  }




  onAssignToMeClicked(){
    this.assigningToMe = true;

    var inv = new InvestigationDoc();
    inv.id = this.investigation_id;
    inv.investigator = new User();
    inv.investigator.id = this.userService.user.id;

    var inv_str = JSON.stringify(inv);

    this.httpClient.post<{
      success: boolean,
      error: boolean,
      error_msg: string
    }>(this._baseUrl + 'api/Investigation/AssignInvestigationToInvestigator', {json_data: inv_str}).subscribe(result => {
      console.log(result);
      this.assigningToMe = false;
      if(result.success){
        this.canEdit = true;
        this.canView = false,
        this.canAssignToMe = false;
        this.investigation.investigation_status = InvestigationStatus.Inprogress;
        this.investigation.investigator = this.userService.user;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Assigned successful',
          confirmButtonText: 'Ok'
        });

      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.error_msg,
          confirmButtonText: 'Ok'
        });
      }
    });
  }





  onUnassignClicked(){
    if(this.investigation.investigation_status == InvestigationStatus.Inprogress){
      this.unassigning = true;

      this.httpClient.post<{
        success : boolean,
        error: boolean,
        error_msg: string
      }>(this._baseUrl + 'api/Investigation/UnassignInvestigation', { id: this.investigation.id }).subscribe(result =>{
        this.unassigning = false;

        if(result.success){
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Unassigned'
          });
          this.investigation.investigation_status = InvestigationStatus.Pending;
          this.investigation.investigator = undefined;
          this.canView = false;
          this.canEdit = false;
          this.canAssignToMe = true;
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: result.error_msg
          });
        }
      });
    }
  }






  onFileSubmit(){
    if(this.investigationFile == undefined){
      this.fileIsRequiredError = true;
      return;
    }

    this.savingInvestigation = true;

    var formData = new FormData();
    formData.append('id', this.investigation.id.toString());
    formData.append('investigation_file', this.investigationFile, this.investigationFile.name);



    this.httpClient.post<{
      success: boolean,
      error: boolean,
      error_msg: string,
      investigation: InvestigationDoc
    }>(this._baseUrl + 'api/investigation/UploadInvestigationFile', formData, { headers: { 'enctype': 'multipart/form-data' } }).subscribe(result =>{
      this.savingInvestigation = false;
      if(result.success){
        this.investigation = result.investigation;

        // this.canEdit = false;
        // this.canView = true;
        // this.canAssignToMe = false;

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Document saved'
        });

      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.error_msg
        });

      }
    });

  }








}
