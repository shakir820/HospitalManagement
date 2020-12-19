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

    var formdata = new FormData()
    formdata.append('investigator_id', this.userService.user.id.toString());
    formdata.append('investigation_id', this.investigation_id.toString());

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






}
