import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string, private cookieService: CookieService) {
    this._baseUrl = baseUrl;
   }

   _baseUrl: string;




}
