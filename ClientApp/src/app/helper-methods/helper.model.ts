import { DoctorAppointment } from "../models/doctor-appointment.model";
import { Language } from "../models/langauge.model";
import { Schedule } from "../models/schedule.model";
import { Speciality } from "../models/speciality.model";
import { User } from "../models/user.model";

export class Helper {

  static resolveLanguagesResult(result: Language[], model_lang: Language[]) {
    if(result == undefined || result.length == 0) return model_lang;

    result.forEach(val => {
      var lang = new Language();
      lang.id = val.id;
      lang.languageName = val.languageName;
      model_lang.push(lang);
    });
  }



  static resolveSpecialitiesResult(result: Speciality[], model_specialities: Speciality[]) {
    if(result == undefined || result.length == 0) return model_specialities;

    result.forEach(val => {
      var speciality = new Speciality();
      speciality.id = val.id;
      speciality.specialityName = val.specialityName;
      model_specialities.push(speciality);
    });
  }



  static resolveScheduleResult(result: Schedule[], model_list: Schedule[]) {
    if(result == undefined || result.length == 0) return model_list;

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
    var date_string = (new Date(date)).toTimeString();
    var time_array = date_string.split(':');
    var time_string = `${time_array[0]}:${time_array[1]}`;
    return time_string;
  }




  static resolveUserListResult(result_doctor_list:User[], doctor_list:User[]){
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

       doctor.name = doctor_result.name;
       doctor.new_patient_visiting_price = doctor_result.new_patient_visiting_price;
       doctor.old_patient_visiting_price = doctor_result.old_patient_visiting_price;
       doctor.phoneNumber = doctor_result.phoneNumber;
       doctor.roles = [];
       if(doctor_result.roles != undefined && doctor_result.roles != null){
        doctor_result.roles.forEach(val => {
          doctor.roles.push(val);
        });
       }

      doctor.schedules = [];
      if(doctor_result.schedules != undefined && doctor_result.schedules != null){
        Helper.resolveScheduleResult(doctor_result.schedules, doctor.schedules);
      }

      doctor.specialities = [];
      if(doctor_result.specialities != undefined && doctor_result.specialities != null){
        Helper.resolveSpecialitiesResult(doctor_result.specialities, doctor.specialities);
      }
      doctor.state_name = doctor_result.state_name;
      doctor.types_of =  doctor_result.types_of;


      //appointment details
      if(doctor_result.appointment != undefined){
        doctor.appointment = new DoctorAppointment();
        if(doctor_result.appointment.appointment_date != undefined){
          doctor.appointment.appointment_date = new Date(doctor_result.appointment.appointment_date);
        }

        doctor.appointment.consulted = doctor_result.appointment.consulted;
        if(doctor_result.appointment.created_date != undefined){
          doctor.appointment.created_date = new Date(doctor_result.appointment.created_date);
        }

        doctor.appointment.doctor_id = doctor_result.appointment.doctor_id;
        doctor.appointment.doctor_name = doctor_result.appointment.doctor_name;
        if(doctor_result.appointment.end_time != undefined){
          doctor.appointment.end_time = new Date(doctor_result.appointment.end_time);
        }

        doctor.appointment.id = doctor_result.appointment.id;
        doctor.appointment.patient_id = doctor_result.appointment.patient_id;
        doctor.appointment.patient_name = doctor_result.appointment.patient_name;
        doctor.appointment.serial_no = doctor_result.appointment.serial_no;
        if(doctor_result.appointment.start_time != undefined){
          doctor.appointment.start_time = new Date(doctor_result.appointment.start_time)
        }
        doctor.appointment.visiting_price = doctor_result.appointment.visiting_price;
      }



      doctor_list.push(doctor);
    });
  }


  static resolveAppointments(result:DoctorAppointment[], model_List:DoctorAppointment[]){
    result.forEach(val => {
      var appointment = new DoctorAppointment();
      if(val.appointment_date != undefined){
        appointment.appointment_date = new Date(val.appointment_date);
      }

      if(val.created_date != undefined){
        appointment.created_date = new Date(val.created_date);
      }

      if(val.modified_date != undefined){
        appointment.modified_date = new Date(val.modified_date);
      }

      appointment.doctor_id = val.doctor_id;
      appointment.doctor_name = val.doctor_name;
      appointment.id = val.id;
      appointment.consulted = val.consulted;
      appointment.visiting_price = val.visiting_price;
      appointment.patient_id = val.patient_id;
      appointment.patient_name = val.patient_name;
      appointment.serial_no = val.serial_no;

      model_List.push(appointment);
    });
  }

}
