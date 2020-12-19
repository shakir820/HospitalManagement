import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor( private userService: UserService) { }

  isApproved:boolean = false;
  isDoctor:boolean = false;
  isPatient: boolean = false;
  isInvestigator: boolean = false;


  ngOnInit(): void {

    this.isApproved = this.userService.user.approved;

  if(this.userService.user.roles.length > 0){

        var uroles = this.userService.user.roles;
        var doctorRole = uroles.find(a=>a == 'Doctor');
        if(doctorRole){
          this.isDoctor = true;
        }
        else{
          this.isDoctor = false;
        }

        var patientRole = uroles.find(a=>a == 'Patient');
        if(patientRole){
          this.isPatient = true;
        }
        else{
          this.isPatient = false;
        }

        var investigatorRole = uroles.find(a=>a == 'Investigator');
        if(investigatorRole){
          this.isInvestigator = true;
        }
        else{
          this.isInvestigator = false;
        }
      }


    this.userService.approvedChanged.subscribe((val)=>{
      this.isApproved = val;
    });

    this.userService.roleChanged.subscribe((roles: string[])=>{
      this.isPatient = false;
      this.isInvestigator = false;
      this.isDoctor= false;

      if(roles.length > 0){

        var doctorRole = roles.find(a=>a == 'Doctor');
        if(doctorRole){
          this.isDoctor = true;
        }
        else{
          this.isDoctor = false;
        }

        var patientRole = roles.find(a=>a == 'Patient');
        if(patientRole){
          this.isPatient = true;
        }
        else{
          this.isPatient = false;
        }

        var investigatorRole = roles.find(a=>a == 'Investigator');
        if(investigatorRole){
          this.isInvestigator = true;
        }
        else{
          this.isInvestigator = false;
        }
      }
    });

  }
}
