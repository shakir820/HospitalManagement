import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { CookieService } from 'ngx-cookie-service';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private _baseUrl: string;

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string, private cookieService: CookieService) {
    this._baseUrl = baseUrl;
  }

  public countryList: Country[] = [];
  public stateList: string[] = [];
  public cityList: string[] = [];
  public access_token:string;
  private myToken = "w8Ii6e0BzpIFlvWK-51EVXbGpnDimtfy58jlUYHNQ_xE-PosqApOGl7Stjedo4SI-Ds";


  getAccessToken():Promise<boolean>{

    let promise = new Promise<boolean>((resolve, rejects)=>{

      this.httpClient.get<{auth_token: string }>("https://www.universal-tutorial.com/api/getaccesstoken",
      {headers: {'Accept': 'application/json', 'api-token': this.myToken, 'user-email': 'shakir.sha95@gmail.com'}}).subscribe(result=>{
        console.log(result);
        if(result.auth_token != null){
          this.access_token = result.auth_token;
          resolve(true);
        }
        else{
          resolve(false);
        }
      }, error => {
        resolve(false);
      });
    });
    return promise;

  }




getCountryList(): Promise<Country[]>{

  let promise = new Promise<Country[]>((resolve, rejects)=>{

    if(this.access_token == null || this.access_token == undefined){
      resolve(null);
      return;
    }

    this.httpClient.get<{ country_name: string, country_phone_code: number, country_short_name: string }[]>( "https://www.universal-tutorial.com/api/countries/",
    {headers: {'Accept': 'application/json', 'Authorization': `Bearer ${this.access_token}` }}).subscribe(result=>{
        console.log(result);
        if(result != null){
          this.countryList = [];
          result.forEach(val=>{
            var country = new Country();
            country.country_name = val.country_name;
            country.country_phone_code = val.country_phone_code;
            country.country_short_name = val.country_short_name;
            this.countryList.push(country);
          });
          resolve(this.countryList);
        }
        else{
          resolve(null);
        }
      }, error=> {
        resolve(null);
        console.log(error);
      });
  });

  return promise;



}



  getStateList(selectedCountry: string): Promise<string[]> {
    let promise = new Promise<string[]>((resolve, rejects)=>{

      if(this.access_token == null || this.access_token == undefined){
        resolve(null);
        return;
      }

      this.httpClient.get<{ state_name: string }[]>( `https://www.universal-tutorial.com/api/states/${selectedCountry}`,
      {headers: {'Accept': 'application/json', 'Authorization': `Bearer ${this.access_token}` }}).subscribe(result=>{
          console.log(result);
          if(result != null){
            this.stateList = [];
            result.forEach(val=>{
              this.stateList.push(val.state_name);
            });
            resolve(this.stateList);
          }
          else{
            resolve(null);
          }
        }, error=> {
          resolve(null);
          console.log(error);
        });
    });

    return promise;
  }


  getCityList(selectedState: string): Promise<string[]> {
    let promise = new Promise<string[]>((resolve, rejects)=>{

      if(this.access_token == null || this.access_token == undefined){
        resolve(null);
        return;
      }

      this.httpClient.get<{ city_name: string }[]>( `https://www.universal-tutorial.com/api/cities/${selectedState}`,
      {headers: {'Accept': 'application/json', 'Authorization': `Bearer ${this.access_token}` }}).subscribe(result=>{
          console.log(result);
          if(result != null){
            this.cityList = [];
            result.forEach(val=>{
              this.cityList.push(val.city_name);
            });
            resolve(this.cityList);
          }
          else{
            resolve(null);
          }
        }, error=> {
          resolve(null);
          console.log(error);
        });
    });

    return promise;
  }






}



