import { ElementRef, Inject, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-pic-preview',
  templateUrl: './profile-pic-preview.component.html',
  styleUrls: ['./profile-pic-preview.component.css']
})
export class ProfilePicPreviewComponent implements OnInit {

  constructor( @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
   }

  ngOnInit(): void {
  }

  @ViewChild('imagePreview', { static: true }) imagePreviewRef: ElementRef;
  _baseUrl: string;
  _userId;


  @Input() set user_id(val: number){
    this._userId = val;
    console.log(this._userId);
    this.ShowProfileImage();
  }



  ShowProfileImage() {
    console.log("getting image");
    (<HTMLElement>this.imagePreviewRef.nativeElement).style.backgroundImage = `url(${this._baseUrl}` +
      'api/usermanager/GetProfilePic?id=' + this._userId.toString() + ')';
  }

}
