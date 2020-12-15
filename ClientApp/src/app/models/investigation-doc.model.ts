import { User } from "./user.model";

export class InvestigationDoc{
  id: number;
  prescription_id: number;
  investigation_tag_id: number;
  name: string;
  abbreviation:string;
  file_location: string;
  file_name: string;
  created_date: Date;
  doctor: User;
  patient: User;
  investigator:User;
  investigation_status: InvestigationStatus
}




 export enum InvestigationStatus
{
    Completed,
    Inprogress,
    Pending,
    Canceled
}
