import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-user-role-dialog',
  templateUrl: './edit-user-role-dialog.component.html',
  styleUrls: ['./edit-user-role-dialog.component.css']
})
export class EditUserRoleDialogComponent implements OnInit {

  constructor() { }


  investigatorRole: boolean = false;
  @ViewChild('userRoleForm') userRoleForm: NgForm

  ngOnInit(): void {
  }



  onFormSubmit(){
    var gg =  <HTMLButtonElement>document.getElementById('toggleUserRoleModalBtn');
    gg.click();
  }




  showModal(){
    var gg =  <HTMLButtonElement>document.getElementById('toggleUserRoleModalBtn');
    gg.click();
  }
}
