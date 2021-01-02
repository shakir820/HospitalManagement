import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-edit-user-role-dialog',
  templateUrl: './edit-user-role-dialog.component.html',
  styleUrls: ['./edit-user-role-dialog.component.css']
})
export class EditUserRoleDialogComponent implements OnInit {

  constructor() { }


  @Output() roleChanged: EventEmitter<User> = new EventEmitter<User>();
  investigatorRole: boolean = false;
  @ViewChild('userRoleForm') userRoleForm: NgForm;
  user: User = new User();
  ngOnInit(): void {
  }



  onFormSubmit() {
    if (this.investigatorRole) {
      if (!this.user.roles.includes('Investigator')) {
        this.user.roles.push('Staff');
        this.user.roles.push('Investigator');
      }
    }
    else {
      if (this.user.roles.includes('Investigator')) {
        var inve_index = this.user.roles.findIndex(a => a == 'Investigator');
        this.user.roles.splice(inve_index, 1);
        var s_index = this.user.roles.findIndex(a => a == 'Staff');
        if (s_index != undefined || s_index != -1) {
          this.user.roles.splice(s_index, 1);
        }
      }
    }

    this.roleChanged.emit(this.user);
    var gg = <HTMLButtonElement>document.getElementById('toggleUserRoleModalBtn');
    gg.click();
  }




  showModal(user: User) {
    this.user = user;
    this.investigatorRole = false;
    if (user.roles) {
      var inve_role = user.roles.includes('Investigator');
      if (inve_role) {
        this.investigatorRole = true;
      }
    }
    var gg = <HTMLButtonElement>document.getElementById('toggleUserRoleModalBtn');
    gg.click();
  }


}
