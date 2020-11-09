import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-language-tag',
  templateUrl: './language-tag.component.html',
  styleUrls: ['./language-tag.component.css']
})
export class LanguageTagComponent implements OnInit {

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
