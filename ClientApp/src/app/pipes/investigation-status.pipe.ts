import { Pipe, PipeTransform } from '@angular/core';
import { InvestigationStatus } from '../models/investigation-doc.model';

@Pipe({
  name: 'investigationStatus'
})
export class InvestigationStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    var inv_status = '';
    switch(value){
      case InvestigationStatus.Canceled:
        inv_status = 'Canceled';
        break;

        case InvestigationStatus.Completed:
        inv_status = 'Completed';
        break;

        case InvestigationStatus.Inprogress:
        inv_status = 'Inprogress';
        break;

        case InvestigationStatus.Pending:
        inv_status = 'Pending';
        break;
    }

    return inv_status;
  }

}
