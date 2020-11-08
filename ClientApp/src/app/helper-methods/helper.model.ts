import { Language } from "../models/langauge.model";
import { Schedule } from "../models/schedule.model";
import { Speciality } from "../models/speciality.model";
import { User } from "../models/user.model";

export class Helper {

  static resolveLanguagesResult(result: Language[], model_lang: Language[]) {
    result.forEach(val => {
      var lang = new Language();
      lang.id = val.id;
      lang.languageName = val.languageName;
      model_lang.push(lang);
    });
  }



  static resolveSpecialitiesResult(result: Speciality[], model_specialities: Speciality[]) {
    result.forEach(val => {
      var speciality = new Speciality();
      speciality.id = val.id;
      speciality.specialityName = val.specialityName;
      model_specialities.push(speciality);
    });
  }



  static resolveScheduleResult(result: Schedule[], model_list: Schedule[]) {
    result.forEach(val => {
      var schedule = new Schedule();
      schedule.day_name = val.day_name;
      schedule.end_time = new Date(val.end_time);
      schedule.id = val.id;
      schedule.start_time = new Date(val.start_time);
      model_list.push(schedule);
    });
  }


  static converDateToTimeString(date: Date): string {
    var date_string = date.toTimeString();
    var time_array = date_string.split(':');
    var time_string = `${time_array[0]}:${time_array[1]}`;
    return time_string;
  }




  static resolveDoctorListResult(result_doctor_list:User[], doctor_list:User[]){
    result_doctor_list.forEach(doctor_result => {
      var doctor = new User();
      doctor.username = doctor_result.username;
      doctor.email = doctor_result.email;

      doctor.id = doctor_result.id;
      doctor.age = doctor_result.age;
      doctor.approved = doctor_result.approved;
      doctor.biography = doctor_result.biography;
      doctor.bloodGroup = doctor_result.bloodGroup;
      doctor.bmdc_certifcate = doctor_result.bmdc_certifcate;
      doctor.city_name = doctor_result.city_name;
      doctor.country_name = doctor_result.country_name;
      doctor.country_phone_code = doctor_result.country_phone_code;
      doctor.country_short_name = doctor_result.country_short_name;
      doctor.degree_title = doctor_result.degree_title;
      doctor.doctor_title= doctor_result.doctor_title;
      doctor.experience = doctor_result.experience;
      doctor.gender = doctor_result.gender;
      doctor.isActive = doctor_result.isActive;
      doctor.languages =[];
      if(doctor_result.languages != undefined && doctor_result.languages != null){
        doctor_result.languages.forEach(val => {
          var lang = new Language();
          lang.id = val.id;
          lang.languageName = val.languageName;
          doctor.languages.push(lang);
        });
      }

       this.doctor.name = result.doctor.name;
       this.doctor.new_patient_visiting_price = result.doctor.new_patient_visiting_price;
       this.doctor.old_patient_visiting_price = result.doctor.old_patient_visiting_price;
       this.doctor.phoneNumber = result.doctor.phoneNumber;
       this.doctor.roles = [];
       result.doctor.roles.forEach(val => {
         this.doctor.roles.push(val);
       });
      this.doctor.schedules = [];
      Helper.resolveScheduleResult(result.doctor.schedules, this.doctor.schedules);
      this.doctor.specialities = [];
      Helper.resolveSpecialitiesResult(result.doctor.specialities, this.doctor.specialities);
      this.doctor.state_name = result.doctor.state_name;
      this.doctor.types_of = result.doctor.types_of;
    })
  }

}
