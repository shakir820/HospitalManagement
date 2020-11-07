import { Language } from "../models/langauge.model";
import { Schedule } from "../models/schedule.model";
import { Speciality } from "../models/speciality.model";

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



}
