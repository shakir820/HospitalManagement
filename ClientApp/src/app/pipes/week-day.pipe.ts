import { WeekDay } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekDay'
})
export class WeekDayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    var week_day_name:string = '';
    switch(value){
      case WeekDay.Friday:
        week_day_name = 'Friday';
        break;

        case WeekDay.Saturday:
        week_day_name = 'Saturday';
        break;

        case WeekDay.Sunday:
        week_day_name = 'Sunday';
        break;

        case WeekDay.Monday:
        week_day_name = 'Monday';
        break;

        case WeekDay.Tuesday:
        week_day_name = 'Tuesday';
        break;

        case WeekDay.Wednesday:
        week_day_name = 'Wednesday';
        break;

        case WeekDay.Thursday:
        week_day_name = 'Thursday';
        break;
    }

    return week_day_name;
  }

}
