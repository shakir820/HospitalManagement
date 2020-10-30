import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-speciality-tag',
  templateUrl: './speciality-tag.component.html',
  styleUrls: ['./speciality-tag.component.css']
})
export class SpecialityTagComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() tagDeleteClicked: EventEmitter<number> = new EventEmitter<number>();

  @Input() tagId: number;
  @Input() tagName:string;




  onClicked(event_data){
    this.tagDeleteClicked.emit(this.tagId);
  }
}
