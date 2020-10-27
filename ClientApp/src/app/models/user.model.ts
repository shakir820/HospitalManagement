
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
  // extra info
  public bloodGroup: string;
  public bmdc_certifcate: string;
  public approved: boolean = false;
  public city_name: string;
  public country_name: string;
  public country_phone_code: number;
  public country_short_name: string;
  public state_name: string;

}
