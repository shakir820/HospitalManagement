import { not } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { InvestigationTag } from 'src/app/models/investigation-tag.model';
import { PrescriptionNote } from 'src/app/models/prescription.model';

@Component({
  selector: 'app-pres-edit-note-dialog',
  templateUrl: './pres-edit-note-dialog.component.html',
  styleUrls: ['./pres-edit-note-dialog.component.css']
})
export class PresEditNoteDialogComponent implements OnInit {

  constructor() { }



  @ViewChild('noteForm') noteForm: NgForm;
  submitted: boolean = false;
  note: string;
  isNew: boolean = false;
  selectedNote: PrescriptionNote;
  @Output() noteItemChanged: EventEmitter<{ note: PrescriptionNote, is_new: boolean }>
    = new EventEmitter<{ note: PrescriptionNote, is_new: boolean }>();



  ngOnInit(): void {
  }




  onFormSubmit() {
    this.submitted = true;
    if (this.noteForm.valid) {
      this.submitted = false;
      this.selectedNote.note = this.note;
      this.noteItemChanged.emit({ note: this.selectedNote, is_new: this.isNew });
      var gg = <HTMLButtonElement>document.getElementById('toggleNoteModalBtn');
      gg.click();
    }

  }




  showModal(note: PrescriptionNote, is_new: boolean) {
    this.isNew = is_new;
    this.submitted = false;
    this.selectedNote = note;
    if (is_new) {
      this.noteForm.reset();
    }
    else {
      this.note = this.selectedNote.note;
    }
    var gg = <HTMLButtonElement>document.getElementById('toggleNoteModalBtn');
    gg.click();
  }





}
