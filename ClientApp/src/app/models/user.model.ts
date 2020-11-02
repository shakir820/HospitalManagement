import { Language } from "./langauge.model";
import { Schedule } from "./schedule.model";
import { Speciality } from "./speciality.model";

export class User{

  public id:number;
  public name:string;
  public username:string;
  public email:string;
  public age:number;
  public gender:string;
  public password:string;
  public roles:string[] = [];
  public role:string;
  public profile_pic: string | ArrayBuffer;
  public phoneNumber: string;
  public isActice: boolean;
  public city_name: string;
  public country_name: string;
  public country_phone_code: number;
  public country_short_name: string;
  public state_name: string;
  public bloodGroup: string;


  // doctor info
  public bmdc_certifcate: string;
  public approved: boolean = false;
  public doctor_title: string;
  public degree_tittle: string;
  public biography: string;
  public specialities: Speciality[] = [];
  public experience: number;
  public types_of: string;
  public languages: Language[] = [];
  public schedules: Schedule[] = [];
  public new_patient_visiting_price: number;
  public old_patient_visiting_price: number

}
