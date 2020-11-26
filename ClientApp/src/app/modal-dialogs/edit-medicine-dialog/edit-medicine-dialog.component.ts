import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-medicine-dialog',
  templateUrl: './edit-medicine-dialog.component.html',
  styleUrls: ['./edit-medicine-dialog.component.css']
})
export class EditMedicineDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  showMedicineDialog(){

    var gg =  <HTMLButtonElement>document.getElementById('toggleMedicineModalBtn');
    gg.click();

    console.log('Medicine dialog btn clicked');
  }

}
